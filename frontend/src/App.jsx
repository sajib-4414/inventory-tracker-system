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
const App = ()=>{
    return(
      <NotificationProvider>
        <Container>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="paint-inventory" element={<PaintInventory />} />
            <Route path="tasks-list" element={<TaskList />} />
            <Route path="user-list" element={<UserList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>

      </NotificationProvider>
    
    )
}

export default App