import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { GymClass } from '../../shared/interfaces/gym-class.interface';
import { GymClassService } from '../../shared/services/gym-class/gym-class.service';
import { UserManagement } from '../../shared/interfaces/user-management.interface';
import { MessageService } from 'primeng/api';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';
import { AvailableGymClass } from '../../shared/interfaces/available-gym-class.interface';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TableModule,
    TabsModule,
    TagModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userGymClasses: GymClass[] = [];
  availableGymClasses: AvailableGymClass[] = [];
  email: string = '';

  constructor(
    private gymClassService: GymClassService,
    private messageService: MessageService,
    private jwtService: JWTTokenService
  ) {}

  ngOnInit(): void {
    this.email = this.jwtService.getEmail() || '';
    this.loadGymClasses();
  }

  private handleUserAction(
    gymClass: GymClass | AvailableGymClass,
    action: 'join' | 'leave'
  ) {
    const request: UserManagement = {
      email: this.email,
      gymClassId: gymClass.id,
    };
    const apiCall =
      action === 'join'
        ? this.gymClassService.addUser(request)
        : this.gymClassService.removeUser(request);
    const successMessage =
      action === 'join'
        ? `You joined ${gymClass.name}`
        : `You left ${gymClass.name}`;
    const errorMessage =
      action === 'join'
        ? `Failed to join ${gymClass.name}`
        : `Failed to leave ${gymClass.name}`;

    apiCall.subscribe({
      next: (response) => {
        if (response.data) {
          this.messageService.add({
            severity: 'success',
            summary: successMessage,
            life: 3000,
          });

          if (action === 'join') {
            this.availableGymClasses = this.availableGymClasses.filter(
              (c) => c.id !== gymClass.id
            );
            this.userGymClasses.push(gymClass as GymClass);
          } else {
            this.userGymClasses = this.userGymClasses.filter(
              (c) => c.id !== gymClass.id
            );
            this.availableGymClasses.push(gymClass as AvailableGymClass);
          }

          this.loadGymClasses();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: errorMessage,
            life: 3000,
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred.',
          life: 3000,
        });
      },
    });
  }

  joinClass(selectedClass: AvailableGymClass) {
    if (!this.isClassFull(selectedClass)) {
      this.handleUserAction(selectedClass, 'join');
    }
  }

  requestLeave(classToLeave: GymClass) {
    this.handleUserAction(classToLeave, 'leave');
  }

  private loadGymClasses() {
    this.gymClassService.getCurrentUserClasses().subscribe((response) => {
      this.userGymClasses = response.data ?? [];
    });

    this.gymClassService.getAvailableClasses().subscribe((response) => {
      this.availableGymClasses = response.data ?? [];
    });
  }

  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Medium';
      case 2:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }

  getDifficultySeverity(difficulty: number): any {
    switch (difficulty) {
      case 0:
        return 'success';
      case 1:
        return 'warn';
      case 2:
        return 'danger';
      default:
        return 'info';
    }
  }

  isClassFull(gymClass: AvailableGymClass): boolean {
    return gymClass.totalParticipants >= gymClass.maxParticipants;
  }
}
