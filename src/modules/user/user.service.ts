import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/database';
import { Users } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements OnModuleInit {
  async onModuleInit() {
    await this.usersRepository.clear();
    await this.usersRepository.save(UserData);
  }
  @InjectRepository(Users)
  private usersRepository: Repository<Users>;

  async createUser(username: string, email: string): Promise<Users> {
    // if the field is not provided in http req, we might received undefined input value
    if (username == null || email == null)
      throw new BadRequestException('Invalid name or email!');

    const exist = await this.usersRepository.findOne({
      where: [{ name: username }, { email: email }],
    });

    if (exist === null) {
      const newUser = this.usersRepository.create({
        name: username,
        email: email,
      });
      return await this.usersRepository.save(newUser);
    } else throw new BadRequestException('Name or Email already been used!');
  }

  async getUserById(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id: Number(userId) });
    if (user) return user;
    else throw new BadRequestException('Invalid userId!');
  }

  async queryUser(filter: string, str: string): Promise<Users> {
    // if the field is not provided in http req, we might received undefined input value
    if (filter == null || str == null)
      throw new BadRequestException('Invalid name or email!');

    if (filter !== 'name' && filter !== 'email')
      throw new BadRequestException('Invalid filter!');

    if (filter === 'name') {
      const user = await this.usersRepository.findOneBy({ name: str });
      if (user) {
        return user;
      } else throw new BadRequestException('Invalid name!');
    }

    if (filter === 'email') {
      const user = await this.usersRepository.findOneBy({ email: str });
      if (user) {
        return user;
      } else throw new BadRequestException('Invalid email!');
    }
  }

  async editUserById(
    userId: number,
    username: string,
    email: string,
  ): Promise<Users> {
    /** if the field is not provided in http req, we might received undefined input value
     *  either username or email can be not provided => no changes
     *  provide at least one of them to be valid for edition
     */
    if (username == null && email == null)
      throw new BadRequestException('Invalid name and email!');

    const user = await this.usersRepository.findOneBy({ id: Number(userId) });
    if (user) {
      if (username && username !== '') {
        const existName = await this.usersRepository.findOneBy({
          name: username,
        });

        if (existName !== null)
          throw new BadRequestException('Name already been used!');

        user.name = username;
      }

      if (email && email !== '') {
        const existEmail = await this.usersRepository.findOneBy({
          email: email,
        });

        if (existEmail !== null)
          throw new BadRequestException('Email already been used!');

        user.email = email;
      }
      return await this.usersRepository.save(user);
    } else throw new BadRequestException('Invalid userId!');
  }

  async deleteUserById(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id: Number(userId) });
    if (user) {
      return await this.usersRepository.remove(user);
    } else throw new BadRequestException('Invalid userId!');
  }

  async isValidId(userId: number): Promise<boolean> {
    // courseId might be string due to runtime, Number() to convert it
    const exist = await this.usersRepository.findOneBy({ id: Number(userId) });
    return exist === null ? false : true;
  }
}
