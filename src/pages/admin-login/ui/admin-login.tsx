import { ButtonBase } from "@/shared/ui/button-base";
import { InputField } from "@/shared/ui/input-field";

import "./admin-login.scss";

export function AdminLogin() {
  return (
    <div className="admin-login" aria-label="Admin login">
      <div className="admin-login__wrapper">
        <h4 className="admin-login__title">Crack Safe</h4>
        <p className="admin-login__description">Please log in to your account</p>

        <form className="admin-login__form">
          <div className="admin-login__fields">
            <InputField name="username" label="Username" />
            <InputField name="password" label="Password" type="password" />
          </div>

          <ButtonBase type="submit">Log in</ButtonBase>
        </form>
      </div>
    </div>
  );
}
