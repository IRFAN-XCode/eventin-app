import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then(m => m.EventsPageModule)
  },
  {
    path: 'my-tickets',
    loadChildren: () => import('./my-tickets/my-tickets.module').then(m => m.MyTicketsPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./account/my-profile/my-profile.module').then(m => m.MyProfilePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'regist',
    loadChildren: () => import('./auth/regist/regist.module').then(m => m.RegistPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./auth/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./auth/new-password/new-password.module').then(m => m.NewPasswordPageModule)
  },
  {
    path: 'regist-organizer',
    loadChildren: () => import('./auth/regist-organizer/regist-organizer.module').then(m => m.RegistOrganizerPageModule)
  },
  {
    path: 'login-organizer',
    loadChildren: () => import('./auth/login-organizer/login-organizer.module').then(m => m.LoginOrganizerPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'event-detail',
    loadChildren: () => import('./events/event-detail/event-detail.module').then(m => m.EventDetailPageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
