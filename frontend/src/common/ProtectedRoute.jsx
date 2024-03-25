import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNotification } from "../contexts/NotificationContext";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const notificationHook = useNotification();
  const initialized = useRef(false);

  useEffect(() => {
    // Check if it is the first render
    if (!initialized.current) {
      initialized.current = true;
      // Check if user exists in local storage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        // if there is no user, then Show notification and navigate to login page
        toast.error('Login to see paint inventory!', {
          position: "top-right",
          autoClose: 800,
          });
        navigate("login");
      }
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Outlet />
      {/* Outlet renders the child components passed to a protected route if validation passes */}
    </>
  );
};
