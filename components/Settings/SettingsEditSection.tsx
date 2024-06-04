import { View } from "react-native";
import React, { useCallback, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useModalContext } from "@/hooks/useModalContext";
import tw from "@/lib/twrnc";
import { editUserEmail, editUserUsername, editUserPassword } from "@/api/appwrite/users";
import SettingsEditSectionWrapper from "./SettingsEditSectionWrapper";
import SettingsSection from "./SettingsSection";
import { FormField } from "../FormField";
import Toast from "react-native-toast-message";
import type { EditSettingsOptions } from "@/types/editSettingsOptions";

type SettingsEditSectionProps = {
  type: EditSettingsOptions;
  inputVisible: EditSettingsOptions | false;
  setInputVisible: (value: EditSettingsOptions | false) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
};

export default function SettingsEditSection({
  type,
  inputVisible,
  setInputVisible,
  isSubmitting,
  setIsSubmitting,
}: SettingsEditSectionProps) {
  const { user, refetchUser } = useGlobalContext();
  const { theme } = useThemeContext();
  const { ordersData } = useOrdersContext();
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
      formLabel = "Email:";
      formPlaceholder = "Wprowadź nowy email";
      errorTheSameValue = "Email nie został zmieniony";
      editError = "Nie udało się zaktualizować email.";
      break;

    case "username":
      formLabel = "Nazwa użytkownika:";
      formPlaceholder = "Wprowadź nową nazwę";
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

    // If type is not "username" then check if the password confirmation input value is empty, if so then show an error
    if (
      type !== "username" &&
      (!passwordConfirmationInputValue || passwordConfirmationInputValue === "")
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirmation: ["Pole wymagane"],
      }));
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the appropriate function based on the type
      const editErrors =
        type === "email" // If type is "email" then call editUserEmail function
          ? await editUserEmail(user.$id, modalInputValue, passwordConfirmationInputValue)
          : type === "username" // If type is "username" then call editUserUsername function
          ? await editUserUsername(user.$id, modalInputValue)
          : // Otherwise the type has to be "password" so call editUserPassword function
            await editUserPassword(modalInputValue, passwordConfirmationInputValue);

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
        // Refetch the orders data only if the type is "username" because the username is used in the orders data
        type === "username" && ordersData?.refetchData();
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
    ordersData,
  ]);

  function openUserDataEdit() {
    setInputVisible(type);
    // If the type is not "password" then set the modal input value to the user data based on the type
    type !== "password" && setModalInputValue(user![type]);
  }

  function resetStates() {
    setInputVisible(false);
    setModalInputValue("");
    setModalInput2Value("");
    setPasswordConfirmationInputValue("");
    setErrors(initialErrorsState);
  }

  return (
    <View style={tw`flex-row items-center justify-between gap-4`}>
      {
        // If the inputVisible state is the same as the type then show the edit section for appropriate type
        inputVisible === type ? (
          <SettingsEditSectionWrapper
            btnsProps={{
              actionBtnProps: {
                disabled: isSubmitting,
                loading: inputVisible === type && isSubmitting,
                onPress: editUserData,
              },
              cancelBtnProps: {
                onPress: resetStates,
              },
            }}
          >
            <FormField
              title={formLabel}
              placeholder={formPlaceholder}
              titleStyles="font-poppinsSemiBold text-sm"
              value={modalInputValue}
              handleChangeText={(e) => setModalInputValue(e)}
              errors={errors[type]}
            />

            {
              // Show the second input field only if the type is "password"
              type === "password" && (
                <FormField
                  title="Potwierdź nowe hasło:"
                  placeholder="Potwierdź nowe hasło"
                  titleStyles="font-poppinsSemiBold text-sm"
                  secureTextEntry={true}
                  value={modalInput2Value}
                  handleChangeText={(e) => setModalInput2Value(e)}
                />
              )
            }

            {
              // Hide the password confirmation input field if the type is "username" or if the user has a secret password
              !(
                type === "username" ||
                // @ts-ignore - secretPassword is not in the User type but it's in the user object
                (type === "email" && user.secretPassword && user.secretPassword !== "")
              ) && (
                <FormField
                  title="Potwierdź zmianę hasłem:"
                  placeholder={type === "password" ? "Wprowadź aktualne hasło" : "Wprowadź hasło"}
                  titleStyles="font-poppinsSemiBold text-sm"
                  secureTextEntry={true}
                  value={passwordConfirmationInputValue}
                  handleChangeText={(e) => setPasswordConfirmationInputValue(e)}
                  errors={errors.passwordConfirmation}
                />
              )
            }
          </SettingsEditSectionWrapper>
        ) : (
          // else show the settings section with the user data based on the type
          <SettingsSection
            label={formLabel}
            value={type !== "password" ? user![type] : undefined}
            btnProps={{ onPress: openUserDataEdit }}
          />
        )
      }
    </View>
  );
}
