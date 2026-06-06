export function triggerSoftHapticFeedback() {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("soft");
}

export function triggerRigidHapticFeedback() {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("rigid");
}

export function triggerErrorHapticFeedback() {
  const hapticFeedback = window.Telegram?.WebApp?.HapticFeedback;

  if (!hapticFeedback) {
    navigator.vibrate?.([40, 30, 40]);
    return;
  }

  hapticFeedback.impactOccurred?.("heavy");
  window.setTimeout(() => {
    hapticFeedback.notificationOccurred?.("error");
  }, 60);
}
