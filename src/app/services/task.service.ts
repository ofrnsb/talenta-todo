// src/app/services/task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks$ = new BehaviorSubject<Task[]>([]);
  private apiUrl = 'https://mocki.io/v1/f6d74629-a002-4de3-b82c-9a8bc2bc25e9';

  constructor(private http: HttpClient) {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe(tasks => {
      this.tasks$.next(tasks);
    });
  }

  getTasks() {
    return this.tasks$.asObservable();
  }

  addTask(task: Task) {
    const current = this.tasks$.value;
    this.tasks$.next([task, ...current]);
  }

  updateTask(updated: Task) {
    this.tasks$.next(
      this.tasks$.value.map(t => (t.id === updated.id ? updated : t))
    );
  }

  deleteTask(id: string) {
    this.tasks$.next(this.tasks$.value.filter(t => t.id !== id));
  }
}
