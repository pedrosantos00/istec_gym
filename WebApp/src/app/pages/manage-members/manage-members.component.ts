import { Component, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ApplicationUser } from '../../shared/interfaces/applicationUser.interface';
import { MenuItem, MessageService } from 'primeng/api';
import { AppUsersService } from '../../shared/services/app-users/app-users.service';
import { lastValueFrom } from 'rxjs';
import { Role } from '../../shared/enums/role.enum';
import { RolePipe } from '../../shared/pipes/role.pipe';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-manage-members',
  imports: [
    TableModule,
    CommonModule,
    ContextMenuModule,
    CommonModule,
    RolePipe,
    ToastModule,
    ContextMenu,
  ],
  templateUrl: './manage-members.component.html',
  styleUrl: './manage-members.component.scss',
})
export class ManageMembersComponent {
  users: ApplicationUser[] = [];

  selectedUser?: ApplicationUser;

  items!: MenuItem[];

  first = 0;
  rows = 10;
  totalRecords = 0;

  constructor(
    private usersService: AppUsersService,
    private messageService: MessageService,
    private jwtService: JWTTokenService
  ) {}

  async ngOnInit() {
    await this.loadList();

    this.items = [
      {
        label: 'Roles',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Member',
            command: () => {
              this.selectedUser!.role = Role.Member;
              this.updateUserRole(this.selectedUser!);
            },
          },
          {
            label: 'PT',
            command: () => {
              this.selectedUser!.role = Role.PT;
              this.updateUserRole(this.selectedUser!);
            },
          },
          {
            label: 'Admin',
            visible : this.jwtService.getRole() === 'Admin',
            command: () => {
              this.selectedUser!.role = Role.Admin;
              this.updateUserRole(this.selectedUser!);
            },
          },
        ],
      },
      {
        label: 'Block',
        icon: 'pi pi-fw pi-ban',
        command: () => this.blockUser(this.selectedUser!),
      },
    ];
  }

  async updateUserRole(user: ApplicationUser) {
    await lastValueFrom(this.usersService.updateUserRole(user))
      .then((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'User',
          detail: 'User Role Changed Successfully',
          life: 3000,
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: '',
          life: 3000,
        });
      });
  }

  async blockUser(user: ApplicationUser) {
    await lastValueFrom(this.usersService.blockUser(user))
    .then((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'User',
        detail: 'User successfully blocked',
        life: 3000,
      });
      this.loadList();
    })
    .catch((error) => {
      this.messageService.add({
        severity: 'error',
        summary: '',
        life: 3000,
      });
    });;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadList();
  }

  async loadList() {
    const pageNumber = this.first / this.rows + 1;
    const t = (
      await lastValueFrom(this.usersService.getUsers(pageNumber, this.rows))
    ).data;
    this.users = t?.data || [];
    this.totalRecords = t?.totalRecords || 0;
  }
}
