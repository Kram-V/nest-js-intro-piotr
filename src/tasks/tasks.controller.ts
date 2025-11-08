import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FindOneParams } from './params/find-one.params';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './dtos/create-task-label.dto';
import { FindTaskParams } from './params/find-task.params';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginationResponse } from 'src/common/pagination.response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(
    @Query() filters: FindTaskParams,
    @Query() paginationParams: PaginationParams,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(
      filters,
      paginationParams,
    );

    return {
      data: items,
      meta: {
        total,
        offset: paginationParams.offset,
        limit: paginationParams.limit,
      },
    };
  }

  @Get(':id')
  public async findOne(@Param() params: FindOneParams): Promise<Task | null> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.create(createTaskDto);
  }

  @Post(':id/labels')
  public async createLabels(
    @Param() params: FindOneParams,
    @Body() labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);

    return await this.tasksService.createLabels(task, labelDtos);
  }

  @Patch(':id')
  public async update(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOneOrFail(params.id);

    try {
      return await this.tasksService.update(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);

    await this.tasksService.delete(task);
  }

  @Delete(':id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteLabels(
    @Param() params: FindOneParams,
    @Body() labelNames: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);

    await this.tasksService.deleteLabels(task, labelNames);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }
}
