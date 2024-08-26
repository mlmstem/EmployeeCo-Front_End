import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CreateTaskRequest } from '../../interfaces/create-task-request';
import { UserDetail } from '../../interfaces/user-detail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.css', '../angular-material.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  dropdownOpen = false;

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
    this.task.roles = this.selectedAssignees.map((user) => user.roles?.join(', '));

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
    this.close.emit();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleAssignee(user: UserDetail) {
    const index = this.selectedAssignees.indexOf(user);
    if (index > -1) {
      this.selectedAssignees.splice(index, 1);
    } else {
      this.selectedAssignees.push(user);
    }
  }

  isAssigneeSelected(user: UserDetail): boolean {
    return this.selectedAssignees.includes(user);
  }

}

