import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './dtos/create-task-label.dto';
import { TaskLabel } from './task-label.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly taskLabelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.tasksRepository.findOne({
      where: {
        id,
      },
      relations: ['labels'],
    });
  }

  public async create(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }

    return await this.tasksRepository.save(createTaskDto);
  }

  public async createLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    const names = new Set(task.labels.map((label) => label.name));

    const instanceOfLabels = this.getUniqueLabels(labelDtos)
      .filter((label) => !names.has(label.name))
      .map((label) => this.taskLabelsRepository.create(label));

    if (instanceOfLabels.length) {
      task.labels = [...task.labels, ...instanceOfLabels];

      return await this.tasksRepository.save(task);
    }

    return task;
  }

  public async update(task: Task, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    if (
      updateTaskDto?.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    Object.assign(task, updateTaskDto);

    return await this.tasksRepository.save(task);
  }

  public async delete(task: Task): Promise<void> {
    // BEFORE
    // await this.tasksRepository.delete(task);

    // AFTER
    await this.tasksRepository.delete(task.id);
  }

  public async deleteLabels(task: Task, labels: string[]): Promise<Task> {
    task.labels = task.labels.filter((label) => !labels.includes(label.name));

    return await this.tasksRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder: TaskStatus[] = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];

    return uniqueNames.map((name) => ({ name }));
  }
}
