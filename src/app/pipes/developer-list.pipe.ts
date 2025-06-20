import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.models';

@Pipe({ name: 'developerList', standalone: true })
export class DeveloperListPipe implements PipeTransform {
  transform(tasks: Task[]): string[] {
    const developers = new Set<string>();
    tasks.forEach(task => {
      task.developers.forEach(dev => developers.add(dev));
    });
    return Array.from(developers);
  }
}
