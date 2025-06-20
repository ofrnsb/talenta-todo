import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ColorService {
  
  getStatusColor(status: string): string {
    switch(status) {
      case 'Ready to start': return '#3a7afe';
      case 'In Progress': return '#f7b500';
      case 'Waiting for review': return '#4fd1c5';
      case 'Pending Deploy': return '#a259ff';
      case 'Done': return '#3ecf8e';
      case 'Stuck': return '#f95f53';
      default: return '#444';
    }
  }

  getPriorityColor(priority: string): string {
    switch(priority) {
      case 'Critical': return '#f95f53';
      case 'High': return '#f7b500';
      case 'Medium': return '#4fd1c5';
      case 'Low': return '#8a94b9';
      case 'Best Effort': return '#3a7afe';
      default: return '#444';
    }
  }

  getTypeColor(type: string): string {
    switch(type) {
      case 'Feature Enhancements': return '#a259ff';
      case 'Other': return '#4fd1c5';
      case 'Bug': return '#f7b500';
      default: return '#444';
    }
  }
}
