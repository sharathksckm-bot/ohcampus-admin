import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';

const routes: Routes = [];

export const NotificationRoutingModule : Route[]=[
  {
    path:'',
    pathMatch: 'full',
    redirectTo: 'notificationList'
  },
  {
    path : 'notificationList',
    component: ViewNotificationComponent,
  },
  {
    path: 'addNotification',
    component: AddNotificationComponent,
  },
  {
    path: 'updateNotification/:id',
    component: AddNotificationComponent
  }
]
