import { z } from "zod";

const invalid_value = "Wprowadzona cena musi być liczbą.";
const invalid_price_min_value = "Minimalna cena to 5 zł.";
const invalid_price_value = "Cena zamówienia musi być wielokrotnością liczby 0,5.";

export const CurrentPriceSchema = z.object({
  price: z
    .number({ invalid_type_error: invalid_value })
    .min(5, invalid_price_min_value)
    .refine((price) => price % 0.5 === 0, invalid_price_value),
});
