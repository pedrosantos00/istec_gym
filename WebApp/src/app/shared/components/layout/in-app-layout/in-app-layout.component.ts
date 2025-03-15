import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { FooterComponent } from '../footer/footer.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDumbbell } from '@ng-icons/lucide';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTTokenService } from '../../../services/jwt-token/jwt-token.service';
import { Role } from '../../../enums/role.enum';

@Component({
  selector: 'app-in-app-layout',
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule,
    FooterComponent,
    NgIcon,
    ToggleSwitchModule,
    FormsModule,
  ],
  templateUrl: './in-app-layout.component.html',
  styleUrl: './in-app-layout.component.scss',
  viewProviders: [provideIcons({ lucideDumbbell })],
})
export class InAppLayoutComponent implements OnInit {
  items: MenuItem[] | undefined;
  userRole: string | undefined = 'Member';
  checked: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private jwtTokenService: JWTTokenService
  ) {}

  toggleTheme() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');

    const themeToSet = element?.classList.contains('dark');

    localStorage.setItem('theme', themeToSet ? 'dark' : 'light');
  }

  ngOnInit(): void {
    this.userRole = this.jwtTokenService.getRole();

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Manage Members',
        icon: 'pi pi-users',
        routerLink: ['/dashboard/manage-members'],
        visible: this.userRole === 'Admin' || this.userRole === 'PT',
      },
      {
        label: 'Manage Classes',
        icon: 'pi pi-clock',
        routerLink: ['/dashboard/manage-classes'],
        visible: this.userRole === 'Admin' || this.userRole === 'PT',
      },
      {
        icon: 'pi pi-fw pi-user',
        styleClass: 'ml-auto',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/dashboard/profile'],
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];

    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      const element = document.querySelector('html');
      element?.classList.add('dark');

      this.checked = true;
    }
  }

  logout() {
    this.jwtTokenService.clearToken();
    this.messageService.add({
      severity: 'success',
      summary: 'Logged out',
      detail: 'You have been logged out',
      life: 3000,
    });
    this.router.navigate(['']);
  }
}
