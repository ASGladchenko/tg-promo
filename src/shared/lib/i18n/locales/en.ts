export const enTranslation = {
  attempts: {
    close: "Close attempts wallet",
    comingSoonMessage: "This action will be available soon.",
    contact: {
      cancelled: "Phone number was not shared.",
      error: "Could not request your phone number. Please try again.",
      sent: "Phone number sent to the bot.",
      unsupported: "Update Telegram to share your phone number."
    },
    inviteFriend: {
      errors: {
        noParticipantId: "Could not create your invite link. Please reopen the app and try again.",
        noShareUrl: "The game link is not configured. Please try again later.",
        share: "Could not open the invite. Please try again."
      },
      opened: "Invite opened. Choose a chat to send it.",
      shareText:
        "🔐 Help me crack the safe. Open this invitation, play the game, and we will both get one extra attempt as a reward."
    },
    channelSubscription: {
      bonusGranted: "Channel subscription confirmed. Daily attempt added.",
      confirmed: "Channel subscription confirmed.",
      opened: "Channel opened. Return here after subscribing."
    },
    dailyExpires: "Expires in {{time}}",
    dailyTitle: "Daily free attempts",
    dialogLabel: "Attempts wallet details",
    dialogTitle: "Your attempts",
    expiring: "Expire today",
    openDetails: "Tap to see details and earn more",
    permanent: "Do not expire",
    rewards: {
      addPhone: {
        description: "Add and confirm your phone number.",
        title: "Add phone number"
      },
      confirmEmail: {
        description: "Confirm your email address.",
        title: "Confirm email"
      },
      inviteFriend: {
        description:
          "Invite a friend to crack the safe. You both get one attempt when they join through your link.",
        title: "Invite a friend"
      },
      subscribeChannel: {
        description: "Stay subscribed to the Telegram channel.",
        title: "Subscribe to the channel"
      }
    },
    rewardsText: "Complete simple tasks to receive more attempts.",
    rewardsTitle: "Get more attempts",
    shortUnit: "tries",
    status: {
      comingSoon: "Soon",
      completed: "Done",
      get: "Get",
      requesting: "Requesting..."
    },
    title: "Attempts wallet",
    walletLabel: "Attempts wallet"
  },
  auth: {
    errorLabel: "Authentication error",
    errorMessage: "Could not sign in. Please try again.",
    loadingLabel: "Signing in",
    retry: "Try again"
  },
  brand: {
    logoLabel: "Open brand website"
  },
  languageSwitcher: {
    changeLanguage: "Change language",
    menuLabel: "Choose a language"
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
    errors: {
      checkMembership: "Could not check the subscription. Please try again."
    },
    noChannelUrl: "The channel link is not configured. Please try again later."
  },
  telegram: {
    open: "Open in Telegram"
  }
} as const;
