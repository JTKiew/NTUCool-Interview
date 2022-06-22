type Student = 'student';
type Teacher = 'teacher';

type Enrollment = {
    id: number;
    userId: number;
    courseId: number;
    role: Student | Teacher;
}

export {Student, Teacher, Enrollment}