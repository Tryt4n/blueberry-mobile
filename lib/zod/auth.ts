import { z } from "zod";

// Error Messages
const required_email_error = "Email jest wymagany.";
const invalid_email_error = "Email jest nieprawidłowy.";

const required_username_error = "Nazwa użytkownika jest wymagana.";
const invalid_username_too_short_error = "Nazwa użytkownika musi zawierać przynajmniej 3 znaki.";
const invalid_username_too_long_error =
  "Nazwa użytkownika może składać się z maksymalnie 50 znaków.";
const invalid_username_special_chars_error =
  "Nazwa użytkownika nie może zawierać znaków specjalnych.";
const invalid_username_space_dash_error =
  "Nazwa użytkownika może zawierać tylko jedną spację i jeden znak -, które nie mogą występować na początku, na końcu ani bezpośrednio po sobie.";
const invalid_username_incorrect_use_of_dash_character_error = `Nieprawidłowa nazwa użytkownika. Zastosowanie znaku "-" jest nieprawidłowe.`;

const required_password_error = "Hasło jest wymagane.";
const invalid_password_too_short_error = "Hasło musi składać się przynajmniej z 8 znaków.";
const invalid_password_too_long_error = "Hasło może składać się z maksymalnie 50 znaków.";

const invalid_password_confirmation_error = "Hasła nie są identyczne.";

// Schemas
export const SignUpSchema = z
  .object({
    email: z.string().min(1, required_email_error).email(invalid_email_error),
    username: z
      .string()
      .min(1, required_username_error)
      .min(3, invalid_username_too_short_error)
      .max(50, invalid_username_too_long_error)
      .refine(
        (username) => /^[a-zA-Z0-9\u00C0-\u017F\s-]+$/g.test(username),
        invalid_username_special_chars_error
      )
      .refine(
        (username) => /^(?!.*-{2,})[^-]*-?[^-]*$/.test(username) && !/[-]\s|\s[-]/.test(username),
        invalid_username_space_dash_error
      )
      .refine(
        (username) =>
          !/-/.test(username) ||
          /([a-zA-Z\u00C0-\u017F]{3,}-[a-zA-Z\u00C0-\u017F]{3,})/.test(username),
        invalid_username_incorrect_use_of_dash_character_error
      ),
    password: z
      .string()
      .min(1, required_password_error)
      .min(8, invalid_password_too_short_error)
      .max(50, invalid_password_too_long_error),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: invalid_password_confirmation_error,
    path: ["passwordConfirmation"],
  });

export const SignInSchema = z.object({
  email: z.string().min(1, required_email_error).email(invalid_email_error),
  password: z.string().min(1, required_password_error),
});
