import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficulty'
})
export class DifficultyPipe implements PipeTransform {

    transform(value: number): string {
      switch (value) {
        case 0:
          return 'Easy';
        case 1:
          return 'Medium';
        case 2:
          return 'Hard';
        default:
          return 'Unknown Role';
      }
    }
  }
