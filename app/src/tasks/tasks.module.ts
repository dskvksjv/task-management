import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from 'src/auth/auth.module';
import {TasksController} from './tasks.controller';
import {TasksRepository} from './tasks.repository';
import {TasksService} from './tasks.service';
import {ConfigModule} from '@nestjs/config';
import {BullModule} from "@nestjs/bull";
import {FilesProcessor} from "./tasks.proccessor";
import { SearchModule } from 'src/search/search.module';

@Module({
    imports: [SearchModule, ConfigModule, TypeOrmModule.forFeature([TasksRepository]), AuthModule,
        BullModule.registerQueue({name: 'files'})
    ],
    controllers: [TasksController],
    providers: [TasksService, FilesProcessor],
})
export class TasksModule {
}