import { Courses } from 'src/entities/courses.entity';
import { Enrollments } from 'src/entities/enrollments.entity';
import { Users } from 'src/entities/users.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const TypeOrmConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'admin',
  password: 'admin',
  database: 'ntucool',
  entities: [Users, Enrollments, Courses],
  synchronize: true,
};
