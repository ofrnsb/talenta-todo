import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PercentageData, Task } from '../../models/task.models';
import { ColorService } from '../../services/color.service';
import { PercentageService } from '../../services/percentage.service';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-kanban',
  standalone: true,
  imports: [
    CommonModule, 
    CdkDropList, 
    CdkDrag, 
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './task-kanban.component.html',
  styleUrls: ['./task-kanban.component.scss']
})
export class TaskKanbanComponent implements OnInit, OnChanges {
  @Input() searchTerm = '';
  @Input() developerFilter = '';
  
  statuses: Task['status'][] = ['Ready to start', 'In Progress', 'Waiting for review', 'Pending Deploy', 'Done', 'Stuck'];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  tasksByStatus: { [key: string]: Task[] } = {};
  
  statusPercents: PercentageData[] = [];

  constructor(
    private taskService: TaskService,
    private colorService: ColorService,
    private percentageService: PercentageService,
    private dialog: MatDialog
  ) {
    this.initializeTasksByStatus();
  }

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.statusPercents = this.percentageService.getStatusPercents(tasks);
      this.applyFilters();
    });
  }

  ngOnChanges() {
    this.applyFilters();
  }

  private initializeTasksByStatus() {
    this.statuses.forEach(status => {
      this.tasksByStatus[status] = [];
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks
      .filter(t => t.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .filter(t => this.developerFilter ? t.developers.includes(this.developerFilter) : true);
    
    this.groupTasksByStatus();
  }

  groupTasksByStatus() {
    this.statuses.forEach(status => {
      this.tasksByStatus[status] = [];
    });
    
    this.filteredTasks.forEach(task => {
      if (this.tasksByStatus[task.status]) {
        this.tasksByStatus[task.status].push(task);
      }
    });
  }

  getTaskCountByStatus(status: string): number {
    return this.tasksByStatus[status]?.length ?? 0;
  }

  openEdit(task: Task | null) {
    const dialogRef = this.dialog.open(TaskFormComponent, { 
      data: task,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.applyFilters();
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: Task['status']) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      task.status = status;
      this.taskService.updateTask(task);
    }
  }

  getStatusColor(status: string): string {
    return this.colorService.getStatusColor(status);
  }

  getPriorityColor(priority: string): string {
    return this.colorService.getPriorityColor(priority);
  }

  getTypeColor(type: string): string {
    return this.colorService.getTypeColor(type);
  }

  getDeveloperInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
