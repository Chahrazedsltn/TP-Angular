import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  newTitle = '';
  @Output() add = new EventEmitter<string>();

  onSubmit() {
    if (this.newTitle.trim()) {
      this.add.emit(this.newTitle);
      this.newTitle = '';
    }
  }
}
