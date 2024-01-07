import { IsNotEmpty, IsOptional } from 'class-validator';

export class TaskPhotoDto {
  @IsNotEmpty()
  taskId: string;

  @IsOptional()
  photoUrl: string;
}
