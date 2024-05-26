import CryptoJS, { AES } from "react-native-crypto-js";

export const encryptData = (data: string, secretKey: string): string => {
  const encryptedData = AES.encrypt(data, secretKey).toString();
  return encryptedData;
};

export const decryptData = (encryptedData: string, secretKey: string): string => {
  const decryptedData = AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

export function generateRandomPassword(length: number = 50) {
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~\`\\!@#$%^&*()_+=-[]{}|;:,.<>?`;
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}
