import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RoutesService } from '../../../features/routes/routes-service';

export interface MapPoint {
  lat: number;
  lng: number;
  popup?: string;
  group?: number;
  isWarehouse?: boolean;
  isConnected?: boolean;
  order?: number;
}

const clusterColors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

function getClusterColor(index: number): string {
  return clusterColors[index % clusterColors.length];
}

const defaultCoords: {
  coords: [number, number];
  zoom: number;
} = {
  coords: [50.4501, 30.5234],
  zoom: 12,
};

const defaultIconSize: L.PointExpression = [40, 41];

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
})
export class MapView implements OnChanges, AfterViewInit {
  //mapView
  @ViewChild('mapEl', { static: true }) private mapEl!: ElementRef<HTMLDivElement>;

  @Input() points: MapPoint[] = [];
  @Input() enableClickToAdd: boolean = false;

  @Output() newPoint = new EventEmitter<MapPoint>();

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private tempMarker?: L.Marker;
  private http = inject(HttpClient);
  private routeService = inject(RoutesService);

  ngAfterViewInit(): void {
    this.initMap();
    this.refreshMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes['points']) {
      this.refreshMarkers();
    }
  }

  private movingMarker?: L.CircleMarker;

  startRouteStream(coords: [number, number][]): void {
    const body = {
      coordinates: coords,
      radiuses: coords.map(() => 1000),
    };

    this.routeService.streamRoute(body).subscribe({
      next: ({ lat, lng }) => {
        const point: L.LatLngExpression = [lat, lng];

        if (!this.movingMarker) {
          this.movingMarker = L.circleMarker(point, {
            radius: 6,
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.8,
          }).addTo(this.map!);
        } else {
          this.movingMarker.setLatLng(point);
        }
      },
      error: (err) => {
        console.error('Streaming error:', err);
      },
    });
  }

  private initMap(): void {
    this.map = L.map(this.mapEl.nativeElement).setView(defaultCoords.coords, defaultCoords.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    if (this.enableClickToAdd) {
      this.map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const point = await this.reverseGeocode(lat, lng);
        const address = point.fullAddress;
        console.log('Clicked:', { lat, lng, address });

        // Remove previous temp marker
        if (this.tempMarker) {
          this.map!.removeLayer(this.tempMarker);
        }

        // Add new marker
        this.tempMarker = L.marker([lat, lng], {
          icon: L.icon({ iconUrl: 'icons/delivery.png', iconSize: defaultIconSize }),
        }).addTo(this.map!);
        this.tempMarker.bindPopup(address).openPopup();

        this.handleNewPoint({ lat, lng, popup: address });
      });
    }
  }

  reverseGeocode(
    lat: number,
    lng: number
  ): Promise<{
    fullAddress: string;
    address: string;
    latitude: number;
    longitude: number;
  }> {
    const url = `${environment.api.baseUrl}/api/Ors/reverse?lat=${lat}&lng=${lng}`;
    return firstValueFrom(
      this.http.get<{
        fullAddress: string;
        address: string;
        latitude: number;
        longitude: number;
      }>(url)
    );
  }

  private handleNewPoint(point: MapPoint): void {
    this.newPoint.emit(point);
  }

  private refreshMarkers(): void {
    if (!this.map) return;

    this.clearAllMarkers();

    const routeGroups: MapPoint[][] = [];

    console.log(this.points);
    this.points.forEach((p) => {
      const icon = p.isWarehouse
        ? L.icon({ iconUrl: 'icons/warehouse.png', iconSize: defaultIconSize })
        : L.icon({ iconUrl: 'icons/delivery.png', iconSize: defaultIconSize });

      const marker = L.marker([p.lat, p.lng], { icon });
      if (p.popup) marker.bindPopup(p.popup);
      marker.addTo(this.map!);
      this.markers.push(marker);

      if (p.isConnected && p.group !== undefined) {
        if (!routeGroups[p.group]) routeGroups[p.group] = [];
        routeGroups[p.group].push(p);
      }
    });

    routeGroups.forEach((groupPoints, index) => {
      const sorted = [...groupPoints].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const latlngs: L.LatLngTuple[] = sorted.map((p) => [p.lat, p.lng] as L.LatLngTuple);
      this.drawRoadRoute(
        latlngs.map(([lat, lng]) => [lng, lat]),
        getClusterColor(index)
      );
    });

    if (this.markers.length === 1) {
      this.map.setView(this.markers[0].getLatLng(), 14);
    } else {
      const bounds = L.latLngBounds(this.markers.map((m) => m.getLatLng()));
      this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private async drawRoadRoute(coords: [number, number][], color: string): Promise<void> {
    const body = {
      coordinates: coords,
      radiuses: coords.map(() => 1000),
    };

    this.http.post('https://localhost:7136/api/Ors/route', body).subscribe({
      next: (geojson: any) => {
        L.geoJSON(geojson, {
          style: {
            color,
            weight: 4,
            opacity: 0.9,
          },
        }).addTo(this.map!);
      },
      error: (err) => {
        console.error('Proxy routing error:', err);
      },
    });
  }

  clearAllMarkers(): void {
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    // if (this.tempMarker) {
    //   this.map?.removeLayer(this.tempMarker);
    //   this.tempMarker = undefined;
    // }
  }
}
