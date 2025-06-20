// src/app/components/task-kanban/task-kanban.component.ts
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task.models';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-kanban',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, MatButtonModule,MatIconModule],
  templateUrl: './task-kanban.component.html',
  styleUrls: ['./task-kanban.component.scss']
})
export class TaskKanbanComponent implements OnInit {
  statuses: Task['status'][] = ['Ready to start', 'In Progress', 'Waiting for review', 'Pending Deploy', 'Done', 'Stuck'];
  tasks: Task[] = [];
  tasksByStatus: { [key: string]: Task[] } = {};

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.groupTasksByStatus();
    });
  }

  groupTasksByStatus() {
    this.tasksByStatus = {};
    this.statuses.forEach(status => {
      this.tasksByStatus[status] = this.tasks.filter(t => t.status === status);
    });
  }

  openEdit(task: Task | null) {
    const dialogRef = this.dialog.open(TaskFormComponent, { data: task });
    dialogRef.afterClosed().subscribe(() => {
      this.groupTasksByStatus();
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
}
