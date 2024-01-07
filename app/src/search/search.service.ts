import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";

import { TaskSearchResult } from "../tasks/interfaces/taskSearchResponse.interface";
import { TaskSearchBody } from "../tasks/interfaces/taskSearchBody.interface";
import { Task } from "../tasks/task.entity";

@Injectable()
export default class SearchService {
  private logger = new Logger("SearchService");
  private index = this.configService.get("ELASTICSEARCH_INDEX");
  private mappingsPath = path.join("mappings.json");

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  private getMappingsData(): any {
    const mappingsJson = fs.readFileSync(this.mappingsPath, "utf8");

    return JSON.parse(mappingsJson);
  }

  public async createIndex() {
    this.logger.log(`Checking if index '${this.index}' exists.`);

    const checkIndex = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (checkIndex.statusCode === 404) {
      this.logger.log(`Index '${this.index}' not found. Creating the index.`);

      const mappingsData = this.getMappingsData();

      try {
        await this.elasticsearchService.indices.create({
          index: this.index,
          body: mappingsData,
        });

        this.logger.log(`Index '${this.index}' created successfully.`);
      } catch (error) {
        this.logger.error(
          `Error creating index '${this.index}': ${error.message}`
        );
      }
    } else {
      this.logger.log(`Index '${this.index}' already exists.`);
    }
  }

  public async indexItem(task: Task) {
    this.logger.log(
      `Indexing task with ID '${task.id}' to index '${this.index}'.`
    );

    return this.elasticsearchService.index<TaskSearchResult, TaskSearchBody>({
      index: this.index,
      body: {
        id: task.id,
        title: task.title,
        description: task.description,
      },
    });
  }

  public async removeItem(itemId: string) {
    this.logger.log(
      `Removing task with ID '${itemId}' from index '${this.index}'.`
    );

    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: itemId,
          },
        },
      },
    });
  }

  public async search(query: string) {
    this.logger.log(
      `Performing search for query '${query}' in index '${this.index}'.`
    );

    const { body } = await this.elasticsearchService.search<TaskSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["title", "description"],
          },
        },
      },
    });

    const hits = body.hits.hits;

    this.logger.log(`Search returned ${hits.length} hits.`);

    return hits.map((item) => item._source);
  }
}
