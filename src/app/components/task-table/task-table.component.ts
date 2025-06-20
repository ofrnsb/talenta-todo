
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { PercentageData, Task } from '../../models/task.models';
import { ColorService } from '../../services/color.service';
import { PercentageService } from '../../services/percentage.service';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit, OnChanges {
  @Input() searchTerm = '';
  @Input() developerFilter = '';
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  displayedColumns: string[] = [
    'description', 
    'developers', 
    'status', 
    'priority', 
    'type', 
    'date', 
    'estimatedSP', 
    'actualSP',
    'actions'
  ];

  statusPercents: PercentageData[] = [];
  priorityPercents: PercentageData[] = [];
  typePercents: PercentageData[] = [];

  constructor(
    private taskService: TaskService,
    private colorService: ColorService,
    private percentageService: PercentageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.updatePercentages();
      this.applyFilters();
    });
  }

  ngOnChanges() {
    this.applyFilters();
  }

  updatePercentages() {
    this.statusPercents = this.percentageService.getStatusPercents(this.tasks);
    this.priorityPercents = this.percentageService.getPriorityPercents(this.tasks);
    this.typePercents = this.percentageService.getTypePercents(this.tasks);
  }

  applyFilters() {
    this.filteredTasks = this.tasks
      .filter(t => t.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .filter(t => this.developerFilter ? t.developers.includes(this.developerFilter) : true);

    if (this.sortColumn) {
      this.filteredTasks.sort((a, b) => {
        const aValue = (a as any)[this.sortColumn];
        const bValue = (b as any)[this.sortColumn];
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
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

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  
  getDeveloperList(): string[] {
    return this.taskService.getDeveloperList();
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
