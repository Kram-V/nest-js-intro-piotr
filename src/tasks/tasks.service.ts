import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  public findAll(): ITask[] {
    return this.tasks;
  }

  public findOne(id: number): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public create(createTaskDto: CreateTaskDto): ITask {
    const task: ITask = {
      id: Date.now(),
      ...createTaskDto,
    };

    this.tasks = [task, ...this.tasks];

    console.log(this.tasks);

    return task;
  }
}
