import type { User } from "./user";
import type { Buyer } from "./buyers";
import type { CurrentPrice } from "./currentPrice";

export type Order = {
  readonly $collectionId: string;
  readonly $createdAt: string;
  readonly $databaseId: string;
  readonly $id: string;
  readonly $permissions: string[];
  readonly $updatedAt: string;
  readonly quantity: number;
  readonly additionalInfo: string | null;
  readonly completed: boolean;
  readonly user: User;
  readonly buyer: Buyer;
  readonly currentPrice: CurrentPrice;
};
