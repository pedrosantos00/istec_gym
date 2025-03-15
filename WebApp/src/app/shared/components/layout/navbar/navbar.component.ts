import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDumbbell } from '@ng-icons/lucide';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { JWTTokenService } from '../../../services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    NgIcon,
    RouterModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    ToggleSwitchModule,
    FormsModule,
    MenubarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  viewProviders: [provideIcons({ lucideDumbbell })],
  standalone: true,
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  checked: boolean = false;
  isLoggedIn = false;

  constructor(private jwtService : JWTTokenService){
    this.isLoggedIn = this.jwtService.isLoggedIn();
  }

  ngOnInit() {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      const element = document.querySelector('html');
      element?.classList.add('dark');

      this.checked = true;
    }

    this.items = [];
  }

  toggleTheme() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');

    const themeToSet = element?.classList.contains('dark');

    localStorage.setItem('theme', themeToSet ? 'dark' : 'light');
  }


  isScrolled = false;

  // Listen to the window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = offset > 10; // Apply scrolled when offset > 10px
  }
}
