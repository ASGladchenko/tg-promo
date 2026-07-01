import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { ButtonBase } from "@/shared/ui/button-base";
import { InputField } from "@/shared/ui/input-field";

import { formLoginSchema, LoginFormState } from "../model/admin-login-schema";
import { useAdminLogin } from "../model/use-admin-login";

import "./admin-login-form.scss";

export function AdminLoginForm() {
  const navigate = useNavigate();
  const adminLogin = useAdminLogin();

  const form = useForm<LoginFormState>({ resolver: zodResolver(formLoginSchema) });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = form;

  const isLoginPending = isSubmitting || adminLogin.isPending;

  const onSubmit = async (data: LoginFormState) => {
    try {
      await adminLogin.mutateAsync(data);
      navigate("/admin");
    } catch (error) {
      setError("login", {
        type: "server",
        message: error instanceof Error ? error.message : "Login failed"
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form className="admin-login__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="admin-login__fields">
          <InputField<LoginFormState> name="login" label="Login" disabled={isLoginPending} />
          <InputField<LoginFormState>
            name="password"
            label="Password"
            type="password"
            disabled={isLoginPending}
          />
        </div>

        <ButtonBase type="submit" disabled={isLoginPending}>
          Log in
        </ButtonBase>
      </form>
    </FormProvider>
  );
}
