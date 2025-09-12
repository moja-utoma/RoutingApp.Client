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

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements OnChanges, AfterViewInit {
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
    this.map = L.map(this.mapEl.nativeElement).setView([50.4501, 30.5234], 12);

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

    this.points.forEach((p) => {
      const icon = p.isWarehouse
        ? L.icon({ iconUrl: 'icons/warehouse.png', iconSize: [40, 41] })
        : L.icon({ iconUrl: 'icons/delivery.png', iconSize: [40, 41] });

      const marker = L.marker([p.lat, p.lng], { icon });
      if (p.popup) marker.bindPopup(p.popup);
      marker.addTo(this.map!);
      this.markers.push(marker);

      if (p.isConnected && p.group !== undefined) {
        if (!routeGroups[p.group]) routeGroups[p.group] = [];
        routeGroups[p.group].push(p);
      }
    });

    // Draw polylines for each connected route group
    routeGroups.forEach((groupPoints, index) => {
      const sorted = [...groupPoints].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const latlngs: L.LatLngTuple[] = sorted.map((p) => [p.lat, p.lng] as L.LatLngTuple);
      L.polyline(latlngs, {
        color: getClusterColor(index),
        weight: 4,
        opacity: 0.8,
      }).addTo(this.map!);
    });

    if (this.markers.length === 1) {
      this.map.setView(this.markers[0].getLatLng(), 14);
    } else {
      const bounds = L.latLngBounds(this.markers.map((m) => m.getLatLng()));
      this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }

    setTimeout(() => this.map?.invalidateSize(), 0);
  }
}
