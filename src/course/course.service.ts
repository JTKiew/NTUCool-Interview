import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Course, courseData } from 'src/database';


@Injectable()
export class CourseService {
    // using provided fixed courses dataset
    // index courseId start from 0
    private courses: Course[] = courseData;

    public getCourse(courseId: number){
        if (this.validId(courseId)) return this.courses.filter(obj => obj.id === courseId)[0]
        else throw new BadRequestException("Invalid courseId!");
    }

    validId(courseId: number){
        return this.courses.some((obj) => (obj.id === courseId))
    }
}
