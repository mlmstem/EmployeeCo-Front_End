import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/Task';
import { CommonModule } from '@angular/common';
import { FeedbackFormComponent } from '../../components/feedback-form/feedback-form.component';
import { CreateTaskModalComponent } from '../../components/create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-tasksreview',
  standalone: true,
  imports: [CommonModule, FeedbackFormComponent, CreateTaskModalComponent],
  templateUrl: './tasksreview.component.html',
  styleUrls: ['./tasksreview.component.css']
})
export class TasksreviewComponent implements OnInit {
  showCreateTaskModal = false;
  completedTasks: Task[] = [];
  selectedTaskId: number | null = null;
  showModal = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCompletedTasks();
  }

  loadCompletedTasks(): void {
    this.authService.getAllCompletedTasks().subscribe((tasks: Task[]) => {
      // Filter out tasks that have already been rated
      this.completedTasks = tasks.filter(task => task.rating === null || task.rating === undefined);
    });
  }

  writeFeedback(task: Task) {
    this.selectedTaskId = task.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTaskId = null;
    // Refresh the tasks to only show unrated ones
    this.loadCompletedTasks();
  }

  openCreateTaskModal() {
    this.showCreateTaskModal = true;
  }

  closeCreateTaskModal() {
    this.showCreateTaskModal = false;
  }

  onTaskCreated() {
    this.closeCreateTaskModal();
    // Optionally refresh tasks or show a success message
  }





}

