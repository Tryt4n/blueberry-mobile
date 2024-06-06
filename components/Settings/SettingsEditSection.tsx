import { View } from "react-native";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useEditUser } from "@/hooks/SettingsHooks/useEditUser";
import tw from "@/lib/twrnc";
import SettingsEditSectionWrapper from "./SettingsEditSectionWrapper";
import SettingsSection from "./SettingsSection";
import { FormField } from "../FormField";
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
  const { user } = useGlobalContext();

  const {
    editUserData,
    errors,
    modalInput2Value,
    modalInputValue,
    passwordConfirmationInputValue,
    setModalInput2Value,
    setModalInputValue,
    setPasswordConfirmationInputValue,
    resetStates,
  } = useEditUser(type, setIsSubmitting, inputVisible, setInputVisible);

  // Set form label and placeholder based on the type
  let formLabel: string;
  let formPlaceholder: string;
  switch (type) {
    case "email":
      formLabel = "Email:";
      formPlaceholder = "Wprowadź nowy email";
      break;

    case "username":
      formLabel = "Nazwa użytkownika:";
      formPlaceholder = "Wprowadź nową nazwę";
      break;

    case "password":
      formLabel = inputVisible === type ? "Nowe hasło:" : "Hasło:";
      formPlaceholder = "Wprowadź nowe hasło";
      break;
  }

  function openUserDataEdit() {
    setInputVisible(type);
    // If the type is not "password" then set the modal input value to the user data based on the type
    type !== "password" && setModalInputValue(user![type]);
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
              secureTextEntry={type === "password"}
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
