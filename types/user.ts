import type { Buyer } from "./buyers";
import type { Theme } from "./theme";

export type User = {
  readonly $collectionId: string;
  readonly $createdAt: string;
  readonly $databaseId: string;
  readonly $id: string;
  readonly $permissions: string[];
  readonly $updatedAt: string;
  readonly accountId: string;
  readonly avatar: string;
  readonly customAvatar?: string;
  readonly email: string;
  readonly username: string;
  readonly role: UserRole;
  readonly buyers: Buyer[];
  readonly theme?: Theme;
  readonly simplifiedView: boolean;
};

type UserRole = "user" | "admin" | "seller" | "moderator";
