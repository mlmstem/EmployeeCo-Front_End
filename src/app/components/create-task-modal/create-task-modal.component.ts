import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CreateTaskRequest } from '../../interfaces/create-task-request';
import { UserDetail } from '../../interfaces/user-detail';
// import { CommonModule } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CreateTaskModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  task: CreateTaskRequest = {
    title: '',
    description: '',
    expectedHours: 0,
    deadline: new Date(),
    roles: [],
    relevantEmployees: [],
    relevantEmployeeEmails: [],
    highPriority: false,
  };

  selectedAssignees: UserDetail[] = [];
  users: UserDetail[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAll().subscribe((users) => {
      this.users = users;
    });
  }

  setPriority(priority: 'High' | 'Normal') {
    this.task.highPriority = priority === 'High';
  }

  createTask() {
    this.task.relevantEmployees = this.selectedAssignees.map((user) => user.fullName);
    this.task.relevantEmployeeEmails = this.selectedAssignees.map((user) => user.email);
    this.task.roles = this.selectedAssignees.map((user) => user.roles?.join(', ')); // Assuming roles is an array


    this.authService.createTask(this.task).subscribe({
      next: () => {
        this.taskCreated.emit();
        this.close.emit();
      },
      error: (error) => {
        console.error('Error creating task:', error);
      },
    });
  }

  closeModal() {
    this.close.emit();  // Correctly emit the close event
  }
}

