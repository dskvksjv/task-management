import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { TasksRepository } from "./tasks.repository";

@Processor("files")
export class FilesProcessor {
  private readonly logger = new Logger(FilesProcessor.name);
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private readonly configService: ConfigService
  ) {}

  @Process("fileAdd")
  async handleAddFiles(Job: Job) {
    try {
      const { taskId, photoUrl } = Job.data;
      const task = await this.tasksRepository.findOne(taskId);
      task.photoUrl = photoUrl;
      await this.tasksRepository.save(task);
      this.logger.log(`File added with fileUrl ${photoUrl}`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  @Process("fileDelete")
  async handleFileDelete(Job: Job) {
    try {
      const fileUrl = Job.data.fileUrl;
      const task = await this.tasksRepository.findOne({
        where: { photoUrl: fileUrl },
      });
      task.photoUrl = null;
      await this.tasksRepository.save(task);
      this.logger.log(`File deleted from task with fileUrl ${fileUrl}`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
