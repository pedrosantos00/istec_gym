import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GymClass } from '../../interfaces/gym-class.interface';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { Paginator } from '../../interfaces/paginator.interface';
import { CreateGymClassDTO } from '../../interfaces/create-gym-class.interface';
import { UpdateGymClassDTO } from '../../interfaces/update-gym-class.interface';
import { UserManagement } from '../../interfaces/user-management.interface';
import { AvailableGymClass } from '../../interfaces/available-gym-class.interface';

@Injectable({
  providedIn: 'root',
})
export class GymClassService {
  constructor(private client: HttpClient) {}

  getAll(
    pageNumber: number,
    pageSize: number
  ): Observable<ApiResponse<Paginator<GymClass[]>>> {
    return this.client.get<ApiResponse<Paginator<GymClass[]>>>(
      `${environment.baseApiUrl}/gymClasses?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getCurrentUserClasses(
  ): Observable<ApiResponse<GymClass[]>> {
    return this.client.get<ApiResponse<GymClass[]>>(
      `${environment.baseApiUrl}/gymClasses/current`
    );
  }

  getAvailableClasses(
  ): Observable<ApiResponse<AvailableGymClass[]>> {
    return this.client.get<ApiResponse<AvailableGymClass[]>>(
      `${environment.baseApiUrl}/gymClasses/available`
    );
  }

  addUser(model : UserManagement): Observable<ApiResponse<Boolean>> {
    return this.client.post<ApiResponse<Boolean>>(
      `${environment.baseApiUrl}/gymClasses/add-user`,
      model
    );
  }

  removeUser(model : UserManagement): Observable<ApiResponse<Boolean>> {
    return this.client.post<ApiResponse<Boolean>>(
      `${environment.baseApiUrl}/gymClasses/remove-user`,
      model
    );
  }

  create(
    gymClass: CreateGymClassDTO
  ): Observable<ApiResponse<CreateGymClassDTO>> {
    return this.client.post<ApiResponse<CreateGymClassDTO>>(
      `${environment.baseApiUrl}/gymClasses`,
      gymClass
    );
  }

  update(gymClass: UpdateGymClassDTO): Observable<ApiResponse<GymClass>> {
    return this.client.post<ApiResponse<GymClass>>(
      `${environment.baseApiUrl}/gymClasses/${gymClass.id}/update`,
      gymClass
    );
  }

  delete(gymId: string): Observable<ApiResponse<CreateGymClassDTO>> {
    return this.client.delete<ApiResponse<CreateGymClassDTO>>(
      `${environment.baseApiUrl}/gymClasses/${gymId}/delete`
    );
  }
}
