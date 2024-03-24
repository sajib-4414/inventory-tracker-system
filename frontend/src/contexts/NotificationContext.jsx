import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const ToastType = {
  Info : "info",
  Success : "success",
  Error : "error",
}

const NotificationContext = createContext(
  undefined,
);

export const NotificationProvider = ({
  children,
}) => {
  const [message, setMessage] = useState(null);
  // Declare toastFunction here
  let toastFunction;
  const resetMessage = () => {
    setMessage(null);
  };
  const showNotification = (message, config) => {
    const toastOptions = {
      autoClose: config?.length || 3000,
    };
    
    switch (config?.type) {
      case ToastType.Error:
        toastFunction = toast.error;
        break;
      case ToastType.Success:
        toastFunction = toast.success;
        break;
      case ToastType.Info:
        toastFunction = toast.info;
        break;
    }
    toastFunction(message, toastOptions);
  };
  useEffect(() => {
    //everytime message is changed, reset the message in 3s
    const timeoutId = setTimeout(() => {
      resetMessage();
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [message]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <ToastContainer />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
