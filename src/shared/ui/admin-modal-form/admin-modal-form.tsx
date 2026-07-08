import type { ReactNode } from "react";

import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";

import "./admin-modal-form.scss";

type AdminModalFormProps<TFormValues extends FieldValues> = {
  children: ReactNode;
  closeAriaLabel: string;
  eyebrow?: string;
  form: UseFormReturn<TFormValues>;
  isCloseDisabled?: boolean;
  onClose: () => void;
  onInvalidSubmit?: SubmitErrorHandler<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  title: string;
};

export function AdminModalForm<TFormValues extends FieldValues>({
  form,
  title,
  eyebrow,
  onClose,
  children,
  onSubmit,
  closeAriaLabel,
  onInvalidSubmit,
  isCloseDisabled = false
}: AdminModalFormProps<TFormValues>) {
  return (
    <FormProvider {...form}>
      <form
        className="admin-modal-form admin-hover-scrollbar-container"
        onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
      >
        <div className="admin-modal-form__header">
          <div>
            {eyebrow ? <p className="admin-modal-form__eyebrow">{eyebrow}</p> : null}
            <h2 className="admin-modal-form__title">{title}</h2>
          </div>

          <button
            type="button"
            className="admin-modal-form__close"
            aria-label={closeAriaLabel}
            onClick={onClose}
            disabled={isCloseDisabled}
          >
            <span className="admin-modal-form__close-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="admin-modal-form__content admin-hover-scrollbar">{children}</div>
      </form>
    </FormProvider>
  );
}
