import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideChevronDown,
  lucideDumbbell,
} from '@ng-icons/lucide';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgIcon, ButtonModule, CardModule, RouterModule],
  viewProviders: [
    provideIcons({ lucideActivity, lucideChevronDown, lucideDumbbell }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {}
