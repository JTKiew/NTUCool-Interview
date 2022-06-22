import { BadRequestException, Injectable } from '@nestjs/common';
import { UserData, Users } from 'src/database';

@Injectable()
export class UserService {
  private users: Users[] = UserData;
  private id = 5;

  createUser(username: string, email: string): string {
    console.log(username, email);
    // if the field is not provided in http req, we might received undefined input value
    if (username == undefined || email == undefined)
      throw new BadRequestException('Invalid name or email!');

    const exist = this.users.some((obj) => {
      if (obj.name === username || obj.email === email) return true;
    });

    if (exist)
      throw new BadRequestException('Name or Email already been used!');

    this.users.push({
      id: this.id++,
      name: username,
      email: email,
    });

    console.log(this.users);
    return `User ${username} created!`;
  }

  getUser(userId: number): Users {
    if (this.isValidId(userId))
      return this.users.filter((obj) => obj.id === userId)[0];
    else throw new BadRequestException('Invalid userId!');
  }

  queryUser(filter: string, str: string): Users {
    if (filter !== 'name' && filter !== 'email')
      throw new BadRequestException('Invalid filter!');

    if (filter === 'name') {
      if (!this.users.some((obj) => obj.name == str))
        throw new BadRequestException('Invalid name!');

      return this.users.filter((obj) => obj.name === str)[0];
    }

    if (filter === 'email') {
      if (!this.users.some((obj) => obj.email == str))
        throw new BadRequestException('Invalid email!');

      return this.users.filter((obj) => obj.email === str)[0];
    }
  }

  editUser(userId: number, username: string, email: string): string {
    // if the field is not provided in http req, we might received undefined input value
    // either username or email can be not provided => no changes
    // provide at least one of them to be valid for edition
    if (username == undefined && email == undefined)
      throw new BadRequestException('Invalid name and email!');

    if (this.isValidId(userId)) {
      if (username === '' && email === '')
        throw new BadRequestException(
          `No change towards user with userId ${userId}`,
        );

      if (username !== '') this.users[userId].name = username;
      if (email !== '') this.users[userId].email = email;

      console.log(this.users);
      return `User with userId ${userId} edited!`;
    } else {
      throw new BadRequestException('Invalid userId!');
    }
  }

  deleteUser(userId: number): string {
    if (this.isValidId(userId)) {
      const index = this.users.findIndex((obj) => obj.id === userId);
      this.users.splice(index, 1);

      console.log(this.users);
      return `User with id ${userId} deleted!`;
    } else {
      throw new BadRequestException('Invalid userId!');
    }
  }

  isValidId(userId: number): boolean {
    return this.users.some((obj) => obj.id === Number(userId));
  }
}
