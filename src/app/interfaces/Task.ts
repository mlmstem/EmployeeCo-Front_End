export interface Task{
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  expectedHours: number;
  deadline: string; // or Date, depending on how you handle dates
  completionDate?: string; // or Date
  roles: string[];
  relevantEmployees?: string[];
  relevantEmployeeEmails?: string[];
  rating?: number;
  feedback?: string;
  highPriority: boolean;
}
