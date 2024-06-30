import { useCallback, useState } from "react";
import { useGlobalContext } from "../useGlobalContext";
import { useModalContext } from "../useModalContext";
import { useThemeContext } from "../useThemeContext";
import { editUserEmail, editUserPassword, editUserUsername } from "@/api/appwrite/users";
import { decryptData } from "@/helpers/encryption";
import Toast from "react-native-toast-message";
import type { EditSettingsOptions } from "@/types/editSettingsOptions";

export function useEditUser(
  type: EditSettingsOptions,
  setIsSubmitting: (value: boolean) => void,
  inputVisible: EditSettingsOptions | false,
  setInputVisible: (value: EditSettingsOptions | false) => void,
  secretPassword?: string
) {
  const { user, refetchUser } = useGlobalContext();
  const { theme } = useThemeContext();
  const { showModal, setModalData } = useModalContext();

  const [modalInputValue, setModalInputValue] = useState("");
  const [modalInput2Value, setModalInput2Value] = useState(""); // Only for case when password is being changed
  const [passwordConfirmationInputValue, setPasswordConfirmationInputValue] = useState("");

  const initialErrorsState: Record<EditSettingsOptions | "passwordConfirmation", string[] | null> =
    {
      email: null,
      username: null,
      password: null,
      passwordConfirmation: null,
    };
  const [errors, setErrors] = useState<typeof initialErrorsState>(initialErrorsState);

  // Set form label and placeholder based on the type
  let formLabel: string;
  let formPlaceholder: string;
  let errorTheSameValue: string;
  let editError: string;
  switch (type) {
    case "email":
      errorTheSameValue = "Email nie został zmieniony";
      editError = "Nie udało się zaktualizować email.";
      break;

    case "username":
      errorTheSameValue = "Nazwa użytkownika nie została zmieniona";
      editError = "Nie udało się zaktualizować nazwy użytkownika.";
      break;

    case "password":
      formLabel = inputVisible === type ? "Nowe hasło:" : "Hasło:";
      formPlaceholder = "Wprowadź nowe hasło";
      editError = "Nie udało się zaktualizować hasła.";
      break;
  }

  // Function to edit user data
  const editUserData = useCallback(async () => {
    if (!user) return;

    // Reset all errors
    setErrors(initialErrorsState);

    // Check if the input value has been changed, if not then show an error
    if (type !== "password" && modalInputValue === user[type]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [type]: [errorTheSameValue],
      }));
      return;
    }

    // If type is "email" and the password confirmation input value is empty then show an error
    if (type === "email" && (!modalInputValue || modalInputValue === "") && !secretPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: ["Pole wymagane"],
      }));
      return;
    }

    // If type is not "username" and it is not google account then check if the password confirmation input value is empty, if so then show an error
    if (
      type !== "username" &&
      (!passwordConfirmationInputValue || passwordConfirmationInputValue === "") &&
      !secretPassword
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirmation: ["Pole wymagane"],
      }));
      return;
    }

    let password: string = passwordConfirmationInputValue;
    if (secretPassword) {
      const decryptedPassword = decryptData(
        secretPassword,
        process.env.EXPO_PUBLIC_CRYPTO_JS_SECRET_KEY!
      );

      password = decryptedPassword;
    }

    try {
      setIsSubmitting(true);

      // Call the appropriate function based on the type
      const editErrors =
        type === "email" // If type is "email" then call editUserEmail function
          ? await editUserEmail(user.$id, modalInputValue, password)
          : type === "username" // If type is "username" then call editUserUsername function
          ? await editUserUsername(user.$id, modalInputValue)
          : // Otherwise the type has to be "password" so call editUserPassword function
            await editUserPassword(modalInputValue, password);

      // If there are any errors then show them
      if (editErrors) {
        setErrors((prevErrors) => ({ ...prevErrors, [type]: editErrors }));
      }
      // Else show a success message, reset the states and update the user data
      else {
        Toast.show({
          type: theme === "light" ? "success" : "successDark",
          text1: "Dane zostały zmienione.",
          topOffset: 50,
          text1Style: { textAlign: "center" },
        });
        resetStates();
        refetchUser();
      }
    } catch (error) {
      // If there was an error then show a modal with an error message
      setModalData({
        title: editError,
        subtitle:
          "Wystąpił błąd podczas próby aktualizacji danych konta. Sprawdź poprawność wprowadzonego hasła i spróbuj ponownie.",
        btn1: { text: "Ok" },
      });
      showModal();
    } finally {
      setIsSubmitting(false);
    }
  }, [
    user,
    type,
    modalInputValue,
    passwordConfirmationInputValue,
    setIsSubmitting,
    setErrors,
    setModalData,
    showModal,
    resetStates,
    refetchUser,
  ]);

  function resetStates() {
    setInputVisible(false);
    setModalInputValue("");
    setModalInput2Value("");
    setPasswordConfirmationInputValue("");
    setErrors(initialErrorsState);
  }

  return {
    editUserData,
    modalInputValue,
    modalInput2Value,
    setModalInputValue,
    setModalInput2Value,
    passwordConfirmationInputValue,
    setPasswordConfirmationInputValue,
    errors,
    resetStates,
  };
}
