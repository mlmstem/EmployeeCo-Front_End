import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/Task';

interface CalendarDay {
  date: number;
  prevMonth: boolean;
  nextMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
  events: Task[]; // To store the tasks for each day
  dotVisible: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CalendarComponent implements OnInit {
  today = new Date();
  activeDay: number;
  month: number = this.today.getMonth();
  year: number = this.today.getFullYear();
  dayName: string = '';
  gotoDateInput: string = '';
  eventTitle: string = '';
  months: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  calendarDays: CalendarDay[] = [];
  events: { [key: string]: Task[] } = {};
  previousSelectedDay: CalendarDay | null = null;  // Track the previous selected day

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initCalendar();
    this.authService.getTasksForUser().subscribe((tasks: Task[]) => {
      this.mapTasksToEvents(tasks);
      this.updateCalendarWithEvents();
    });
  }

  initCalendar(): void {
    const firstDay = new Date(this.year, this.month, 1);
    const lastDay = new Date(this.year, this.month + 1, 0);
    const prevLastDay = new Date(this.year, this.month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    this.calendarDays = [];

    // Previous month's days
    for (let x = day; x > 0; x--) {
      this.calendarDays.push({
        date: prevDays - x + 1,
        prevMonth: true,
        nextMonth: false,
        isToday: false,
        hasEvent: false,
        events: [],
        dotVisible: true,
      });
    }

    // Current month's days
    for (let i = 1; i <= lastDate; i++) {
      const eventKey = `${this.year}-${this.month + 1}-${i}`;
      this.calendarDays.push({
        date: i,
        prevMonth: false,
        nextMonth: false,
        isToday: i === this.today.getDate() && this.year === this.today.getFullYear() && this.month === this.today.getMonth(),
        hasEvent: this.events[eventKey]?.length > 0,
        events: this.events[eventKey] || [],
        dotVisible: true,
      });
    }

    // Next month's days
    for (let j = 1; j <= nextDays; j++) {
      this.calendarDays.push({
        date: j,
        prevMonth: false,
        nextMonth: true,
        isToday: false,
        hasEvent: false,
        events: [],
        dotVisible: true,
      });
    }

    if (this.activeDay) {
      this.dayName = new Date(this.year, this.month, this.activeDay).toLocaleDateString('en-US', { weekday: 'long' });
    }
  }

  mapTasksToEvents(tasks: Task[]): void {
    tasks.forEach(task => {
      const taskDate = new Date(task.deadline); // Assuming task.deadline is in ISO format or similar
      const eventKey = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}-${taskDate.getDate()}`;
      if (!this.events[eventKey]) {
        this.events[eventKey] = [];
      }
      this.events[eventKey].push(task);
    });
  }

  updateCalendarWithEvents(): void {
    this.calendarDays.forEach(day => {
      const eventKey = `${this.year}-${this.month + 1}-${day.date}`;
      day.hasEvent = this.events[eventKey]?.length > 0;
      day.events = this.events[eventKey] || [];
    });
  }

  selectDay(day: CalendarDay): void {
    if (this.previousSelectedDay) {
      // Reverse the dot visibility of the previously selected day
      this.previousSelectedDay.dotVisible = !this.previousSelectedDay.dotVisible;
    }

    if (day.prevMonth) {
      this.prevMonth();
    } else if (day.nextMonth) {
      this.nextMonth();
    } else {
      this.activeDay = day.date;
      this.dayName = new Date(this.year, this.month, this.activeDay).toLocaleDateString('en-US', { weekday: 'long' });
      this.updateEvents();
      day.dotVisible = !day.dotVisible;
      this.previousSelectedDay = day;  // Update the previously selected day
    }
  }

  prevMonth(): void {
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    this.initCalendar();
    this.updateCalendarWithEvents();
    this.previousSelectedDay = null;  // Reset previous selected day on month change
  }

  nextMonth(): void {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    this.initCalendar();
    this.updateCalendarWithEvents();
    this.previousSelectedDay = null;  // Reset previous selected day on month change
  }

  goToToday(): void {
    this.today = new Date();
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    this.activeDay = this.today.getDate();
    this.initCalendar();
    this.updateCalendarWithEvents();
    this.updateEvents();
    this.previousSelectedDay = null;  // Reset previous selected day on going to today
  }

  gotoDate(): void {
    const dateArr = this.gotoDateInput.split("/");
    if (dateArr.length === 2) {
      const month = parseInt(dateArr[0], 10);
      const year = parseInt(dateArr[1], 10);
      if (month > 0 && month < 13 && dateArr[1].length === 4) {
        this.month = month - 1;
        this.year = year;
        this.initCalendar();
        this.updateCalendarWithEvents();
        return;
      }
    }
    alert("Invalid Date");
  }

  toggleAddEventWrapper(): void {
    const addEventWrapper = document.querySelector('.add-event-wrapper') as HTMLElement;
    addEventWrapper.classList.toggle('active');
  }

  addEvent(): void {
    const eventKey = `${this.year}-${this.month + 1}-${this.activeDay}`;
    if (!this.events[eventKey]) {
      this.events[eventKey] = [];
    }
    this.events[eventKey].push({
      id: Date.now(),
      title: this.eventTitle,
      description: '',
      isCompleted: false,
      expectedHours: 0,
      deadline: new Date(this.year, this.month, this.activeDay).toISOString(),
      highPriority: false,
      roles: []
    });
    this.eventTitle = '';
    this.toggleAddEventWrapper();
    this.updateEvents();
  }

  updateEvents(): void {
    const eventKey = `${this.year}-${this.month + 1}-${this.activeDay}`;
    const eventContainer = document.querySelector('.events') as HTMLElement;
    if (this.events[eventKey] && this.events[eventKey].length > 0) {
      eventContainer.innerHTML = `
        <div class="text-lg font-bold mx-4">Tasks for Today:</div>
        ${this.events[eventKey]
          .map(event => `
            <div class="event-card p-4 border rounded-lg mb-2 bg-slate-600 mx-4" >
              <div class="font-bold">${event.title}</div>
              <div class="text-sm text-gray-300">Expected Hours: ${event.expectedHours || 'N/A'}</div>
              <div class="text-sm text-gray-300">Roles: ${event.roles.join(', ') || 'N/A'}</div>
            </div>
          `)
          .join('')}
      `;
    } else {
      eventContainer.innerHTML = `<div class="no-event">No Events</div>`;
    }
  }

  selectedDayHasEvents(): boolean {
    const eventKey = `${this.year}-${this.month + 1}-${this.activeDay}`;
    return this.events[eventKey] && this.events[eventKey].length > 0;
  }

  getEventsForActiveDay(): Task[] {
    const eventKey = `${this.year}-${this.month + 1}-${this.activeDay}`;
    return this.events[eventKey] || [];
  }

}










