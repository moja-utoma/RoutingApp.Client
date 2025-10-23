import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { RoutesService } from "../../features/routes/routes-service";
import { MapView } from "../components/map-view/map-view";

@Injectable({ providedIn: 'root' })
export class RouteStreamManagerService {
  private streams: Record<
    number,
    { sub: Subscription; controller: AbortController; mapView: MapView }
  > = {};

  constructor(private routeService: RoutesService) {}

  setMapView(routeId: number, view: MapView): void {
    const stream = this.streams[routeId];
    if (stream) {
      stream.mapView = view;
    } else {
      this.streams[routeId] = {
        sub: undefined!,
        controller: undefined!,
        mapView: view,
      };
    }
    console.log(`MapView bound for route ${routeId} - ${view}`);
  }

  startStream(
    routeId: number,
    payload: { coordinates: [number, number][]; radiuses: number[] }
  ): void {
    this.stopStream(routeId);

    const controller = new AbortController();
    const sub = this.routeService.streamRoute(routeId, payload).subscribe({
      next: ({ lat, lng }) => {
        console.log(`Emitting point for route ${routeId}:`, lat, lng);
        this.streams[routeId]?.mapView?.updateMovingMarker([lat, lng]);
      },
      error: (err) => {
        console.error(`Streaming error for route ${routeId}:`, err);
      },
      complete: () => {
        this.streams[routeId]?.mapView?.removeMovingMarker();
        this.stopStream(routeId);
        this.removeRouteFromStorage(routeId);
      },
    });

    this.streams[routeId] = {
      sub,
      controller,
      mapView: this.streams[routeId]?.mapView!,
    };

    const raw = localStorage.getItem('activeRoutes');
    const activeRoutes = raw ? JSON.parse(raw) : {};
    activeRoutes[routeId] = payload;
    localStorage.setItem('activeRoutes', JSON.stringify(activeRoutes));
  }

  stopStream(routeId: number): void {
    const stream = this.streams[routeId];
    if (!stream) return;

    //stream.controller?.abort();
    //stream.sub?.unsubscribe();
    //delete this.streams[routeId];
  }

  resumeStream(routeId: number): void {
    const stream = this.streams[routeId];

    // If stream is already active and not closed, do nothing
    if (stream?.sub && !stream.sub.closed) {
      console.log(`Stream for route ${routeId} is already active`);
      return;
    }

    // Otherwise, check localStorage for payload and resume
    const raw = localStorage.getItem('activeRoutes');
    if (!raw) return;

    try {
      const activeRoutes = JSON.parse(raw);
      const payload = activeRoutes[routeId];
      if (payload) {
        console.log(`Resuming stream for route ${routeId}`);
        this.startStream(routeId, payload);
      } else {
        console.warn(`No payload found for route ${routeId}`);
      }
    } catch (e) {
      console.warn(`Failed to resume stream for route ${routeId}:`, e);
    }
  }

  removeRouteFromStorage(routeId: number): void {
    const raw = localStorage.getItem('activeRoutes');
    if (!raw) return;

    const stream = this.streams[routeId];
    if (!stream) return;

    stream.controller?.abort();
    stream.sub?.unsubscribe();
    delete this.streams[routeId];

    const routes = JSON.parse(raw);
    delete routes[routeId];
    localStorage.setItem('activeRoutes', JSON.stringify(routes));
  }
}
