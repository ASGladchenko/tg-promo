const FULL_TURN_DEGREES = 360;
const MIN_STEP_PERCENT = 0.06;
const MAX_STEP_PERCENT = 0.2;

type WheelSpinListener = (rotationDegrees: number) => void;

const listeners = new Set<WheelSpinListener>();
let currentRotationDegrees = 0;

function randomStepPercent() {
  return MIN_STEP_PERCENT + Math.random() * (MAX_STEP_PERCENT - MIN_STEP_PERCENT);
}

function randomDirection() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function spinWheelOnCodeInput() {
  const delta = FULL_TURN_DEGREES * randomStepPercent() * randomDirection();
  currentRotationDegrees += delta;

  listeners.forEach((listener) => {
    listener(currentRotationDegrees);
  });
}

export function subscribeWheelSpin(listener: WheelSpinListener) {
  listeners.add(listener);
  listener(currentRotationDegrees);

  return () => {
    listeners.delete(listener);
  };
}
