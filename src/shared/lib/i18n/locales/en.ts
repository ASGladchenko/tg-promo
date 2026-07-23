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
  mine: {
    cellLabel: "Mine cell {{position}}",
    sceneLabel: "Mine scene",
    session: {
      countdownGo: "GO",
      goldLabel: "Gold collected: {{count}}",
      label: "Mine game",
      restart: "Restart",
      start: "Start"
    }
  },
  myPrizes: {
    close: "Close prizes",
    awardedModal: {
      close: "Close prize details",
      eyebrow: "Prize unlocked",
      label: "Consolation prize details",
      title: "Consolation prize won"
    },
    back: "Back to rewards",
    copied: "Copied",
    copy: "Copy",
    copyAriaLabel: "Copy promo code {{promoCode}}",
    descriptionTitle: "Prize description",
    empty: "No rewards yet. Your promo codes will appear here.",
    error: "Could not load your rewards. Please try again.",
    eyebrow: "Prizes",
    infoAriaLabel: "Open prize details for {{prize}}",
    loading: "Loading rewards...",
    modalLabel: "Your prize rewards",
    noDescription: "Prize description is not available yet.",
    noPromoCode: "No promo code",
    open: "Open your prizes",
    outcomes: {
      jackpot: "Jackpot",
      semiJackpot: "Combo jackpot",
      consolationPrize: "Consolation prize"
    },
    title: "Your rewards"
  },
  lottery: {
    accept: "Accept",
    availability: {
      fallback: "The safe is temporarily unavailable. We will announce a new one in the channel.",
      preparingNewSafe: "A new safe is being prepared. Wait for an announcement in the channel."
    },
    checkCode: "Check code",
    checkingCode: "Checking code {{code}}",
    chooseCodeDigits: "Choose the three code digits",
    chooseDigit: "Choose {{digit}} for position {{position}}",
    chooseDigitPosition: "Choose digit {{position}}",
    clearPosition: "Clear position {{position}}",
    codeLocked: "Code is locked",
    digitPosition: "Digit {{position}}",
    duplicateCodeModal: {
      cancel: "No",
      confirm: "Yes",
      label: "Confirm repeated code entry",
      message: "You have already entered this code. Do you want to enter it again?",
      title: "Code already used"
    },
    enterCode: "Enter the three code digits",
    enteredCodesModal: {
      close: "Close entered codes",
      label: "Previously entered codes",
      title: "Entered codes"
    },
    enteredCodesTrigger: "Codes: {{count}}",
    errors: {
      checkCombination: "Could not check the combination. Please try again."
    },
    loadingScene: "Loading scene",
    openCodePicker: "Open code picker",
    pickerDialog: "Choose the three code digits",
    prizeModal: {
      close: "Close prize details",
      eyebrow: "Prize unlocked",
      fields: {
        description: "Description",
        name: "Prize",
        promoCode: "Promo code"
      },
      label: "Combo jackpot prize details",
      noDetails: "Prize details will be available soon."
    },
    results: {
      gameFinished: "All safes have been cracked for today.",
      jackpot: "Jackpot won.",
      jackpotAlreadyWon: "The jackpot has already been won. Your attempt was not spent.",
      jackpotWithPrize: "Jackpot won. Prize: {{prizeDetails}}",
      duplicateSemiJackpotLose: "Jackpot not won. Combo jackpot is still active.",
      lose: "No luck this time.",
      noAttempts: "You have no attempts left. Open the attempts wallet to earn more.",
      noRules: "The safe is not available today.",
      semiJackpot: "Combo jackpot won.",
      semiJackpotAlreadyWon: "The combo jackpot has already been won. Your attempt was not spent.",
      semiJackpotWithPrize: "Combo jackpot won. Prize: {{prizeDetails}}",
      userJackpotAlreadyWon: "You have already won the jackpot today. Your attempt was not spent."
    },
    safeAlt: "Safe",
    safeDoorAlt: "Safe door",
    safeResult: {
      jackpot: "Jackpot"
    },
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
