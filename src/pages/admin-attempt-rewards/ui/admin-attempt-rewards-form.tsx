import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  type WalletAttemptRewardsSettings,
  useUpdateWalletAttemptRewardsSettings
} from "@/entities/settings";
import { getErrorMessage } from "@/shared/lib/error";
import { notify } from "@/shared/lib/toast";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { InputField } from "@/shared/ui/input-field";

import {
  adminAttemptRewardsFormSchema,
  type AdminAttemptRewardsFormState
} from "../model/admin-attempt-rewards-form-schema";

import "./admin-attempt-rewards-form.scss";

type AdminAttemptRewardsFormProps = {
  settings: WalletAttemptRewardsSettings;
};

function getFormValues(settings: WalletAttemptRewardsSettings): AdminAttemptRewardsFormState {
  return {
    channelSubscriptionAttempts: String(settings.channelSubscriptionAttempts),
    dailyAttempts: String(settings.dailyAttempts),
    phoneConfirmationAttempts: String(settings.phoneConfirmationAttempts),
    referralFirstPlayAttempts: String(settings.referralFirstPlayAttempts)
  };
}

export function AdminAttemptRewardsForm({ settings }: AdminAttemptRewardsFormProps) {
  const updateSettings = useUpdateWalletAttemptRewardsSettings();
  const form = useForm<AdminAttemptRewardsFormState, unknown, WalletAttemptRewardsSettings>({
    defaultValues: getFormValues(settings),
    mode: "onChange",
    resolver: zodResolver(adminAttemptRewardsFormSchema)
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, isValid }
  } = form;
  const isPending = isSubmitting || updateSettings.isPending;

  useEffect(() => {
    if (!isDirty) {
      reset(getFormValues(settings));
    }
  }, [isDirty, reset, settings]);

  const onSubmit = async (values: WalletAttemptRewardsSettings) => {
    try {
      const updatedSettings = await updateSettings.mutateAsync(values);

      reset(getFormValues(updatedSettings));
      notify.success("Attempt rewards updated");
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to update attempt rewards"));
    }
  };

  return (
    <FormProvider {...form}>
      <form className="admin-attempt-rewards-form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="admin-attempt-rewards-form__heading">
          <h2 className="admin-attempt-rewards-form__title">Reward amounts</h2>
          <p className="admin-attempt-rewards-form__description">
            Daily and channel rewards expire at the end of the day. Phone and referral rewards do not expire.
          </p>
        </div>

        <div className="admin-attempt-rewards-form__fields">
          <InputField<AdminAttemptRewardsFormState>
            disabled={isPending}
            label="Daily grant"
            max={1000}
            min={1}
            name="dailyAttempts"
            step={1}
            type="number"
          />
          <InputField<AdminAttemptRewardsFormState>
            disabled={isPending}
            label="Channel subscription reward"
            max={1000}
            min={1}
            name="channelSubscriptionAttempts"
            step={1}
            type="number"
          />
          <InputField<AdminAttemptRewardsFormState>
            disabled={isPending}
            label="Phone confirmation reward"
            max={1000}
            min={1}
            name="phoneConfirmationAttempts"
            step={1}
            type="number"
          />
          <InputField<AdminAttemptRewardsFormState>
            disabled={isPending}
            label="Referral first-play reward"
            max={1000}
            min={1}
            name="referralFirstPlayAttempts"
            step={1}
            type="number"
          />
        </div>

        <div className="admin-attempt-rewards-form__actions">
          <ButtonLoading
            type="submit"
            variant="primary"
            disabled={isPending || !isDirty || !isValid}
            isLoading={isPending}
          >
            Save
          </ButtonLoading>
        </div>
      </form>
    </FormProvider>
  );
}
