import { Enrollment, Users } from "../database";

// Sort by userId
function userSorting(users: Users[]): Users[]{
    let Sorted: Users[] = users.map((obj,i) => {
        return {id: i, name:obj.name, email: obj.email};
    })
    return Sorted;
}

// Sort by enrollmentId
function enrollSorting(enrolls: Enrollment[]): Enrollment[]{
    let Sorted: Enrollment[] = enrolls.map((obj,i) => {
        return {id: i, userId:obj.userId, courseId: obj.courseId, role:obj.role};
    })
    return Sorted;
}

export {userSorting, enrollSorting} 