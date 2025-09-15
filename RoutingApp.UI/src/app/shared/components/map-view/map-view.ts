import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

  private map?: L.Map;
  private markers: L.Marker[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    this.refreshMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes['points']) {
      this.refreshMarkers();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapEl.nativeElement).setView(defaultCoords.coords, defaultCoords.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  private refreshMarkers(): void {
    if (!this.map) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];

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
    try {
      // move into service
      const response = await fetch('https://localhost:7136/api/Routes/ors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates: coords, radiuses: coords.map(() => 1000) }),
      });

      if (!response.ok) {
        console.error('Proxy request failed:', response.statusText);
        return;
      }

      const geojson = await response.json();
      console.log('geojson', geojson);

      L.geoJSON(geojson, {
        style: {
          color,
          weight: 4,
          opacity: 0.9,
        },
      }).addTo(this.map!);
    } catch (error) {
      console.error('Proxy routing error:', error);
    }
  }
}
