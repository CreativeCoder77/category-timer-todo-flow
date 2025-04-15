
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: string;
  classIds: string[];
  createdAt: Date;
  order: number;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CustomClass {
  id: string;
  name: string;
  color: string;
}
