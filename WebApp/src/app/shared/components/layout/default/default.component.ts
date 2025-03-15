import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'app-default',
    imports: [RouterModule, CommonModule, NavbarComponent, FooterComponent],
    templateUrl: './default.component.html',
    styleUrl: './default.component.scss',
    standalone: true
})
export class DefaultComponent {}
