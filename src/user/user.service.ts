import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { userData, Users } from 'src/database';
import { createUserDto, editUserDto, queryUserDto } from 'src/dto';
import { userSorting } from 'src/Utility/Sorting';

@Injectable()
export class UserService {
    private users: Users[] = userData;
    private id: number = 5;

    createUser(dto: createUserDto){
        // if the field is not provided in http req, we might received undefined input value
        if (dto.name === undefined || dto.email === undefined) throw new BadRequestException("Invalid name or email!");

        let exist = this.users.some((obj) => (
            obj.name === dto.name || obj.email === dto.email));

        if (exist) throw new BadRequestException("Name or Email already been used!");

        this.users.push({
            id: this.id++ , 
            name: dto.name,
            email: dto.email
        });

        console.log(this.users)
        return `User ${dto.name} created!`
    }

    getUser(userId: number){
        if (this.validId(userId)) return this.users.filter(obj => obj.id === userId)[0]
        else throw new BadRequestException("Invalid userId!");
    }

    // TODO: create custom validation pipes for blank name
    queryUser(dto: queryUserDto){
        console.log(dto)
        if (dto.filter !== 'name' && dto.filter !== 'email') throw new BadRequestException("Invalid filter!");

        if (dto.filter === "name"){
            if (!this.users.some(obj => obj.name == dto.str)) throw new BadRequestException("Invalid name!");
            return this.users.filter(obj => obj.name === dto.str);
        }
        
        if (dto.filter === "email"){
            if (!this.users.some(obj => obj.email == dto.str)) throw new BadRequestException("Invalid email!");
            return this.users.filter(obj => obj.email === dto.str);
        }
    }

    editUser(userId: number, dto: editUserDto){
        // if the field is not provided in http req, we might received undefined input value
        if (dto.name === undefined || dto.email === undefined) throw new BadRequestException("Invalid name or email!");

        if (this.validId(userId)){
            if (dto.name === '' && dto.email === '') throw new BadRequestException(`No change towards user with userId ${userId}`)
            if (dto.name !== '')  this.users[userId].name = dto.name;
            if (dto.email !== '') this.users[userId].email = dto.email;
            console.log(this.users)
            return `User with userId ${userId} edited!`
        }
        else throw new BadRequestException("Invalid userId!");
    }

    deleteUser(userId: number){
        if (this.validId(userId)){
            const index = this.users.findIndex(obj => obj.id === userId)
            this.users.splice(index,1);
            console.log(this.users);
            return `User with userId ${userId} deleted!`;
        }
        else throw new BadRequestException("Invalid userId!");
    }

    validId(userId: number){
        return this.users.some((obj) => (obj.id === Number(userId)));
    }
}
