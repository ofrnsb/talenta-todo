// src/app/components/task-form/task-form.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Task } from '../../models/task.models';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  task: Task;
  isEditMode: boolean;
  
  statuses: Task['status'][] = ['Ready to start', 'In Progress', 'Waiting for review', 'Pending Deploy', 'Done', 'Stuck'];
  priorities: Task['priority'][] = ['Critical', 'High', 'Medium', 'Low', 'Best Effort'];
  types: Task['type'][] = ['Feature Enhancements', 'Other', 'Bug'];
  availableDevelopers: string[] = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task | null,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private taskService: TaskService
  ) {
    this.isEditMode = !!data;
    this.task = data
      ? { ...data }
      : {
          id: this.generateId(),
          description: '',
          developers: [],
          status: 'Ready to start',
          priority: 'Medium',
          type: 'Feature Enhancements',
          date: new Date().toISOString(),
          estimatedSP: 0,
          actualSP: 0,
        };
  }

  save() {
    if (!this.task.description.trim()) {
      return;
    }
    
    if (this.isEditMode) {
      this.taskService.updateTask(this.task);
    } else {
      this.taskService.addTask(this.task);
    }
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
