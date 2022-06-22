import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { Course, Enrollment, Users } from 'src/database';
import { addEnrollmentDto, queryEnrollmentDto } from 'src/dto';
import { UserService } from 'src/user/user.service';
import { enrollSorting } from 'src/Utility/Sorting';

@Injectable()
export class EnrollmentService {
    @Inject(UserService)
    private readonly userService: UserService;
    @Inject(CourseService)
    private readonly courseService: CourseService;

    private enrollments: Enrollment[] = [];

    queryCourseUser(courseId: number){
        if (this.courseService.validId(courseId)){
            let retVal: Users[] = []
            this.enrollments.forEach(obj => {
                if (obj.courseId === courseId)
                    retVal.push(this.userService.getUser(obj.userId));
            })            
            retVal.sort((a,b) => (b.id < a.id ? 1 : b.id > a.id ? -1: 0))
            retVal = retVal.filter((obj,i) => i === retVal.indexOf(obj))
                
            return retVal
        }
        else
            throw new BadRequestException("Invalid id! Course not exists!");
    }

    addEnroll(dto: addEnrollmentDto){
        if (this.userService.validId(dto.userId) !== true)
            throw new BadRequestException("Invalid userId!");
        if (this.courseService.validId(dto.courseId) !== true)
            throw new BadRequestException("Invalid courseId!");
        if (dto.role.localeCompare('student') !== 0 && dto.role.localeCompare('teacher') !== 0)
            throw new BadRequestException("Invalid role!");
        if (this.enrollments.some(obj => 
            obj.userId == dto.userId && 
            obj.courseId == dto.courseId &&
            obj.role == dto.role) == true){
                throw new BadRequestException("Enrollment Existed!");
            }
        else{
            this.enrollments.push({
                'id': this.enrollments.length,
                'userId': Number(dto.userId),
                'courseId': Number(dto.courseId),
                'role': dto.role
            })
            console.log(this.enrollments);
            return `New Enrollment added!`;
        }
    }

    deleteEnroll(id: number){
        if (this.validId(id)){
            this.enrollments.splice(id,1)
            this.enrollments = enrollSorting(this.enrollments);
            console.log(this.enrollments);
            return `Enrollment with id ${id} deleted!`
        }
        else {
            throw new BadRequestException("Invalid id! Enrollment not exists!");
        }
    }

    getEnroll(id: number){
        if (this.validId(id))
            return this.enrollments[id]
        else
            throw new BadRequestException("Invalid id! Enrollment not exists!");
    }

    queryEnroll(dto: queryEnrollmentDto){
        let filter: {[key: string]: any} = {}

        if (String(dto.userId) !== "" && dto.userId !== undefined){
            if(this.userService.validId(dto.userId) === true)
                filter.userId = Number(dto.userId);
            else    
                throw new BadRequestException("Invalid id! User not exists!");
        }
           
        if (String(dto.courseId) !== "" && dto.courseId !== undefined){
            if(this.courseService.validId(dto.courseId) === true)
                filter.courseId = Number(dto.courseId);
            else    
                throw new BadRequestException("Invalid id! Course not exists!");
        }

        if (String(dto.role) !== "" && dto.role !== undefined){
            if (dto.role.localeCompare('student') !== 0 && dto.role.localeCompare('teacher') !== 0)
                throw new BadRequestException("Invalid role!");
            else    
                filter.role = dto.role;
        }

        if (Object.keys(filter).length !== 0){
            let retVal: Enrollment[] = this.enrollments.filter(
                obj => { return Object.keys(filter).every(propName => obj[propName] === filter[propName])}
            )
            return retVal;
        }
        else
            return [];
    }

    queryUserCourse(userId: number){
        if (this.userService.validId(userId) === true){
            let retVal: Course[] = []
            this.enrollments.forEach(obj => {
                if (obj.userId === userId)
                    retVal.push(this.courseService.getCourse(obj.courseId));
            })            
            retVal.sort((a,b) => (b.id < a.id ? 1 : b.id > a.id ? -1: 0))
            retVal = retVal.filter((obj,i) => i === retVal.indexOf(obj))
            return retVal
        }
        else
            throw new BadRequestException("Invalid id! User not exists!");

    }

    public validId(id: number){
        if (id < 0 || id >= this.enrollments.length)
            return false;
        else
            return true
    }
    
}
