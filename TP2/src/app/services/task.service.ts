import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'todo-pp-tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = this.loadFromStorage();

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getRemainingCount(): Observable<number> {
    return this.tasksSubject.pipe(map(tasks => tasks.filter(t => !t.done).length));
  }

  addTask(title: string): void {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      done: false,
      createdAt: new Date()
    };
    this.tasks = [...this.tasks, newTask];
    this.save();
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    this.save();
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  clearDone(): void {
    this.tasks = this.tasks.filter(t => !t.done);
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    this.tasksSubject.next(this.tasks);
  }

  private loadFromStorage(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [
      { id: 1, title: 'Apprendre Angular', done: false, createdAt: new Date() },
      { id: 2, title: 'Construire la TodoList', done: false, createdAt: new Date() }
    ];
    return JSON.parse(raw).map((t: Task) => ({ ...t, createdAt: new Date(t.createdAt) }));
  }
}
