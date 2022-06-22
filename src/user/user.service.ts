import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { userData, Users } from 'src/database';
import { createUserDto, editUserDto, queryUserDto } from 'src/dto';
import { userSorting } from 'src/Utility/Sorting';

@Injectable()
export class UserService {
    private users: Users[] = userData;

    createUser(dto: createUserDto){
        let exist = this.users.find((obj) => {
            return obj.name === dto.name || obj.email === dto.email;
        })
        if (exist === (undefined || null)){
            this.users.push({
                id: this.users.length , 
                name: dto.name,
                email: dto.email
            });
            console.log(this.users)
            return `User ${dto.name} created!`
        }
        else{
            throw new BadRequestException("Name or Email already been used!");
        }
    }

    public getUser(id: number){
        if (this.validId(id))
            return this.users[id];
        else 
            throw new BadRequestException("Invalid id! User not exists!");
        
    }

    queryUser(dto: queryUserDto){
        let retVal: {} = {};
        if (dto.filter === "name"){
            retVal = this.users.find(obj => obj.name === dto.str);
            if (retVal)
                return retVal;
            else
                throw new BadRequestException("Invalid name! User not exists!");
        }
        else if (dto.filter === "email"){
            retVal = this.users.find(obj => obj.email === dto.str);
            if (retVal)
                return retVal;
            else
                throw new BadRequestException("Invalid email! User not exists!");
        }
        else    
            throw new BadRequestException("Invalid filter!");
    }

    editUser(id: number, dto: editUserDto){
        if (this.validId(id)){
            if (dto.name !== ''){
                this.users[id].name = dto.name;
            }
            if (dto.email !== ''){
                this.users[id].email = dto.email;
            }
            console.log(this.users)
            return `User with id ${id} edited!`
        }
        else {
            throw new BadRequestException("Invalid id! User not exists!");
        }
    }

    deleteUser(id: number){
        if (this.validId(id)){
            this.users.splice(id,1);
            this.users = userSorting(this.users);
            console.log(this.users);
            return `User with id ${id} deleted!`;
        }
        else {
            throw new BadRequestException("Invalid id! User not exists!");
        }
    }

    public validId(id: number){
        if (id < 0 || id >= this.users.length)
            return false;
        else
            return true
    }

}
