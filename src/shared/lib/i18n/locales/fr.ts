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
    inviteFriend: {
      errors: {
        noParticipantId: "Impossible de créer votre lien d’invitation. Rouvrez l’application et réessayez.",
        noShareUrl: "Le lien du jeu n’est pas configuré. Veuillez réessayer plus tard.",
        share: "Impossible d’ouvrir l’invitation. Veuillez réessayer."
      },
      opened: "Invitation ouverte. Choisissez un chat pour l’envoyer.",
      shareText:
        "🔐 Aide-moi à ouvrir le coffre. Ouvre cette invitation, joue, et nous recevrons chacun une tentative supplémentaire en récompense."
    },
    channelSubscription: {
      bonusGranted: "Abonnement à la chaîne confirmé. Tentative quotidienne ajoutée.",
      confirmed: "Abonnement à la chaîne confirmé.",
      opened: "Chaîne ouverte. Revenez ici après vous être abonné."
    },
    dailyExpires: "Expire dans {{time}}",
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
        description:
          "Invitez un ami à ouvrir le coffre. Vous recevez chacun une tentative quand il rejoint via votre lien.",
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
  myPrizes: {
    close: "Fermer les prix",
    awardedModal: {
      close: "Fermer les details du prix",
      eyebrow: "Prix debloque",
      label: "Details du prix de consolation",
      title: "Prix de consolation gagne"
    },
    back: "Retour aux récompenses",
    copied: "Copié",
    copy: "Copier",
    copyAriaLabel: "Copier le code promo {{promoCode}}",
    descriptionTitle: "Description du prix",
    empty: "Aucune récompense pour le moment. Vos codes promo apparaîtront ici.",
    error: "Impossible de charger vos récompenses. Veuillez réessayer.",
    eyebrow: "Prix",
    infoAriaLabel: "Ouvrir les détails du prix pour {{prize}}",
    loading: "Chargement des récompenses...",
    modalLabel: "Vos récompenses",
    noDescription: "La description du prix n’est pas encore disponible.",
    noPromoCode: "Aucun code promo",
    open: "Ouvrir vos prix",
    outcomes: {
      jackpot: "Jackpot",
      semiJackpot: "Combo jackpot"
    },
    title: "Vos récompenses"
  },
  lottery: {
    accept: "Valider",
    availability: {
      fallback: "Le coffre-fort est temporairement indisponible. Nous annoncerons le prochain sur la chaîne.",
      preparingNewSafe: "Un nouveau coffre-fort est en préparation. Attendez notre annonce sur la chaîne."
    },
    checkCode: "Vérifier le code",
    checkingCode: "Vérification du code {{code}}",
    chooseCodeDigits: "Choisissez les trois chiffres du code",
    chooseDigit: "Choisir {{digit}} pour la position {{position}}",
    chooseDigitPosition: "Choisir le chiffre {{position}}",
    clearPosition: "Effacer la position {{position}}",
    codeLocked: "Le code est verrouillé",
    digitPosition: "Chiffre {{position}}",
    duplicateCodeModal: {
      cancel: "Non",
      confirm: "Oui",
      label: "Confirmer la nouvelle saisie du code",
      message: "Vous avez déjà saisi ce code. Voulez-vous le saisir à nouveau ?",
      title: "Code déjà utilisé"
    },
    enterCode: "Saisissez les trois chiffres du code",
    enteredCodesModal: {
      close: "Fermer les codes saisis",
      label: "Codes saisis précédemment",
      title: "Codes saisis"
    },
    enteredCodesTrigger: "Codes : {{count}}",
    errors: {
      checkCombination: "Impossible de vérifier la combinaison. Veuillez réessayer."
    },
    loadingScene: "Chargement de la scène",
    openCodePicker: "Ouvrir le sélecteur de code",
    pickerDialog: "Choisir les trois chiffres du code",
    prizeModal: {
      close: "Fermer les détails du prix",
      eyebrow: "Prix débloqué",
      fields: {
        description: "Description",
        name: "Prix",
        promoCode: "Code promo"
      },
      label: "Détails du prix du combo jackpot",
      noDetails: "Les détails du prix seront bientôt disponibles."
    },
    results: {
      gameFinished: "Tous les coffres ont été ouverts aujourd’hui.",
      jackpot: "Jackpot gagné.",
      jackpotAlreadyWon: "Le jackpot a déjà été gagné. Votre tentative n’a pas été dépensée.",
      jackpotWithPrize: "Jackpot gagné. Prix : {{prizeDetails}}",
      duplicateSemiJackpotLose: "Jackpot non gagné. Le combo jackpot est toujours actif.",
      lose: "Pas de chance cette fois.",
      noAttempts: "Vous n’avez plus de tentatives. Ouvrez le portefeuille pour en obtenir davantage.",
      noRules: "Le coffre n’est pas disponible aujourd’hui.",
      semiJackpot: "Combo jackpot gagné.",
      semiJackpotAlreadyWon: "Le combo jackpot a déjà été gagné. Votre tentative n’a pas été dépensée.",
      semiJackpotWithPrize: "Combo jackpot gagné. Prix : {{prizeDetails}}",
      userJackpotAlreadyWon:
        "Vous avez déjà gagné le jackpot aujourd’hui. Votre tentative n’a pas été dépensée."
    },
    safeAlt: "Coffre-fort",
    safeDoorAlt: "Porte du coffre-fort",
    safeResult: {
      jackpot: "Jackpot"
    },
    safeWheelAlt: "Roue du coffre-fort",
    sceneLabel: "Scène de loterie",
    slotUnavailable: "Choisir le chiffre {{position}}, le code est indisponible",
    soundOff: "Couper le son",
    soundOn: "Activer le son",
    widgetLabel: "Widget de loterie"
  },
  subscription: {
    errors: {
      checkMembership: "Impossible de vérifier l'abonnement. Veuillez réessayer."
    },
    noChannelUrl: "Le lien de la chaîne n'est pas configuré. Veuillez réessayer plus tard."
  },
  telegram: {
    open: "Ouvrir dans Telegram"
  }
} as const;
