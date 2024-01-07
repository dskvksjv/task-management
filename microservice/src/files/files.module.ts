import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {FilesService} from './files.service';
import {BullModule} from "@nestjs/bull";
import {FilesController} from "./files.controller";
import PublicFile from "./publicFile.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import {SocketClient} from "../socket/socket-client";

@Module({
    imports: [ConfigModule,
        BullModule.registerQueue({name: 'files'}),
        TypeOrmModule.forFeature([PublicFile]),
    ],

    providers: [FilesService, SocketClient],
    controllers: [FilesController],
    exports: [FilesService],
})
export class FilesModule {
}
