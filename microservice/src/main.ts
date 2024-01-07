import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { config } from "aws-sdk";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3001;
  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
    region: configService.get("AWS_REGION"),
  });
  await app.listen(port, () =>
    console.log(`Files microservice started on port: ${port}`)
  );
}
bootstrap();
