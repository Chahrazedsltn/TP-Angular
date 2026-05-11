import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  private filterSubject = new BehaviorSubject<Filter>('all');
  filter$ = this.filterSubject.asObservable();

  filteredTasks$: Observable<Task[]> = combineLatest([
    this.taskService.getTasks(),
    this.filter$
  ]).pipe(
    map(([tasks, filter]) => {
      if (filter === 'active') return tasks.filter(t => !t.done);
      if (filter === 'done')   return tasks.filter(t => t.done);
      return tasks;
    })
  );

  setFilter(f: Filter) { this.filterSubject.next(f); }

  onAdd(title: string)  { this.taskService.addTask(title); }
  onToggle(id: number)  { this.taskService.toggleTask(id); }
  onDelete(id: number)  { this.taskService.deleteTask(id); }
}
