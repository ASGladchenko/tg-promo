export const frTranslation = {
  attempts: {
    close: "Fermer le portefeuille de tentatives",
    comingSoonMessage: "Cette action sera bientôt disponible.",
    contact: {
      cancelled: "Le numéro de téléphone n’a pas été partagé.",
      error: "Impossible de demander votre numéro de téléphone. Veuillez réessayer.",
      sent: "Numéro de téléphone envoyé au bot.",
      unsupported: "Mettez Telegram à jour pour partager votre numéro de téléphone."
    },
    dailyExpires: "Expire aujourd’hui à {{time}}",
    dailyTitle: "Tentatives quotidiennes gratuites",
    dialogLabel: "Détails du portefeuille de tentatives",
    dialogTitle: "Vos tentatives",
    expiring: "Expirent aujourd’hui",
    openDetails: "Touchez pour voir les détails et en gagner plus",
    permanent: "N’expirent pas",
    rewards: {
      addPhone: {
        description: "Ajoutez et confirmez votre numéro de téléphone.",
        title: "Ajouter un téléphone"
      },
      confirmEmail: {
        description: "Confirmez votre adresse e-mail.",
        title: "Confirmer l’e-mail"
      },
      inviteFriend: {
        description: "Invitez un ami qui rejoint la promotion.",
        title: "Inviter un ami"
      },
      subscribeChannel: {
        description: "Restez abonné à la chaîne Telegram.",
        title: "S’abonner à la chaîne"
      }
    },
    rewardsText: "Effectuez des tâches simples pour recevoir plus de tentatives.",
    rewardsTitle: "Obtenir plus de tentatives",
    shortUnit: "essais",
    status: {
      comingSoon: "Bientôt",
      completed: "Fait",
      get: "Obtenir",
      requesting: "Demande..."
    },
    title: "Portefeuille de tentatives",
    walletLabel: "Portefeuille de tentatives"
  },
  auth: {
    errorLabel: "Erreur d'authentification",
    errorMessage: "Impossible de vous connecter. Veuillez réessayer.",
    loadingLabel: "Connexion en cours",
    retry: "Réessayer"
  },
  brand: {
    logoLabel: "Ouvrir le site de la marque"
  },
  languageSwitcher: {
    changeLanguage: "Changer de langue",
    menuLabel: "Choisir une langue"
  },
  lottery: {
    accept: "Valider",
    checkCode: "Vérifier le code",
    checkingCode: "Vérification du code {{code}}",
    chooseCodeDigits: "Choisissez les trois chiffres du code",
    chooseDigit: "Choisir {{digit}} pour la position {{position}}",
    chooseDigitPosition: "Choisir le chiffre {{position}}",
    clearPosition: "Effacer la position {{position}}",
    codeLocked: "Le code est verrouillé",
    digitPosition: "Chiffre {{position}}",
    enterCode: "Saisissez les trois chiffres du code",
    errors: {
      checkCombination: "Impossible de vérifier la combinaison. Veuillez réessayer."
    },
    loadingScene: "Chargement de la scène",
    openCodePicker: "Ouvrir le sélecteur de code",
    pickerDialog: "Choisir les trois chiffres du code",
    safeAlt: "Coffre-fort",
    safeDoorAlt: "Porte du coffre-fort",
    safeWheelAlt: "Roue du coffre-fort",
    sceneLabel: "Scène de loterie",
    slotUnavailable: "Choisir le chiffre {{position}}, le code est indisponible",
    soundOff: "Couper le son",
    soundOn: "Activer le son",
    widgetLabel: "Widget de loterie"
  },
  subscription: {
    dialogLabel: "Abonnement à la chaîne Telegram",
    errors: {
      checkMembership: "Impossible de vérifier l'abonnement. Veuillez réessayer."
    },
    noChannelUrl: "Le lien de la chaîne n'est pas configuré. Veuillez réessayer plus tard.",
    openChannel: "Ouvrir la chaîne",
    text: "Pour continuer, abonnez-vous à la chaîne Telegram.",
    title: "Abonnez-vous à la chaîne"
  },
  telegram: {
    open: "Ouvrir dans Telegram"
  }
} as const;
