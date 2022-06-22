type Student = 'student';
type Teacher = 'teacher';

type Enrollments = {
  id: number;
  userId: number;
  courseId: number;
  role: Student | Teacher;
};

export { Student, Teacher, Enrollments };
