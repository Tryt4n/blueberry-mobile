import type { Buyer } from "@/types/buyers";
import type { User } from "@/types/user";

export function getBuyerName(buyer: Buyer, user: User) {
  return buyer.createdBy.accountId !== user.accountId
    ? `${buyer.buyerName} (dodany przez: ${buyer.createdBy.username})`
    : buyer.buyerName;
}
