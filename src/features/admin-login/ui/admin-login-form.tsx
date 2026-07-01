import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { ButtonBase } from "@/shared/ui/button-base";
import { InputField } from "@/shared/ui/input-field";

import { formLoginSchema, LoginFormState } from "../model/admin-login-schema";

import "./admin-login-form.scss";

export function AdminLoginForm() {
  const navigate = useNavigate();

  const form = useForm<LoginFormState>({ resolver: zodResolver(formLoginSchema) });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = form;

  const onSubmit = async (data: LoginFormState) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log({ data });
      navigate("/admin");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <FormProvider {...form}>
      <form className="admin-login__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="admin-login__fields">
          <InputField<LoginFormState> name="login" label="Login" />
          <InputField<LoginFormState> name="password" label="Password" type="password" />
        </div>

        <ButtonBase type="submit" disabled={isSubmitting}>
          Log in
        </ButtonBase>
      </form>
    </FormProvider>
  );
}
