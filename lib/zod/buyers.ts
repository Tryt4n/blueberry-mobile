import { z } from "zod";

const required_buyerName_error = "Nazwa kupującego jest wymagana.";
const invalid_buyerName_too_short_error = "Nazwa kupującego musi zawierać przynajmniej 3 znaki.";
const invalid_buyerName_too_long_error =
  "Nazwa kupującego może składać się z maksymalnie 50 znaków.";
const invalid_buyerName_special_chars_error =
  "Nazwa kupującego nie może zawierać znaków specjalnych.";
const invalid_buyerName_space_dash_error =
  "Nazwa kupującego może zawierać tylko jedną spację i jeden znak -, które nie mogą występować na początku, na końcu ani bezpośrednio po sobie.";
const invalid_buyerName_incorrect_use_of_dash_character_error = `Nieprawidłowa nazwa kupującego. Zastosowanie znaku "-" jest nieprawidłowe.`;

export const BuyersSchema = z.object({
  buyerName: z
    .string()
    .min(1, required_buyerName_error)
    .min(3, invalid_buyerName_too_short_error)
    .max(50, invalid_buyerName_too_long_error)
    .refine(
      (username) => /^[a-zA-Z0-9\u00C0-\u017F\s-]+$/g.test(username),
      invalid_buyerName_special_chars_error
    )
    .refine(
      (username) => /^(?!.*-{2,})[^-]*-?[^-]*$/.test(username) && !/[-]\s|\s[-]/.test(username),
      invalid_buyerName_space_dash_error
    )
    .refine(
      (username) =>
        !/-/.test(username) ||
        /([a-zA-Z\u00C0-\u017F]{3,}-[a-zA-Z\u00C0-\u017F]{3,})/.test(username),
      invalid_buyerName_incorrect_use_of_dash_character_error
    ),
});
