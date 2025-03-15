import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0:
        return 'Member';
      case 100:
        return 'PT';
      case 999:
        return 'Admin';
      default:
        return 'Unknown Role';
    }
  }
}
