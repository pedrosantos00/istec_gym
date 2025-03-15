import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  simpleYoutubeshorts,
  simpleX,
  simpleTiktok,
  simpleLinkedin,
  simpleGithub,
} from '@ng-icons/simple-icons';

@Component({
    selector: 'app-footer',
    imports: [CommonModule, NgIcon],
    viewProviders: [
        provideIcons({
            simpleYoutubeshorts,
            simpleX,
            simpleTiktok,
            simpleLinkedin,
            simpleGithub,
        }),
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    standalone: true
})
export class FooterComponent {}
