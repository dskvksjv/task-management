import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as Joi from '@hapi/joi';
import {FilesModule} from "./files/files.module";
import {BullModule} from "@nestjs/bull";
import {DatabaseModule} from "./database/database.module";
import {SocketModule} from "./socket/socket.module";

@Module({
    imports: [ConfigModule.forRoot({
        validationSchema: Joi.object({
            DATABASE_HOST: Joi.string().required(),
            DATABASE_PORT: Joi.number().required(),
            DATABASE_USERNAME: Joi.string().required(),
            DATABASE_PASSWORD: Joi.string().required(),
            DATABASE_NAME: Joi.string().required(),
            AWS_REGION: Joi.string().required(),
            AWS_ACCESS_KEY_ID: Joi.string().required(),
            AWS_SECRET_ACCESS_KEY: Joi.string().required(),
            AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
            REDIS_HOST: Joi.string().required(),
            REDIS_PORT: Joi.number().required()
        }),
    }),
        FilesModule,
        DatabaseModule,
        SocketModule,
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
