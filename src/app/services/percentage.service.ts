import { Injectable } from '@angular/core';
import { PercentageData, Task } from '../models/task.models';
import { ColorService } from './color.service';

@Injectable({ providedIn: 'root' })
export class PercentageService {
  
  constructor(private colorService: ColorService) {}

  getStatusPercents(tasks: Task[]): PercentageData[] {
    return [
      { label: 'Ready to start', color: this.colorService.getStatusColor('Ready to start'), percent: this.percent(tasks, 'Ready to start', 'status') },
      { label: 'In Progress', color: this.colorService.getStatusColor('In Progress'), percent: this.percent(tasks, 'In Progress', 'status') },
      { label: 'Waiting for review', color: this.colorService.getStatusColor('Waiting for review'), percent: this.percent(tasks, 'Waiting for review', 'status') },
      { label: 'Pending Deploy', color: this.colorService.getStatusColor('Pending Deploy'), percent: this.percent(tasks, 'Pending Deploy', 'status') },
      { label: 'Done', color: this.colorService.getStatusColor('Done'), percent: this.percent(tasks, 'Done', 'status') },
      { label: 'Stuck', color: this.colorService.getStatusColor('Stuck'), percent: this.percent(tasks, 'Stuck', 'status') }
    ];
  }

  getPriorityPercents(tasks: Task[]): PercentageData[] {
    return [
      { label: 'Critical', color: this.colorService.getPriorityColor('Critical'), percent: this.percent(tasks, 'Critical', 'priority') },
      { label: 'High', color: this.colorService.getPriorityColor('High'), percent: this.percent(tasks, 'High', 'priority') },
      { label: 'Medium', color: this.colorService.getPriorityColor('Medium'), percent: this.percent(tasks, 'Medium', 'priority') },
      { label: 'Low', color: this.colorService.getPriorityColor('Low'), percent: this.percent(tasks, 'Low', 'priority') },
      { label: 'Best Effort', color: this.colorService.getPriorityColor('Best Effort'), percent: this.percent(tasks, 'Best Effort', 'priority') }
    ];
  }

  getTypePercents(tasks: Task[]): PercentageData[] {
    return [
      { label: 'Feature Enhancements', color: this.colorService.getTypeColor('Feature Enhancements'), percent: this.percent(tasks, 'Feature Enhancements', 'type') },
      { label: 'Other', color: this.colorService.getTypeColor('Other'), percent: this.percent(tasks, 'Other', 'type') },
      { label: 'Bug', color: this.colorService.getTypeColor('Bug'), percent: this.percent(tasks, 'Bug', 'type') }
    ];
  }

  percent(tasks: Task[], val: string, field: 'status'|'priority'|'type'): number {
    if (!tasks.length) return 0;
    return (tasks.filter(t => t[field] === val).length / tasks.length) * 100;
  }
}
