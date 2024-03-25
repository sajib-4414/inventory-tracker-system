import React from "react"
import Container from "./common/Container.jsx"
import NotFound from "./common/NotFound.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import { Route, Routes } from "react-router"
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import PaintInventory from "./components/PaintInventory.jsx"
import { ProtectedRoute } from "./common/ProtectedRoute.jsx"
import TaskList from "./components/TaskList.jsx"
import UserList from "./components/UserList.jsx"
import CreateUser from "./components/CreateUser.jsx"
import CreateTask from "./components/CreateTask.jsx"
import CreatePaint from "./components/CreatePaint.jsx"
import PermissionList from "./components/PermissionList.jsx"
import AbilityList from "./components/AbilityList.jsx"
const App = ()=>{
    return(
      <NotificationProvider>
        <Container>
        <Routes>
          
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PaintInventory />} />
            <Route path="tasks-list" element={<TaskList />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="create-paint" element={<CreatePaint />} />
            <Route path="all-permissions" element={<PermissionList />} />
            <Route path="abilities-list" element={<AbilityList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>

      </NotificationProvider>
    
    )
}
export const server_url = "https://paint-inventory-backend.onrender.com"

export default App