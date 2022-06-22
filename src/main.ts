import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NTUCool Interview - Users/Courses API')
    .setDescription('by 周俊廷 B07902091 b07902091@csie.ntu.edu.tw')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app,config)
  const option: SwaggerCustomOptions = {explorer: true,};
  SwaggerModule.setup('api',app,document,option);

  app.useGlobalPipes(new ValidationPipe({   // add usage of validator
    whitelist: true,  //ensure only defined data is sent 
    transform: true,
    skipNullProperties: true,
    skipMissingProperties: true,
    skipUndefinedProperties: true
  }),);
  await app.listen(3000);
}
bootstrap();

