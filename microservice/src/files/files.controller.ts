import {InjectQueue} from "@nestjs/bull";
import {
    Body,
    Controller,
    Delete,
    Logger,
    Param,
    Post,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {Queue} from 'bull'
import {FilesService} from "./files.service";
import {v4 as uuidv4} from 'uuid';
import {SocketClient} from "../socket/socket-client";

@Controller('files')
export class FilesController {
    private logger = new Logger(FilesController.name);
    constructor(private readonly filesService: FilesService,
                @InjectQueue('files') private readonly filesQueue: Queue) {
    }

    @Post('/:taskId/photo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadTaskPhoto(
        @Param('taskId') taskId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        await this.filesService.uploadPublicFile(taskId, file.buffer, `${uuidv4()}-${file.originalname}`)
        return {message: `Success, file ${file.originalname} uploaded`};
    }
    @Delete('/photo')
    async deleteTaskPhoto(
        @Body('file_url') fileUrl: string,
    ) {
        await this.filesService.deletePublicFile(fileUrl);
        return {message: `Success, file with url ${fileUrl} deleted`};
    }
}
