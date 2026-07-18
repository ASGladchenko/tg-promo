type AdminModalFormRootErrorProps = {
  message?: string;
};

export function AdminModalFormRootError({ message }: AdminModalFormRootErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="admin-modal-form__root-error" role="alert">
      {message}
    </p>
  );
}
