import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskKanbanComponent } from './components/task-kanban/task-kanban.component';
import { TaskTableComponent } from './components/task-table/task-table.component';
import { PercentageData, Task } from './models/task.models';
import { PercentageService } from './services/percentage.service';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TaskTableComponent,
    TaskKanbanComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'talenta-todo';
  activeTab = 'table';
  search = '';
  developerFilter = '';
  tasks: Task[] = [];
  statusPercents: PercentageData[] = [];
  
  constructor(
    private taskService: TaskService,
    private percentageService: PercentageService,
    private dialog: MatDialog
  ) {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.statusPercents = this.percentageService.getStatusPercents(tasks);
    });
  }

  openNewTask() {
    const dialogRef = this.dialog.open(TaskFormComponent, { 
      data: null,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.taskService.getTasks().subscribe(tasks => {
        this.tasks = tasks;
        this.statusPercents = this.percentageService.getStatusPercents(tasks);
      });
    });
  }

  getDeveloperList(): string[] {
    return this.taskService.getDeveloperList();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
