import { ToastContainer } from "react-toastify";

import "./toast-notifications.scss";

export function ToastNotifications() {
  return (
    <ToastContainer
      position="top-right"
      theme="dark"
      autoClose={5000}
      pauseOnHover
      pauseOnFocusLoss
      draggable
      closeOnClick={false}
      limit={3}
    />
  );
}
