import { IsString, MinLength } from "class-validator";

export class SearchTasksQueryDto {
  @IsString()
  @MinLength(2)
  public query: string;
}
