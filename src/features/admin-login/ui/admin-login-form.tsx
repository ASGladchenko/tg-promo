import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import { ButtonBase } from "@/shared/ui/button-base";
import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";
import { InputField } from "@/shared/ui/input-field";

import { formLoginSchema, LoginFormState } from "../model/admin-login-schema";
import { useAdminLogin } from "../model/use-admin-login";
import { AdminLoginPasswordField } from "./admin-login-password-field";

import "./admin-login-form.scss";

export function AdminLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
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
      const from = location.state?.from;
      const redirectPath = from ? `${from.pathname}${from.search}${from.hash}` : "/admin";

      navigate(redirectPath, { replace: true });
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

          <AdminLoginPasswordField disabled={isLoginPending} />
        </div>

        <ButtonBase className="admin-login__submit" type="submit" disabled={isLoginPending}>
          {isLoginPending ? <CircularProgressLoader size="1.25em" /> : <span>Log in</span>}
        </ButtonBase>
      </form>
    </FormProvider>
  );
}
