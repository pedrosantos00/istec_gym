import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { ApplicationUser } from '../../interfaces/applicationUser.interface';
import { environment } from '../../../../environments/environment.development';
import { Paginator } from '../../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class AppUsersService {
  constructor(private client: HttpClient) {}

  getUsers(
    pageNumber: number,
    pageSize: number
  ): Observable<ApiResponse<Paginator<ApplicationUser[]>>> {
    return this.client.get<ApiResponse<Paginator<ApplicationUser[]>>>(
      `${environment.baseApiUrl}/users?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  updateUserRole(
    user: ApplicationUser
  ): Observable<ApiResponse<ApplicationUser>> {
    return this.client.patch<ApiResponse<ApplicationUser>>(
      `${environment.baseApiUrl}/users/${user.id}/role`,
      user
    );
  }

  blockUser(user: ApplicationUser): Observable<ApiResponse<boolean>> {
    return this.client.delete<ApiResponse<boolean>>(
      `${environment.baseApiUrl}/users/${user.id}`
    );
  }

  getLoggedUser(): Observable<ApiResponse<ApplicationUser>> {
    return this.client.get<ApiResponse<ApplicationUser>>(
      `${environment.baseApiUrl}/users/current`
    );
  }
}
