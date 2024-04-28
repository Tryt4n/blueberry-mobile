import type { User } from "./user";
import type { Buyer } from "./buyers";

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
};
