import { H } from '@angular/cdk/keycodes';
import { Routes } from '@angular/router';
import { Home } from './Feactures/Dashboard/home/home';
import { Login } from './Shared/login/login';
import { Inicio } from './Feactures/Obrero/inicio/inicio';
import { aunthGuard } from './Core/aunth-guard';
import { Empleados } from './Feactures/Dashboard/empleados/empleados';
import { Inventario } from './Feactures/Dashboard/inventario/inventario';
import { Panel } from './Feactures/Dashboard/panel/panel';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'Inicio', component: Inicio, canActivate: [aunthGuard], data: { role: 'OBRERO' } },

    {
    path: 'home',
    component: Home,
    canActivate: [aunthGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', component: Panel },
      { path: 'empleados', component: Empleados },
      { path: 'inventario', component: Inventario }
    ]
  },

];
