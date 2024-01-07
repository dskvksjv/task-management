import {TaskSearchBody} from './taskSearchBody.interface'

export interface TaskSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: TaskSearchBody;
    }>;
  };
}