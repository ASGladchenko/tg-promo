export const enTranslation = {
  auth: {
    errorLabel: "Authentication error",
    errorMessage: "Could not sign in. Please try again.",
    loadingLabel: "Signing in",
    retry: "Try again"
  },
  brand: {
    logoLabel: "Open brand website"
  },
  lottery: {
    accept: "Accept",
    checkCode: "Check code",
    checkingCode: "Checking code {{code}}",
    chooseCodeDigits: "Choose the three code digits",
    chooseDigit: "Choose {{digit}} for position {{position}}",
    chooseDigitPosition: "Choose digit {{position}}",
    clearPosition: "Clear position {{position}}",
    codeLocked: "Code is locked",
    digitPosition: "Digit {{position}}",
    enterCode: "Enter the three code digits",
    errors: {
      checkCombination: "Could not check the combination. Please try again."
    },
    loadingScene: "Loading scene",
    openCodePicker: "Open code picker",
    pickerDialog: "Choose the three code digits",
    safeAlt: "Safe",
    safeDoorAlt: "Safe door",
    safeWheelAlt: "Safe wheel",
    sceneLabel: "Lottery scene",
    slotUnavailable: "Choose digit {{position}}, code is unavailable",
    soundOff: "Turn sound off",
    soundOn: "Turn sound on",
    widgetLabel: "Lottery widget"
  },
  subscription: {
    dialogLabel: "Telegram channel subscription",
    errors: {
      checkMembership: "Could not check the subscription. Please try again."
    },
    noChannelUrl: "The channel link is not configured. Please try again later.",
    openChannel: "Open channel",
    text: "To continue, subscribe to the Telegram channel.",
    title: "Subscribe to the channel"
  },
  telegram: {
    open: "Open in Telegram"
  }
} as const;
