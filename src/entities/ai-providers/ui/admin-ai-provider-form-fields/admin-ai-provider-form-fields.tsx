import { InputField } from "@/shared/ui/input-field";

import { type AdminAiProviderFormState } from "../../model/types";

import "./admin-ai-provider-form-fields.scss";

type AdminAiProviderFormFieldsProps = {
  disabled: boolean;
};

export function AdminAiProviderFormFields({ disabled }: AdminAiProviderFormFieldsProps) {
  return (
    <div className="provider-fields">
      <InputField<AdminAiProviderFormState> name="name" label="Name" disabled={disabled} placeholder="OpenAI" />
      <InputField<AdminAiProviderFormState> name="code" label="Code" disabled={disabled} placeholder="openai" />
      <InputField<AdminAiProviderFormState>
        name="baseUrl"
        label="Base URL"
        disabled={disabled}
        placeholder="https://api.openai.com/v1"
      />
    </div>
  );
}
