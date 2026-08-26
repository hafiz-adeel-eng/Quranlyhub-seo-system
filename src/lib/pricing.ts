// Price to unlock one profile's contact details. Adjust freely — this is the
// entire monetization surface of the site (browsing and profile creation stay free).
export const CONTACT_UNLOCK_PRICE_PKR = 300;

// Payment number shown on the manual checkout instructions until a real
// payment gateway (JazzCash/Easypaisa merchant API or Stripe) is wired up.
export const MANUAL_PAYMENT_NUMBER = process.env.MANUAL_PAYMENT_NUMBER ?? "03xx-xxxxxxx";
export const MANUAL_PAYMENT_NAME = process.env.MANUAL_PAYMENT_NAME ?? "Rishta Pakistan";
