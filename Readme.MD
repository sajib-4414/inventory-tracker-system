# Paint Inventory and Task Assignment System

This project is a full-stack application designed to manage paint inventory and task assignment for various user roles. The system supports four types of users: admin, supervisor, painter, and supply coordinator.

## Technologies Used

- **Frontend**: ReactJS
- **Backend**: Express.js with Node.js and TypeScript
- **Database**: MongoDB Atlas cloud database with Mongoose
- **Authentication**: JWT with cookie authentication

## Features

- **User Roles**: Admin users have full control over the system, including managing tasks, users, abilities, and permissions. Supervisor users can view the paint list and manage tasks such as assigning tasks to a painter user. Painter users can view the paint list, update paint stock, see their assigned tasks, and mark them as done. Supply coordinator users can manage paints.

- **Permissions and Abilities**: Each user is associated with a list of abilities, and each ability has a list of permissions. Therefore, each user has a list of permissions, which are checked against each API to determine access.

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

CI/CD deployment is not implemented in this project due to time constraints. However, the application can be deployed manually to hosting platforms like Render.com or AWS. For local development, the backend can be started using the command:
`npm start` for both the backend and frontend.

