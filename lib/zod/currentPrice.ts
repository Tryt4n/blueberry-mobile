import { z } from "zod";

const invalid_value = "Wprowadzona cena musi być liczbą.";
const invalid_price_min_value = "Cena musi być większa niż 0 zł.";
const invalid_price_value = "Cena zamówienia musi być wielokrotnością liczby 0,5.";

export const CurrentPriceSchema = z.object({
  price: z
    .number({ invalid_type_error: invalid_value })
    .min(0, invalid_price_min_value)
    .refine((price) => price % 0.5 === 0, invalid_price_value),
});
