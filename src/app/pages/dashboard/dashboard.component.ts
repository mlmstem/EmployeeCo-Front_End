import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/Task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasksThisMonth: Task[] = []; // Store the relevant tasks for this month
  currentMonthDates: Date[] = [];
  dayHeaders: string[] = [];
  previousMonth: string;
  currentMonth: string;
  nextMonth: string;
  selectedMonth: string;

  // Variables for task completions
  overdueTasks: number = 0;
  completedTasks: number = 0;
  totalTasksThisMonth: number = 0;
  overduePercentage: number = 0;
  completedPercentage: number = 0;

  constructor(private authService: AuthService) {
    const currentDate = new Date();
    this.previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toLocaleString('default', { month: 'long' });
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    this.nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toLocaleString('default', { month: 'long' });
    this.selectedMonth = this.currentMonth; // Set current month as the default
  }

  ngOnInit() {
    this.authService.getTasksForUser().subscribe(Tasks => {
      const currentMonth = new Date().getMonth();
      this.tasksThisMonth = Tasks.filter(Task => new Date(Task.deadline).getMonth() === currentMonth);

      this.totalTasksThisMonth = this.tasksThisMonth.length;

      // Calculate overdue and completed tasks
      const today = new Date();
      this.tasksThisMonth.forEach(task => {
        const taskDeadline = new Date(task.deadline);
        if (!task.isCompleted && taskDeadline < today) {
          this.overdueTasks++;
        } else if (task.isCompleted) {
          this.completedTasks++;
        }
      });

      // Calculate percentages
      if (this.totalTasksThisMonth > 0) {
        this.overduePercentage = (this.overdueTasks / this.totalTasksThisMonth) * 100;
        this.completedPercentage = (this.completedTasks / this.totalTasksThisMonth) * 100;
      }

      this.generateCalendarDates();
    });
  }

  generateCalendarDates() {
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    this.currentMonthDates = []; // Clear the previous dates
    for (let day = 1; day <= daysInMonth; day++) {
      this.currentMonthDates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    this.generateDayHeaders();
  }

  generateDayHeaders() {
    const firstDayOfMonth = this.currentMonthDates[0].getDay();
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    this.dayHeaders = [];
    for (let i = 0; i < 7; i++) {
      this.dayHeaders.push(daysOfWeek[(firstDayOfMonth + i) % 7]);
    }
  }

  getBackgroundColor(date: Date): string {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    const taskDeadline = this.tasksThisMonth.find(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getDate() === date.getDate() && taskDate.getMonth() === date.getMonth();
    });

    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'bg-cyan-300'; // Cyan background for today's date
    }

    if (taskDeadline) {
      return 'bg-yellow-300'; // Change this to the appropriate color for task deadlines
    }

    if (isWeekend) {
      return 'bg-green-300';
    }

    return 'bg-white';
  }
}



