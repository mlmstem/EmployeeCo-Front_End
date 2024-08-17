// src/app/interfaces/create-task-request.ts
export interface CreateTaskRequest {
  title: string;
  description?: string;
  expectedHours: number;
  deadline: Date;
  roles?: string[];
  relevantEmployees: string[];
  relevantEmployeeEmails: string[];
  highPriority: boolean;
}


