# Paint Inventory and Task Assignment System

This project is a full-stack application designed to manage paint inventory and task assignment for various user roles. The system supports four types of users: admin, supervisor, painter, and supply coordinator.

## Technologies Used

- **Frontend**: ReactJS
- **Backend**: Express.js with Node.js and TypeScript
- **Database**: MongoDB Atlas cloud database with Mongoose
- **Authentication**: JWT with authenticated by cookie in client.
- **Authorization** : Role based Access Control system.

## Features

- **User Roles**: Admin users have full control over the system, including managing tasks, users, abilities, and permissions. Supervisor users can view the paint list and manage tasks such as assigning tasks to a painter user. Painter users can view the paint list, update paint stock, see their assigned tasks, and mark them as done. Supply coordinator users can manage paints.
- **Signup and Login**: One can signup as Painter, Supply coordinator or Supervisor. One cannot signup as an admin from the frontend. Admin has to create another admin user, or admin user can be signed up from API only.
- **Paint Inventory Management**: An Admin or Supply Coordinator user can add paint, update paint, and delete paint. Painter and Supervisor user can see the paint inventory, but cannot add/update any paint.
- **Paint Task Management**: And Admin or Supervisor can add tasks, assign task to a painter user, update, delete a task. Then a Painter user can login to see his own tasks, and mark his own tasks as done.
- **User, Ability, Permission Management**: Admin user can create Any kind of user. Admin user can also enable, disable users. Also admin can add more abilities, permissions.

- **Role Based Acces Control System**: The application is designed with robust Role Based Access Control system in the Backend. 
  - *User types:* Ther are 4 kinds of users,they are identified by their type. Each User has `type` property, type can be Supervisor, Painter, Supply Coordinator, and Admin. 
  - *User Abilities:* Each user is associated with a list of abilities. Example, RegularAuth Ability means usr can update password, update profile, get current user details.
  - *Permissions*: Each ability has a list of permissions. For example, allow_get_all_paints, allow_get_all_users.
  
  Therefore, each user has a list of permissions inheriting from the abilities. Each API route has designated permission. A checkPermission Middleware checks if user has the right permission to call this backend API.

- **API Endpoints**:
  - Authentication Endpoints:
    - `api/v1/auth/login` POST
    - `api/v1/auth/register` POST
    - `api/v1/auth/updatedetails` POST
    - `api/v1/auth/updatepassword` PUT
    - `api/v1/auth/logout` GET
    - `api/v1/auth/me` GET
  - Permissions, Users, Abilities Endpoints:
    - `api/v1/auth/permissions` GET CREATE UPDATE DELETE
    - `api/v1/auth/permissions/permissionId` GET DELETE UPDATE
    - `api/v1/auth/abilities` GET CREATE UPDATE DELETE
    - `api/v1/users` GET CREATE UPDATE DELETE
    - `api/v1/users/setenabled/userId` POST
  - Paint Endpoints:
    - `api/v1/paints` GET CREATE UPDATE DELETE
    - `api/v1/paints/update-stock-all` update stock of a paint being admin/coordinator
    - `api/v1/paints/update-stock-assigned` update stock of a paint being painter
  - Tasks Endpoints:
    - `api/v1/tasks` GET CREATE DELETE
    - `api/v1/tasks/mytasks` GET
    - `api/v1/tasks/updateanytask` update task details of a task being supervisor/admin
    - `api/v1/tasks/updateanytask` update status of a task being painter

## Deployment

CI/CD deployment is not implemented in this project due to time constraints. I have deployed it to render.com for viewing purposes. For local development, both the backend and frontend can be cloned and started using the command:
`npm start` .

