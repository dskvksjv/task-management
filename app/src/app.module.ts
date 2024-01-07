import {Module} from '@nestjs/common';
import {TasksModule} from './tasks/tasks.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from '@hapi/joi';
import {DatabaseModule} from './database/database.module';
import {BullModule} from '@nestjs/bull'
import {GatewayModule} from "./gateway/gateway.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().required(),
                DATABASE_USERNAME: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.number().required()
            }),
        }),
        DatabaseModule,
        TasksModule,
        GatewayModule,
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),

    ],
})
export class AppModule {
}
