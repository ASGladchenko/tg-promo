import { AdminLoginForm } from "@/features/admin-login";

import "./admin-login.scss";

export function AdminLogin() {
  return (
    <div className="admin-login" aria-label="Admin login">
      <div className="admin-login__wrapper">
        <h4 className="admin-login__title">Crack Safe </h4>
        <p className="admin-login__description">Please log in to your account</p>

        <AdminLoginForm />
      </div>
    </div>
  );
}
