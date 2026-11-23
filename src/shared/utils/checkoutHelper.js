const CHECKOUT_ATTEMPT_KEY = "checkoutAttempt";
export const CHECKOUT_ATTEMPT_TTL = 30 * 60 * 1000;

let expiryTimer;

const createKey = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}${Math.random()
    .toString(36)
    .slice(2)}`;
};

const scheduleExpiry = (attempt) => {
  window.clearTimeout(expiryTimer);

  const remaining = CHECKOUT_ATTEMPT_TTL - (Date.now() - attempt.createdAt);
  if (remaining <= 0) {
    clearCheckoutAttempt();
    return;
  }

  expiryTimer = window.setTimeout(clearCheckoutAttempt, remaining);
};

export function createCheckoutAttempt() {
  const attempt = {
    key: createKey(),
    createdAt: Date.now(),
  };

  sessionStorage.setItem(CHECKOUT_ATTEMPT_KEY, JSON.stringify(attempt));
  scheduleExpiry(attempt);
  return attempt;
}

export function getCheckoutAttempt() {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_ATTEMPT_KEY);
    if (!raw) return createCheckoutAttempt();

    const attempt = JSON.parse(raw);
    if (
      !attempt?.key ||
      !Number.isFinite(attempt.createdAt) ||
      Date.now() - attempt.createdAt >= CHECKOUT_ATTEMPT_TTL
    ) {
      return createCheckoutAttempt();
    }

    scheduleExpiry(attempt);
    return attempt;
  } catch {
    return createCheckoutAttempt();
  }
}

export function clearCheckoutAttempt() {
  window.clearTimeout(expiryTimer);
  sessionStorage.removeItem(CHECKOUT_ATTEMPT_KEY);
}

export function isCheckoutReplay(response) {
  return (
    response?.httpStatus === 200 ||
    response?.status === 200 ||
    response?.existing === true ||
    response?.replayed === true
  );
}

export function getCheckoutConflict(error) {
  if (error?.response?.status !== 409) return null;
  return "CHECKOUT_CONFLICT";
}