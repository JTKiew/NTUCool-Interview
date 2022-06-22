import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Course, courseData } from 'src/database';


@Injectable()
export class CourseService {
    private courses: Course[] = courseData;

    public getCourse(id: number){
        if (this.validId(id))
            return this.courses[id-1]
        else
            throw new BadRequestException("Invalid id! Course not exists!");
    }

    public validId(id: number){
        if (id-1 < 0 || id-1 >= this.courses.length)
            return false;
        else
            return true
    }
}
