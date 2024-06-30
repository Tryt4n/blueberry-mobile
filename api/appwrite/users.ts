import { account, appwriteConfig, databases } from "@/lib/appwrite";
import { EmailSchema, PasswordSchema, UsernameSchema } from "@/lib/zod/auth";
import { Query } from "react-native-appwrite";
import type { User } from "@/types/user";

export async function getListOfUsers() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );

    return users.documents as User[];
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editUserEmail(userId: User["$id"], email: User["email"], password: string) {
  let errors: string[] = [];

  try {
    const results = EmailSchema.safeParse(email);
    if (!results.success) {
      results.error.issues.forEach((issue) => {
        errors = [...errors, issue.message];
      });

      return errors;
    } else {
      const isEmailUnique = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("email", email.toLowerCase())]
      );
      if (isEmailUnique.documents.length > 0) {
        errors = ["Użytkownik z takim samym adresem email już istnieje."];

        return errors;
      } else {
        // Has to be first because of the password confirmation
        await account.updateEmail(email, password);

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          userId,
          {
            email,
          }
        );
      }
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editUserUsername(userId: User["$id"], username: User["username"]) {
  let errors: string[] = [];

  try {
    const results = UsernameSchema.safeParse(username);
    if (!results.success) {
      results.error.issues.forEach((issue) => {
        errors = [...errors, issue.message];
      });

      return errors;
    } else {
      const isUsernameUnique = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("username", username)]
      );
      if (isUsernameUnique.documents.length > 0) {
        errors = ["Użytkownik z taką nazwą już istnieje."];

        return errors;
      } else {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          userId,
          {
            username,
          }
        );

        await account.updateName(username);
      }
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editUserPassword(newPassword: string, oldPassword: string) {
  let errors: string[] = [];

  try {
    const results = PasswordSchema.safeParse(newPassword);
    if (!results.success) {
      results.error.issues.forEach((issue) => {
        errors = [...errors, issue.message];
      });

      return errors;
    } else {
      await account.updatePassword(newPassword, oldPassword);
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editUserAvatar(userId: User["$id"], avatar: string, customAvatarId?: string) {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        avatar,
        customAvatar: customAvatarId ? customAvatarId : null,
      }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editUserTheme(userId: User["$id"], theme: User["theme"]) {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        theme,
      }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function editUserViewPreferences(userId: User["$id"], isSimplifiedView: boolean) {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        simplifiedView: isSimplifiedView,
      }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}
