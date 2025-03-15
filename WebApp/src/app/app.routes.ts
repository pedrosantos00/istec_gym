import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DefaultComponent } from './shared/components/layout/default/default.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InAppLayoutComponent } from './shared/components/layout/in-app-layout/in-app-layout.component';
import { ManageClassesComponent } from './pages/manage-classes/manage-classes/manage-classes.component';
import { ManageMembersComponent } from './pages/manage-members/manage-members.component';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { roleGuard } from './shared/guards/role/role.guard';
import { ProfileComponent } from './pages/profile/profile/profile.component';

export const routes: Routes = [
  {
    component: DefaultComponent,
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'confirm',
        component: ConfirmEmailComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    canActivate: [AuthGuard],
    component: InAppLayoutComponent,
    path: 'dashboard',
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        canActivate: [roleGuard],
        data: { roles: ['PT', "Admin"] },
        path: 'manage-classes',
        component: ManageClassesComponent,
      },
      {
        canActivate: [roleGuard],
        data: { roles: ['PT', "Admin"] },
        path: 'manage-members',
        component: ManageMembersComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ],
  },
];
