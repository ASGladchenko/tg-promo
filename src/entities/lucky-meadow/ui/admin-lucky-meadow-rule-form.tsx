import { type ChangeEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Checkbox } from "@/shared/ui/checkbox";
import { InputField } from "@/shared/ui/input-field";
import { SelectField } from "@/shared/ui/select-field";
import { SelectOption } from "@/shared/ui/select-option";
import { TextareaField } from "@/shared/ui/textarea-field";

import { adminLuckyMeadowRuleFormSchema } from "../model/admin-lucky-meadow-rule-form-schema";
import { type AdminLuckyMeadowRuleFormState } from "../model/form-types";

import "./admin-lucky-meadow-rule-form.scss";

type AdminLuckyMeadowRulePrizeOption = {
  id: string;
  name: string;
};

type AdminLuckyMeadowRuleFormProps = {
  closeAriaLabel: string;
  defaultValues: AdminLuckyMeadowRuleFormState;
  failureMessage: string;
  isPending: boolean;
  onClose: () => void;
  onReset: () => void;
  onSubmit: (data: AdminLuckyMeadowRuleFormState) => Promise<unknown>;
  onSuccess: () => void;
  periodLabel?: string;
  prizeOptions: AdminLuckyMeadowRulePrizeOption[];
  shouldShowPeriodFields?: boolean;
  submitLabel: string;
  title: string;
};

const PRIZE_FIELDS = [
  { name: "jackpotPrize", placeholder: "LUCKY-JACKPOT-001, LUCKY-JACKPOT-002", title: "Jackpot Prize" },
  { name: "semiJackpotPrize", placeholder: "LUCKY-SEMI-001, LUCKY-SEMI-002", title: "Semi-Jackpot Prize" }
] as const;

const emptyPrizeValue = {
  prizeId: "",
  promoCodes: ""
};

export function AdminLuckyMeadowRuleForm({
  closeAriaLabel,
  defaultValues,
  failureMessage,
  isPending,
  onClose,
  onReset,
  onSubmit,
  onSuccess,
  periodLabel,
  prizeOptions,
  shouldShowPeriodFields = true,
  submitLabel,
  title
}: AdminLuckyMeadowRuleFormProps) {
  const form = useForm<AdminLuckyMeadowRuleFormState>({
    resolver: zodResolver(adminLuckyMeadowRuleFormSchema),
    defaultValues
  });
  const {
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = form;
  const isFormPending = isSubmitting || isPending;
  const rootErrorMessage =
    typeof errors.root?.server?.message === "string" ? errors.root.server.message : undefined;
  const isSemiJackpotPrizeEnabled = watch("semiJackpotPrize") !== null;

  const resetForm = () => {
    onReset();
    reset(defaultValues);
  };

  const closeForm = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (data: AdminLuckyMeadowRuleFormState) => {
    try {
      await onSubmit(data);
      resetForm();
      onSuccess();
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof Error ? error.message : failureMessage
      });
    }
  };

  const handleSemiJackpotPrizeEnabledChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue("semiJackpotPrize", event.target.checked ? emptyPrizeValue : null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <AdminModalForm<AdminLuckyMeadowRuleFormState>
      closeAriaLabel={closeAriaLabel}
      eyebrow="Lucky Meadow Rule"
      form={form}
      isCloseDisabled={isFormPending}
      onClose={closeForm}
      onSubmit={handleSubmit}
      title={title}
    >
      {periodLabel ? <p className="admin-lucky-meadow-rule-form__period">{periodLabel}</p> : null}

      <div className="admin-lucky-meadow-rule-form__fields">
        {shouldShowPeriodFields ? (
          <>
            <InputField<AdminLuckyMeadowRuleFormState>
              disabled={isFormPending}
              type="date"
              name="startDate"
              label="Start date"
            />
            <InputField<AdminLuckyMeadowRuleFormState>
              disabled={isFormPending}
              type="date"
              name="endDate"
              label="End date"
            />
          </>
        ) : null}

        {PRIZE_FIELDS.map((prizeField) => {
          const isSemiJackpotPrize = prizeField.name === "semiJackpotPrize";
          const isPrizeEnabled = !isSemiJackpotPrize || isSemiJackpotPrizeEnabled;

          return (
            <fieldset key={prizeField.name} className="admin-lucky-meadow-rule-form__prize">
              <legend className="admin-lucky-meadow-rule-form__prize-title">{prizeField.title}</legend>

              {isSemiJackpotPrize ? (
                <Checkbox
                  checked={isSemiJackpotPrizeEnabled}
                  disabled={isFormPending}
                  label="Enable Semi-Jackpot Prize"
                  onChange={handleSemiJackpotPrizeEnabledChange}
                />
              ) : null}

              {isPrizeEnabled ? (
                <div className="admin-lucky-meadow-rule-form__prize-fields">
                  <SelectField<AdminLuckyMeadowRuleFormState>
                    disabled={isFormPending}
                    getDisplayValue={(value) =>
                      prizeOptions.find((prizeOption) => prizeOption.id === value)?.name ?? value
                    }
                    label="Prize"
                    name={`${prizeField.name}.prizeId`}
                    optionsCount={prizeOptions.length}
                    placeholder="Select prize"
                    renderOptions={({ onSelect, value }) =>
                      prizeOptions.map((prizeOption) => (
                        <SelectOption
                          key={prizeOption.id}
                          isSelected={prizeOption.id === value}
                          onSelect={onSelect}
                          value={prizeOption.id}
                        >
                          {prizeOption.name}
                        </SelectOption>
                      ))
                    }
                  />

                  <TextareaField<AdminLuckyMeadowRuleFormState>
                    disabled={isFormPending}
                    label="Promo codes"
                    name={`${prizeField.name}.promoCodes`}
                    placeholder={prizeField.placeholder}
                    rows={4}
                  />
                </div>
              ) : null}
            </fieldset>
          );
        })}
      </div>

      <AdminModalFormRootError message={rootErrorMessage} />

      <div className="admin-modal-form__actions">
        <ButtonBase type="button" disabled={isFormPending} onClick={closeForm} variant="danger">
          Cancel
        </ButtonBase>

        <ButtonLoading type="submit" disabled={isFormPending} isLoading={isFormPending} variant="primary">
          <span>{submitLabel}</span>
        </ButtonLoading>
      </div>
    </AdminModalForm>
  );
}
