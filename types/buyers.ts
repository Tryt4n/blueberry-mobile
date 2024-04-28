import type { Order } from "./orders";

export type Buyer = {
  readonly $collectionId: string;
  readonly $createdAt: string;
  readonly $databaseId: string;
  readonly $id: string;
  readonly $permissions: string[];
  readonly $updatedAt: string;
  readonly buyerName: string;
  readonly orders: Order[];
};
