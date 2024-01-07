import { In } from "typeorm";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TaskStatus } from "./task-status.enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TasksRepository } from "./tasks.repository";
import { Task } from "./task.entity";
import { User } from "src/users/user.entity";
import SearchService from "src/search/search.service";
import { SearchTasksQueryDto } from "./dto/search-tasks-query.dto";

@Injectable()
export class TasksService {
  private logger = new Logger("TasksService");

  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private searchService: SearchService
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const newTask = await this.tasksRepository.createAndSaveTask(
      createTaskDto,
      user
    );

    await this.searchService.indexItem(newTask);

    return newTask;
  }

  async searchTasks(queryParams: SearchTasksQueryDto, user: User) {
    const query = queryParams.query;
    const results = await this.searchService.search(query);
    const ids = results.map((result) => result.id);

    if (!ids.length) {
      this.logger.log(
        `No tasks found for user "${user.username}" with query: ${queryParams.query}`
      );

      return [];
    }

    return this.tasksRepository.find({
      where: { id: In(ids), user },
    });
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    await this.searchService.removeItem(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}
