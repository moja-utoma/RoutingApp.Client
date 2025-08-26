import { Routes } from '@angular/router';
import { Base } from './shared/layouts/base/base';
import { DeliveryPointsList } from './features/delivery-points/delivery-points-list/delivery-points-list';
import { Home } from './features/home/home';
import { WarehousesList } from './features/warehouses/warehouses-list/warehouses-list';
import { VehiclesList } from './features/vehicles/vehicles-list/vehicles-list';
import { RoutesList } from './features/routes/routes-list/routes-list';
import { WarehouseDetailsPage } from './features/warehouses/warehouse-details/warehouse-details';

export const routes: Routes = [
  {
    path: '',
    component: Base,
    children: [
      { path: '', component: Home },
      {
        path: 'delivery-points',
        component: DeliveryPointsList,
      },
      {
        path: 'warehouses',
        component: WarehousesList,
      },
      {
        path: 'warehouses/:id',
        component: WarehouseDetailsPage,
      },
      {
        path: 'vehicles',
        component: VehiclesList,
      },
      {
        path: 'routes',
        component: RoutesList,
      },
    ],
  },
];
