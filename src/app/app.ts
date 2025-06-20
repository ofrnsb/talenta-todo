// src/app/app.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { TaskKanbanComponent } from './components/task-kanban/task-kanban.component';
import { TaskTableComponent } from './components/task-table/task-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TaskTableComponent, TaskKanbanComponent, MatTabsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'talenta-todo';
}
