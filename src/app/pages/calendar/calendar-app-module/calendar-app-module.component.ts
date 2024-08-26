import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarAppComponent } from '../../../components/calendar-app/calendar-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CalendarAppComponent
  ],
  exports: [CalendarAppComponent], // Export the CalendarAppComponent
})
export class CalendarAppModule {}
