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
  
  const resetMessage = () => {
    setMessage(null);
  };
  const showNotification = (message, config) => {
    const toastOptions = {
      autoClose: config?.length || 3000,
    };
    switch (config?.type) {
      case ToastType.Error:
        toast.error(message,toastOptions)
        break;
      case ToastType.Success:
        toast.success(message,toastOptions)
        break;
      case ToastType.Info:
        toast.info(message,toastOptions)
        break;
    }
    
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
