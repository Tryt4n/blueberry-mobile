import { account, appwriteConfig, avatars, databases } from "@/lib/appwrite";
import { parsedEnv } from "@/lib/zod/env";
import { ID, Query } from "react-native-appwrite";
import { Platform } from "react-native";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { decryptData, encryptData, generateRandomPassword } from "@/helpers/encryption";
import type {
  GoogleSignin as GoogleSigninType,
  User as GoogleUser,
} from "@react-native-google-signin/google-signin";
import type { CredentialResponse } from "@react-oauth/google";

// Use GoogleSignInButton only on native platforms
let GoogleSignin: typeof GoogleSigninType;
if (Platform.OS !== "web") {
  ({ GoogleSignin } = require("@react-native-google-signin/google-signin"));
}

export function configureGoogleSignInNative() {
  if (GoogleSignin) {
    GoogleSignin.configure({
      //@ts-expect-error - missing type for androidClientId
      androidClientId: parsedEnv.EXPO_PUBLIC_ANDROID_CLIENT_ID, //! For mobile
      // androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID!, //! For netlify deploy
    });
  }
}

export async function signInWithGoogleNative() {
  if (GoogleSignin) {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const user = await createGoogleUserInAppwrite(userInfo.user);
      const decryptedPassword = decryptData(
        user.secretPassword,
        parsedEnv.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY //! For mobile
        // process.env.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY! //! For netlify deploy
      );
      await account.createEmailSession(user.email, decryptedPassword);

      return userInfo;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

type JwtUser = JwtPayload & {
  email: string;
  email_verified: string;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
};

export async function signInWithGoogleWeb(credentialResponse: CredentialResponse) {
  if (credentialResponse.credential) {
    try {
      const decodedUser: JwtUser = jwtDecode(credentialResponse.credential);
      const userInfo = {
        id: decodedUser.sub!,
        email: decodedUser.email,
        familyName: decodedUser.family_name,
        givenName: decodedUser.given_name,
        name: decodedUser.name,
        photo: decodedUser.picture,
      };

      const user = await createGoogleUserInAppwrite(userInfo);
      const decryptedPassword = decryptData(
        user.secretPassword,
        parsedEnv.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY //! For mobile
        // process.env.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY! //! For netlify deploy
      );
      await account.createEmailSession(user.email, decryptedPassword);

      return userInfo;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export function signOutWithGoogle() {
  if (GoogleSignin) {
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  }
}

async function createGoogleUserInAppwrite(user: GoogleUser["user"]) {
  try {
    const isUserAlreadyCreated = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", user.email)]
    );

    if (isUserAlreadyCreated.documents.length > 0) return isUserAlreadyCreated.documents[0];

    const avatarUrl = user.photo ? avatars.getImage(user.photo) : avatars.getInitials(user.name!);

    const password = generateRandomPassword();
    const encryptedPassword = encryptData(password, parsedEnv.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY); //! For mobile
    // const encryptedPassword = encryptData(password, process.env.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY!); //! For netlify deploy
    await account.create(user.id, user.email, password, user.name!);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.id,
        email: user.email,
        username: user.name,
        avatar: avatarUrl,
        secretPassword: encryptedPassword,
      }
    );

    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
}
