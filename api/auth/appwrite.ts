import { account, appwriteConfig, avatars, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { SignInSchema, SignUpSchema } from "@/lib/zod/auth";
import type { User } from "@/types/user";
import type { ErrorKeys } from "@/types/Errors";

export async function signIn(email: string, password: string) {
  let customErrors: Pick<Record<ErrorKeys, string[]>, "email" | "password"> = {
    email: [],
    password: [],
  };

  try {
    const results = SignInSchema.safeParse({ email, password });

    if (!results.success) {
      results.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof customErrors;
        if (field in customErrors) {
          customErrors[field].push(issue.message);
        }
      });

      return { session: null, errors: customErrors };
    } else {
      const session = await account.createEmailSession(email, password);

      return { session, errors: { email: null, password: null } };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createUser(
  email: string,
  password: string,
  username: string,
  passwordConfirmation: string
) {
  let customErrors: Record<ErrorKeys, string[]> = {
    email: [],
    username: [],
    password: [],
    passwordConfirmation: [],
    alert: [],
  };

  try {
    const results = SignUpSchema.safeParse({ email, password, username, passwordConfirmation });

    if (!results.success) {
      results.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof customErrors;
        if (field in customErrors) {
          customErrors[field].push(issue.message);
        }
      });

      return { user: null, errors: customErrors };
    } else {
      const isUsernameUnique = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("username", username)]
      );
      if (isUsernameUnique.documents.length > 0) {
        return {
          user: null,
          errors: { ...customErrors, alert: ["Użytkownik z taką nazwą już istnieje."] },
        };
      }

      const isEmailUnique = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("email", email)]
      );
      if (isEmailUnique.documents.length > 0) {
        return {
          user: null,
          errors: {
            ...customErrors,
            alert: ["Użytkownik z takim samym adresem email już istnieje."],
          },
        };
      }

      const newAccount = await account.create(ID.unique(), email, password, username);

      if (!newAccount) throw Error("Failed to create account");

      const avatarUrl = avatars.getInitials(username);

      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { accountId: newAccount.$id, email, username, avatar: avatarUrl }
      );

      await signIn(email, password);

      return {
        user: newUser as User,
        errors: {
          email: null,
          username: null,
          password: null,
          passwordConfirmation: null,
          alert: null,
        },
      };
    }
  } catch (error) {
    return {
      user: null,
      errors: {
        ...customErrors,
        alert: ["Użytkownik z takim samym emailem już istnieje"],
      },
    };
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("Failed to get current account");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("Failed to get current user");

    return currentUser.documents[0] as User;
  } catch (error: any) {
    if (error.message !== "User (role: guests) missing scope (account)") {
      console.error(error);
    }
  }
}
