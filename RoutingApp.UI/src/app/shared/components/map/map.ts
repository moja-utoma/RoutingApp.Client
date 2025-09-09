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
}

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements OnChanges, AfterViewInit { //mapView
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

    if (this.points.length === 0) {
      this.map.setView([50.4501, 30.5234], 12);
      return;
    }

    this.points.forEach((p) => {
      const marker = L.marker([p.lat, p.lng]);
      if (p.popup) marker.bindPopup(p.popup);
      marker.addTo(this.map!);
      this.markers.push(marker);
    });

    if (this.markers.length === 1) {
      this.map.setView(this.markers[0].getLatLng(), 14);
    } else {
      const bounds = L.latLngBounds(this.markers.map((m) => m.getLatLng()));
      this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }

    setTimeout(() => this.map?.invalidateSize(), 0); // ensures Leaflet’s map redraw happens after the DOM/layout is stable
  }
}
0
