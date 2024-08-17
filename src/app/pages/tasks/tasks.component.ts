import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/Task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  overdueTasks: Task[] = [];
  ongoingTasks: Task[] = [];
  expandedTasks: number[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getTasksForUser().subscribe((tasks: Task[]) => {
      const currentDate = new Date();

      tasks.forEach(task => {
        const deadline = new Date(task.deadline);

        if (task.isCompleted) {
          return; // Skip completed tasks
        }

        if (deadline < currentDate) {
          this.overdueTasks.push(task);
        } else {
          this.ongoingTasks.push(task);
        }
      });
    });
  }

  toggleAccordion(taskId: number): void {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.classList.toggle('hidden');
    }
  }

  calculateDaysRemaining(deadline: string): string {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const diffTime = Math.abs(deadlineDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return deadlineDate < currentDate ? `${diffDays} Days Overdue` : `${diffDays} Days Remaining`;
  }

  markAsComplete(task: Task): void {
    this.authService.completeTask(task.id).subscribe(
      () => {
        // On success, remove the task from the list or mark it as completed
        task.isCompleted = true;
        console.log(`Task ${task.title} marked as complete.`);
        // Optionally remove the task from the current list and refresh
        this.refreshTasks();
      },
      error => {
        console.error(`Error completing task ${task.title}:`, error);
      }
    );
  }

  private refreshTasks(): void {
    // Refresh the task lists to reflect the completed task
    this.overdueTasks = this.overdueTasks.filter(task => !task.isCompleted);
    this.ongoingTasks = this.ongoingTasks.filter(task => !task.isCompleted);
  }



}


