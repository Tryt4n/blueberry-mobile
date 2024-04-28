import { z } from "zod";

const invalid_quantity_min_value = "Minimalna ilość zamówienia to 0,25kg.";
const invalid_quantity_value = "Ilość zamówienia musi być wielokrotnością 0,25.";

const invalid_additionalInfo_max_length = "Maksymalna długość dodatkowej informacji to 250 znaków.";

export const OrderSchema = z.object({
  userId: z.string().min(1),
  buyerId: z.string().min(1),
  additionalInfo: z.string().max(250, invalid_additionalInfo_max_length).optional(),
  quantity: z
    .number()
    .min(0.25, invalid_quantity_min_value)
    .refine((quantity) => quantity % 0.25 === 0, invalid_quantity_value),
});
