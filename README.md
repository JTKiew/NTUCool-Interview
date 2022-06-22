# NTUCool-Interview

## Preparation and Installation
- install nest.js cli using `npm install -g @nestjs/cli`
- install the required modules through `npm install`
- run the Web API with `npm run start`
- test the Web API through API tester like Postman(https://www.postman.com/), Insomnia(https://insomnia.rest/) 

## Directories & Files
### User 
- contain module, controller and service related to users

### Course
- contain module, controller and service related to courses

### Enrollment
- contain module, controller and service related to enrollments

### Database
- contain the initData for Restful API
- contain the schema(type) for User, Course and Enrollment

### Dto
- dto directory kept format for how the data sent over the network

### Utility
- contain helper functions to assist response of Restful API

### logger.middleware.ts
- used to validate BearerAuthToken 

## Restful API
- Following are documents of input and response of APIs
- go to `localhost:3000/api` for more visualized API provided by Swagger
- to test enrollment API, please use .../enrollment/add to create enrollment entry first
### User
```mermaid
graph LR
    A[localhost:3000] --> B(/user)
    B["/user"] --> E(/create) 
    B["/user"] --> F(/get/:id) 
    B["/user"] --> G(/query) 
    B["/user"] --> H(/edit/:id) 
    B["/user"] --> I(/delete/:id) 

    F["/get/:id"]       --> J{UserController}
    G["/query"]         --> J{UserController}
    E["/create"]        --> Z{Middleware}
    H["/edit/:id"]      --> Z{Middleware}
    I["/delete/:id"]    --> Z{Middleware}

    Z{Middleware} --> J{UserController}
    J{UserController} --> K{UserService}

    K{UserService} --> M("getUser()")
    K{UserService} --> N("queryUser()")
    K{UserService} --> L("createUser()")
    K{UserService} --> O("editUser()")
    K{UserService} --> P("deleteUser()")

```
- **".../user/create"**
    - **ReqMethod: POST**
    - **create new user**
    - **requirement:** 
        -  In Header: {Authorization: Bearer {token} }
        -  In Body: { "name": {string}, "email": {string} }
    - **response:**
        - success 
            - User {name} created!
        - invalid email
            - BadRequestException("str must match \^[\\S]+@[\\S]+$ regular expression");
        - duplicate users
            - BadRequestException("Name or Email already been used!");
        - invalid token
            - UnauthorizedException();
            
- **".../user/get/:id"**
    - **ReqMethod: GET**
    - **get user data by id**
    - **requirement:**
        - id should replace with valid target user's id 
    - **response:**
        - success
            - user's data
        - invalid id
            - BadRequestException("Invalid id! User not exists!");
            
- **".../user/query?filter={string}&str={string}"**
    - **ReqMethod: GET**
    - **query user by name/email**
    - **use filter to specified content of str (name / email), str contain query parameter**
    - **requirement:**
        - In Query: { "filter": {"name" or "email"}, "str": {string} }
    - **response:**
        - success
            - user's data
        - invalid email
            - BadRequestException("str must match "\^[\\S]+@[\\S]+$" regular expression")
        - invalid filter
            - BadRequestException("Invalid filter!");
        - invalid str
            - BadRequestException("Invalid name! User not exists!");
            - BadRequestException("Invalid email! User not exists!");
            
- **".../user/edit/:id"**
    - **ReqMethod: PUT**
    - **edit user name and email by id**
    - **content in name or email can be blank => no changes**
    - **requirement:**
        - id should replace with valid target user's id 
        - In Header: {Authorization: Bearer {token} }
        - In Body: { "name": {string}, "email": {string} }
    - **response:**
        -  success
            -  User with id {id} edited!
        -  invalid id
            -  BadRequestException("Invalid id! User not exists!");
        -  invalid token
            -  UnauthorizedException();
         - invalid email
            -  BadRequestException("str must match "\^[\\S]+@[\\S]+$" regular expression")
            
- **".../user/delete/:id"**
    - **ReqMethod: DELETE**
    - **delete user by id**
    - **requirement:**
        - id should replace with valid target user's id 
        - In Header: {Authorization: Bearer {token} }
    - **response:**
        -  success
            -  User with id {id} deleted!
        -  invalid id
            -  BadRequestException("Invalid id! User not exists!");
        -  invalid token
            -  UnauthorizedException();
---
### Enrollment
```mermaid
graph LR
    A[localhost:3000] --> C(/enrollment)
    C["/enrollment"] --> J(/queryUser)
    C["/enrollment"] --> K(/add)
    C["/enrollment"] --> L(/delete/:id)
    C["/enrollment"] --> M(/get/:id)
    C["/enrollment"] --> N(/queryEnroll)
    C["/enrollment"] --> O(/queryCourse)

    J(/queryUser)   --> P{EnrollmentController}
    M(/get/:id)     --> P{EnrollmentController}
    N(/queryEnroll) --> P{EnrollmentController}
    O(/queryCourse) --> P{EnrollmentController}
    
    K(/add) --> Z{Middleware}
    L(/delete/:id) --> Z{Middleware}
    
    Z{Middleware} --> P{EnrollmentController}
    P{EnrollmentController} --> R{EnrollmentService}

    R{EnrollmentService} --> S("queryCourseUser()")
    R{EnrollmentService} --> V("getEnroll()")
    R{EnrollmentService} --> W("queryEnroll()")
    R{EnrollmentService} --> X("queryUserCourse()")
    R{EnrollmentService} --> T("addEnroll()")
    R{EnrollmentService} --> U("deleteEnroll()")
```
- **".../enrollment/queryUser?courseId={number}"**
    - **ReqMethod: GET**
    - **query user data by courseId**
    - **requirement:**
        - In Query: { "courseId": {number} }
    - **response:**
        - success
            - users data
        - invalid courseId
            - BadRequestException("Invalid id! Course not exists!")

- **".../enrollment/add"**
    - **ReqMethod: POST**
    - **add enrollment with given userId, courseId and role**
    - **requirement:**
        - In Header: {Authorization: Bearer {token} }
        - In Body: {"userId": {number}, "courseId": {number}, "role": {"student" or "teacher"} }
    - **response:**
        - success
            - New Enrollment added!
        - invalid userId
            - BadRequestException("Invalid userId!");
        - invalid courseId
            - BadRequestException("Invalid courseId!");
        - invalid role
            - BadRequestException("Invalid role!");
        - duplicate enrollment
            - BadRequestException("Enrollment Existed!");
        - invalid token
            - UnauthorizedException()

- **".../enrollment/delete/:id"**
    - **ReqMethod: DELETE**
    - **delete enrollment by id**
    - **requirement:**
        - :id must replace by the id of target enrollment
        - In Header: {Authorization: Bearer {token} }
    - **response:**
        - success
            - Enrollment with id {id} deleted!
        - invalid id 
            - BadRequestException("Invalid id! Enrollment not exists!");
        - invalid token
            - UnauthorizedException();

- **".../enrollment/get/:id"**
    - **ReqMethod: GET**
    - **get enrollment data by id**
    - **requirement:**
        - :id must replace by the id of target enrollment
    - **response:**
        - success
            - enrollment's data
        - invalid id
            - BadRequestException("Invalid id! Enrollment not exists!");

- **".../enrollment/queryEnroll?userId={number}&courseId={number}&role={string}"**
    - **ReqMethod: GET**
    - **query enrollment by userId, courseId or role**
    - **content in userId, courseId or role can be blank => not used as query parameter**
    - **requirement:**
        - In Query: { "userId": {number}, "courseId": {number}, "role": {"student" or "teacher"} }
    - **response:**
        - success
            - enrollments's data
        - invalid userId
            - BadRequestException("Invalid id! User not exists!");
        - invalid courseId
            - BadRequestException("Invalid id! Course not exists!");
        - invalid role
            - BadRequestException("Invalid role!");

- **".../enrollment/queryCourse?userId={number}"**
    - **ReqMethod: GET**
    - **query course data by userId**
    - **requirement:**
        - In Query: { "userId": {number} }
    - **response:**
        -  - success
            - enrollments's data
        - invalid userId
            - BadRequestException("Invalid id! User not exists!");
---
### Course
```mermaid
graph LR
    A[localhost:3000] --> D(/course)
    D["/course"] --> P(/get/:id)
    P["/get/:id"] --> Q{CourseController}
    Q{CourseController} --> R{CourseService}
    R{CourseService} --> S("getCourse()")
```
- **".../course/get/:id"**
    - **ReqMethod: GET**
    - **get course data by id**
    - **requirement:**
        - id should replace with valid target course's id 
    - **response:**
        - success
            - course's data
        - invalid id
            - BadRequestException("Invalid id! Course not exists!");

## 

## Some Implementations
- email must match regex \/^\S@\S$\/
    - using ValidationPipe to verify the format of email
    - @Matches('\^[\\S]+@[\\S]+$') 
    
- return BadRequest 
    - `throw new BadRequestException({ErrMsg});`

- Bearer Auth token Header, token = 'cool'
    - carry Bearer auth token in the header of http request 
    - In Header: {Athorization: Bearer cool}
    - extract auth token by 
        - `BearerToken = req.headers['authorization'].split(' ');`
        - should get `BearerToken[0] === 'Bearer' && BearerToken[1] === 'cool'`

- return Unauthorized
    -  `throw new UnauthorizedException();`

- Middleware for Bearer Auth token validation
- Swagger for visualized API table
