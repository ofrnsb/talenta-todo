export type TaskStatus =
  | 'Ready to start'
  | 'In Progress'
  | 'Waiting for review'
  | 'Pending Deploy'
  | 'Done'
  | 'Stuck';

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low' | 'Best Effort';
export type TaskType = 'Feature Enhancements' | 'Other' | 'Bug';

export interface Task {
  id: string;
  description: string;
  developers: string[];
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  date: string;
  estimatedSP: number;
  actualSP: number;
}
