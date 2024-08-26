import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Task } from '../../interfaces/Task';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar'; // Import without forRoot()

@Component({
  selector: 'app-calendar-app',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule, // Import the CalendarModule directly without forRoot
  ],
  templateUrl: './calendar-app.component.html',
  styleUrls: ['./calendar-app.component.css'],
})
export class CalendarAppComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getTasksForUser().subscribe((tasks: Task[]) => {
      this.events = this.formatTasksAsEvents(tasks);
    });
  }

  formatTasksAsEvents(tasks: Task[]): CalendarEvent[] {
    const eventMap = new Map<string, CalendarEvent[]>();

    tasks.forEach(task => {
      const dateKey = task.deadline.toString().split('T')[0]; // Format date as 'YYYY-MM-DD'

      if (!eventMap.has(dateKey)) {
        eventMap.set(dateKey, []);
      }

      const eventsForDay = eventMap.get(dateKey);
      if (eventsForDay.length < 2) {
        eventsForDay.push({
          start: new Date(task.deadline),
          title: task.title,
          color: {
            primary: task.highPriority ? '#ffa500' : '#28a745', // Orange for high priority, green for normal
            secondary: task.highPriority ? '#FFEBCC' : '#DFF0D8'
          },
          cssClass: task.highPriority ? 'priority-high' : 'priority-normal',
          allDay: true,
        });
      } else {
        if (eventsForDay.length === 2) {
          eventsForDay.push({
            start: new Date(task.deadline),
            title: `View more >`,
            cssClass: 'calendar-event-more-link',
            allDay: true,
          });
        }
      }
    });

    // Flatten the eventMap into an array of CalendarEvent
    return Array.from(eventMap.values()).flat();
  }
}




