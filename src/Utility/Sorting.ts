import { Enrollment, Users } from "../database";

function userSorting(users: Users[]): Users[]{
    let Sorted: Users[] = users.map((obj,i) => {
        return {id: i, name:obj.name, email: obj.email};
    })
    return Sorted;
}

function enrollSorting(enrolls: Enrollment[]): Enrollment[]{
    let Sorted: Enrollment[] = enrolls.map((obj,i) => {
        return {id: i, userId:obj.userId, courseId: obj.courseId, role:obj.role};
    })
    return Sorted;
}

export {userSorting, enrollSorting} 