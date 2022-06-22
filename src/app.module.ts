import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { BearerTokenCheckMiddleware } from './BearerAuth.middleware';

@Module({
  imports: [UserModule, CourseModule, EnrollmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}
//  implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//       consumer  
//         .apply(BearerTokenCheckMiddleware)
//         .forRoutes(
//           // add middleware to route path that require Bearer Auth token validation
//           // {path: 'user/create', method: RequestMethod.POST},
//           // {path: 'user/edit/*', method: RequestMethod.PUT},
//           // {path: 'user/delete/*', method: RequestMethod.DELETE},
//           {path: 'enrollment/add', method: RequestMethod.POST},
//           {path: 'enrollment/delete/*', method: RequestMethod.DELETE})
//   }
// }
