import { useState } from "react";

import EyeSlashIcon from "@/shared/svg/eye-slash.svg?react";
import EyeIcon from "@/shared/svg/eye.svg?react";
import { InputField } from "@/shared/ui/input-field";

import { LoginFormState } from "../model/admin-login-schema";

import "./admin-login-password-field.scss";

type AdminLoginPasswordFieldProps = {
  disabled: boolean;
};

export function AdminLoginPasswordField({ disabled }: AdminLoginPasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="admin-login-password-field">
      <InputField<LoginFormState>
        className="admin-login-password-field__input"
        name="password"
        type={isPasswordVisible ? "text" : "password"}
        label="Password"
        disabled={disabled}
      />

      <button
        type="button"
        disabled={disabled}
        className="admin-login-password-field__toggle"
        onClick={() => setIsPasswordVisible((value) => !value)}
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
      >
        {isPasswordVisible ? <EyeSlashIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
      </button>
    </div>
  );
}
