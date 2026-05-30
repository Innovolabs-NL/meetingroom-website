export type SignupErrorCode = "EMAIL_ALREADY_REGISTERED" | "UNKNOWN";

export function parseSignupError(error: { message?: string; code?: string }): SignupErrorCode {
  const message = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already exists") ||
    message.includes("email address is already")
  ) {
    return "EMAIL_ALREADY_REGISTERED";
  }

  return "UNKNOWN";
}
