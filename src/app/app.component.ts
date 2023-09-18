
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTaskText: string = '';
  filter: string = 'all';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('https://jsonplaceholder.typicode.com/todos');
  }

  addTask(): void {
    if (this.newTaskText.trim() === '') return;
    const newTask: Task = {
      userId: 1,
      id: this.tasks.length + 1,
      title: this.newTaskText,
      completed: false,
    };
    this.tasks.push(newTask);
    this.newTaskText = '';
  }

  onTaskChange(task: Task): void {
    this.http.put(`https://jsonplaceholder.typicode.com/todos/${task.id}`, task).subscribe();
  }

  deleteTask(task: Task): void {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get filteredTasks(): Task[] {
    if (this.filter === 'completed') {
      return this.tasks.filter((task) => task.completed);
    } else if (this.filter === 'incomplete') {
      return this.tasks.filter((task) => !task.completed);
    } else {
      return this.tasks;
    }
  }
}
