import { Routes } from '@angular/router';
import { Base } from './shared/layouts/base/base';
import { DeliveryPointsList } from './features/delivery-points/delivery-points-list/delivery-points-list';
import { Home } from './features/home/home';
import { WarehousesList } from './features/warehouses/warehouses-list/warehouses-list';
import { VehiclesList } from './features/vehicles/vehicles-list/vehicles-list';
import { RoutesList } from './features/routes/routes-list/routes-list';
import { WarehouseDetailsPage } from './features/warehouses/warehouse-details/warehouse-details';
import { DeliveryPointsDetailsPage } from './features/delivery-points/delivery-points-details-page/delivery-points-details-page';
import { DeliveryPointsCreate } from './features/delivery-points/delivery-points-create/delivery-points-create';
import { RoutesDetailsPage } from './features/routes/routes-details-page/routes-details-page';
import { RoutesCreate } from './features/routes/routes-create/routes-create';
import { VehiclesDetailsPage } from './features/vehicles/vehicles-details-page/vehicles-details-page';
import { VehiclesCreate } from './features/vehicles/vehicles-create/vehicles-create';

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
        path: 'delivery-points/create',
        component: DeliveryPointsCreate,
      },
      {
        path: 'delivery-points/:id',
        component: DeliveryPointsDetailsPage,
      },
      {
        path: 'delivery-points/edit/:id',
        component: DeliveryPointsCreate,
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
        path: 'vehicles/create',
        component: VehiclesCreate,
      },
      {
        path: 'vehicles/:id',
        component: VehiclesDetailsPage,
      },
      {
        path: 'vehicles/edit/:id',
        component: VehiclesCreate,
      },
      {
        path: 'routes',
        component: RoutesList,
      },
      {
        path: 'routes/create',
        component: RoutesCreate,
      },
      {
        path: 'routes/:id',
        component: RoutesDetailsPage,
      },
      {
        path: 'routes/edit/:id',
        component: RoutesCreate,
      },
    ],
  },
];
