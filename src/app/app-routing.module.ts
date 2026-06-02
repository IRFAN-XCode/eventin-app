import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

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
    loadChildren: () => import('./my-tickets/my-tickets.module').then(m => m.MyTicketsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule),
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./account/my-profile/my-profile.module').then(m => m.MyProfilePageModule),
    canActivate: [AuthGuard]
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
    loadChildren: () => import('./auth/new-password/new-password.module').then(m => m.NewPasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'regist-organizer',
    loadChildren: () => import('./auth/regist-organizer/regist-organizer.module').then(m => m.RegistOrganizerPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'event-detail/:id',
    loadChildren: () => import('./events/event-detail/event-detail.module').then(m => m.EventDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-ticket/:id',
    loadChildren: () => import('./my-tickets/detail-ticket/detail-ticket.module').then(m => m.DetailTicketPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions/:id',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'toc',
    loadChildren: () => import('./account/toc/toc.module').then( m => m.TocPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./account/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./account/faq/faq.module').then( m => m.FaqPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
