// src/app/components/task-table/task-table.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../../models/task.models';
import { DeveloperListPipe } from '../../pipes/developer-list.pipe';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    DeveloperListPipe
  ],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  search = '';
  developerFilter = '';
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

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks
      .filter(t => t.description.toLowerCase().includes(this.search.toLowerCase()))
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
    const dialogRef = this.dialog.open(TaskFormComponent, { data: task });
    dialogRef.afterClosed().subscribe(() => this.applyFilters());
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
    this.applyFilters();
  }
}
