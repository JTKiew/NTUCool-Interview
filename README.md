# NTUCool-Interview

## Preparation and Installation
- install nest.js using `npm install -g @nestjs/cli`
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

### Guards
- contain guard for Bearer Token validation

### Roles
- contain custom decorator to assign roles to metadata
- contain role enum

### Database
- contain the initData for Restful API
- contain the schema(type) for Users, Courses and Enrollments

### Dto
- dto directory kept format for how the data sent over the network

## Restful API
### User API
```mermaid
%%{ init : { "flowchart" : { "curve" : "linear" }}}%%
graph LR
    B{/users}
    B --> F("GET {/:userId}") 
    B --> G("GET {?filter= & str= }") 
    B --> E("POST ") 
    B --> H("PUT {/:userId}") 
    B --> I("DELETE {/:userId}") 
    
    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    Guards["BearerAuthGuard + RolesGuard <br> Validate Bearer Token and user's role"]
   
    F & G --> Pipes
    E & H & I --> Guards
    
    Guards --> |"Pass"| Pipes
    Pipes --> |"Pass"| J(UserController)
    
    Pipes --> |"Fail"| ThrowException
    Guards --> |"Fail"| ThrowException
    

    J --> K{UserService}
    K --> M("getUser()")
    K --> N("queryUser()")
    K --> L("createUser()")
    K --> O("editUser()")
    K --> P("deleteUser()")
``` 

- create User: **POST**`.../users`
- get User: **GET**`.../users/:userId`
- query User: **GET**`.../users?filter= & str=`
- edit User: **PUT**`.../users/:userId`
- delete User: **DELETE**`.../users/:userId`

### Enrollment API
```mermaid
%%{ init : { "flowchart" : { "curve" : "linear" }}}%%
graph LR
    C{/enrollments}
    C --> J("GET {/courses/:courseId/users}")
    C --> K("POST ")
    C --> L("DELETE {/:enrollmentId}")
    C --> M("GET {/:enrollmentId}")
    C --> N("GET ")
    C --> O("GET {/users/:userId/courses}")

    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    Guards["BearerAuthGuard + RolesGuard <br> Validate Bearer Token and user's role"]
  
    J & M & N & O -->Pipes
    K & L --> Guards
    
    Guards --> |"Pass"| Pipes
    Pipes --> |"Pass"| P(EnrollmentController)
    
    Pipes --> |"Fail"| ThrowException
    Guards --> |"Fail"| ThrowException

    P --> R{EnrollmentService}

    R --> S("queryCourseUsers()")
    R --> V("getEnrollment()")
    R --> W("queryEnrollments()")
    R --> X("queryUserCourses()")
    R --> T("addEnrollment()")
    R --> U("deleteEnrollment()")
```
- query Course Users: **GET** `.../enrollments/courses/:courseId/users`
- add Ennrollment: **POST**`.../enrollments`
- delete Enrollment: **DELETE**`.../enrollments/:enrollmentId`
- get Enrollment: **GET**`.../enrollments/:enrollmentId`
- query Enrollments: **GET**`..../enrollments?userId= &courseId= &role= `
- query User Courses: **GET**`.../enrollments/users/:userId/courses`
### Course API
``` mermaid
%%{ init : { "theme" : "default", "flowchart" : { "curve" : "linear" }}}%%
flowchart LR    
    Pipes["Validation Pipes + ParseIntPipe <br> Validate and Transform input data type"]
    A{/courses} --> B("GET {/:courseId}")
    B --> Pipes
    Pipes --> |"Pass"| CourseController
    Pipes --> |"Fail"| ThrowException
    CourseController --> CourseService
    CourseService --> C("getCourse()")
```
- get Courses: **GET**`.../courses/:courseId`

### Swagger 
- `localhost:3000/api`
- ![](https://i.imgur.com/T78IS5S.png)

## Some Implementations and Fix
### email must match regex \/^\S@\S$\/
- using ValidationPipe to verify the format of email
- `@Matches('\^[\\S]+@[\\S]+$') `
    
### return BadRequest 
- `throw new BadRequestException({ErrMsg});`

### return Unauthorized
-  `throw new UnauthorizedException();`

### Bearer Auth token Header, token = 'cool'
- use BearerAuthGuard to validate Bearer Token
- carry Bearer Token in the header of html request 
    - In Header: {Athorization: Bearer 'cool'}
    - extract auth token by 
        - `bearerToken = req.headers['authorization'].split(' ');`
        - should get 
            - `bearerToken.length === 2`
            - `bearerToken[0] === 'Bearer' && bearerToken[1] === 'cool'`

### Restful API issue
- remove unecessary verbs in url path 
- new API stated above 

### userId issue
- previously using users[] array index as userId
    - loss the unique property of userId
- solution
    - declare a `private id = 5` variable, update after each user creation
        - allow to maintain unique userId and used as increment id
        ```
                this.users.push({
                  id: this.id++,
                  name: username,
                  email: email,
                });
        ```

### courseId issue
- previously start at 1, now start at 0 
- total of 5 entries according to dataset provided

### isValidId modification
- previously differ in User, Enrollment and Course due to different id range
- utilise arr.some(), user's isValidId as example: 
    ```
        isValidId(userId: number): boolean {
            return this.users.some((obj) => obj.id === Number(userId));
          }
    ``` 
    
### replace middleware to guards
#### implement `BearerAuthGuard`
- fix `bearerToken[1]` might cause internal server error problem
    - check before access 
    ```
         if (bearerToken.length !== 2)
            throw new BadRequestException('Invalid Bearer Token!');
    ```
- assign BearerAuthGuard with decorator `useGuards(BearerAuthGuard)`

#### implement `RolesGuard`
- in BearerAuthGuard, after pass Bearer Token validation, attach admin role info to HttpRequest
    ```
        if (bearerToken[0] === 'Bearer' && bearerToken[1] === 'cool') {
            // attach user's role to HttpRequest
            request.user = { roles: Role.Admin };
            return true;
        } 
    ```
- extract `requiredRoles` from metadata then verify with `user.roles` attached in HttpRequest
    ```
        return requiredRoles.some((role) => user.roles?.includes(role));
    ```
- assign RolesGuard with decorator `useGuards(RolesGuard)`

### coding style issue 
- rename files name
- rename variables, functions, classes name using camelCase and PascalCase
- implement prettier and eslint to help adjusting code structure
-  references: 
    -  https://angular.io/guide/styleguide 
    -  https://google.github.io/styleguide/tsguide.html


