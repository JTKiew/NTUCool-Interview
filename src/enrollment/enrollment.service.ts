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
    private id: number = 0;

    queryCourseUser(courseId: number){
        if (!this.courseService.validId(courseId)) throw new BadRequestException("Invalid courseId!");
        if (!this.enrollments.some(obj => obj.courseId === courseId))  throw new BadRequestException(`No enrollment with courseId ${courseId}!`);
     
        let users: Users[] = []
        this.enrollments.forEach(obj => {
            if (obj.courseId === courseId)
                users.push(this.userService.getUser(obj.userId));
        })            
        users.sort((a,b) => (b.id < a.id ? 1 : b.id > a.id ? -1: 0))
        users = users.filter((obj,i) => i === users.indexOf(obj))
            
        return users
    }

    addEnroll(dto: addEnrollmentDto){
        if (!this.userService.validId(dto.userId)) throw new BadRequestException("Invalid userId!");
        if (!this.courseService.validId(dto.courseId)) throw new BadRequestException("Invalid courseId!");
        if (dto.role.localeCompare('student') !== 0 && dto.role.localeCompare('teacher') !== 0) throw new BadRequestException("Invalid role!");

        if (this.enrollments.some(obj => 
            obj.userId == dto.userId && 
            obj.courseId == dto.courseId &&
            obj.role == dto.role)){
                throw new BadRequestException("Enrollment Existed!");
            }
        else{
            this.enrollments.push({
                'id': this.id++,
                'userId': Number(dto.userId),
                'courseId': Number(dto.courseId),
                'role': dto.role
            })
            console.log(this.enrollments);
            return `New Enrollment added!`;
        }
    }

    deleteEnroll(enrollmentId: number){
        if (this.validId(enrollmentId)){
            this.enrollments.splice(enrollmentId,1)
            console.log(this.enrollments);
            return `Enrollment with enrollmentId ${enrollmentId} deleted!`
        }
        else throw new BadRequestException("Invalid enrollmentId!");
    }

    getEnroll(enrollmentId: number){
        if (this.validId(enrollmentId)) return this.enrollments.filter(obj => obj.id === enrollmentId)[0]
        else throw new BadRequestException("Invalid enrollmentId!");
    }

    queryEnroll(dto: queryEnrollmentDto){
        let filter: {[key: string]: any} = {}

        // if userId not empty string or undefined, userId used as query parameter
        if (String(dto.userId) !== "" && dto.userId !== undefined){
            if(this.userService.validId(dto.userId)) filter.userId = Number(dto.userId);
            else throw new BadRequestException("Invalid userId!");
        }
        // if courseId not empty string or undefined, courseId used as query parameter
        if (String(dto.courseId) !== "" && dto.courseId !== undefined){
            if(this.courseService.validId(dto.courseId)) filter.courseId = Number(dto.courseId);
            else throw new BadRequestException("Invalid courseid!");
        }
        // if role not empty string or undefined, role used as query parameter
        if (String(dto.role) !== "" && dto.role !== undefined){
            if (dto.role.localeCompare('student') !== 0 && dto.role.localeCompare('teacher') !== 0) 
                throw new BadRequestException("Invalid role!");
            else filter.role = dto.role;
        }

        // extract enrollments which match the filters
        if (Object.keys(filter).length !== 0){
            let retVal: Enrollment[] = this.enrollments.filter(
                obj => { return Object.keys(filter).every(propName => obj[propName] === filter[propName])}
            )
            return retVal;
        }
        else throw new BadRequestException("No query parameters provided!")
    }

    queryUserCourse(userId: number){
        if (!this.userService.validId(userId)) throw new BadRequestException("Invalid userId!");
        if (!this.enrollments.some(obj => obj.userId === userId))  throw new BadRequestException(`No enrollment with userId ${userId}!`);
        
        let courses: Course[] = []
        this.enrollments.forEach(obj => {
            if (obj.userId === userId)
            courses.push(this.courseService.getCourse(obj.courseId));
        })            
        courses.sort((a,b) => (b.id < a.id ? 1 : b.id > a.id ? -1: 0))
        courses = courses.filter((obj,i) => i === courses.indexOf(obj))

        return courses
    }

    validId(enrollmentId: number){
        return this.enrollments.some((obj) => (obj.id === Number(enrollmentId)))
    }
    
}
