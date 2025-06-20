// src/app/components/task-form/task-form.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatNativeDateModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  task: Task;
  statuses: Task['status'][] = ['Ready to start', 'In Progress', 'Waiting for review', 'Pending Deploy', 'Done', 'Stuck'];
  priorities: Task['priority'][] = ['Critical', 'High', 'Medium', 'Low', 'Best Effort'];
  types: Task['type'][] = ['Feature Enhancements', 'Other', 'Bug'];

  private taskService = inject(TaskService);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task | null) {
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
    if (this.data) {
      this.taskService.updateTask(this.task);
    } else {
      this.taskService.addTask(this.task);
    }
    this.dialogRef.close();
  }

  private generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
