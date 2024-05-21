import { View, Text, Alert, ActivityIndicator } from "react-native";
import { useCallback, useEffect, useState } from "react";
import tw from "@/lib/twrnc";
import { colors } from "@/helpers/colors";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { updatePrice as appwriteUpdatePrice, getCurrentPrice } from "@/api/appwrite/currentPrice";
import Toast from "react-native-toast-message";
import CustomButton from "./CustomButton";

export default function CurrentPrice() {
  const { user } = useGlobalContext();
  const { showModal, setModalData } = useModalContext();
  const { currentPrice, setCurrentPrice } = useOrdersContext();

  // Create local state for modal input value
  const [modalInputValue, setModalInputValue] = useState(currentPrice?.price.toString() || "");

  const userHasAccess = user?.role === "admin" || user?.role === "moderator";

  // Fetch current price
  const {
    data: fetchedCurrentPrice,
    isLoading: isPriceLoading,
    refetchData: refetchPrice,
  } = useAppwrite(getCurrentPrice, [], {
    title: "Błąd",
    message: "Nie udało się pobrać aktualnej ceny.",
  });

  const openModal = useCallback(() => {
    if (!currentPrice) return;

    setModalData({
      title: "Wprowadź nową cenę",
      btn1: {
        text: "Anuluj",
      },
      btn2: {
        text: "Zapisz",
        color: "primary",
      },
      input: {
        maxLength: 4,
        keyboardType: "number-pad",
        defaultValue: modalInputValue,
        onChangeText: (text) => setModalInputValue(text),
      },
    });
    showModal();
  }, [currentPrice, showModal, setModalData, modalInputValue, setModalInputValue]);

  const updatePrice = useCallback(async () => {
    if (!userHasAccess) return; // If user doesn't have access, return

    if (!currentPrice) return; // If currentPrice is null, return

    if (modalInputValue === "") {
      // If modalInputValue is empty, return alert
      return Alert.alert("Błąd", "Wprowadź poprawną cenę.");
    }
    if (modalInputValue === currentPrice.price?.toString()) {
      // If price doesn't change, do nothing
      return;
    }

    try {
      const updatedPrice = await appwriteUpdatePrice(modalInputValue, currentPrice.$id);

      // If there are errors, show alert and return
      if (updatedPrice.errors) {
        setModalInputValue(currentPrice.price.toString());
        return Alert.alert("Nieprawidłowa wartość", updatedPrice.errors.join("\n"));
      }

      // else show success toast and refetch price
      Toast.show({
        type: "success",
        text1: "Cena została zaktualizowana.",
        text1Style: { textAlign: "left", fontSize: 16 },
      });
      refetchPrice();
    } catch (error: any) {
      Alert.alert("Błąd", "Nie udało się zaktualizować ceny.");
    }
  }, [modalInputValue, currentPrice]);

  // Update the updatePrice function in the modal data when the input value changes
  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: updatePrice,
      },
    }));
  }, [modalInputValue]);

  // Update the current price and set modal input default value when the fetchedCurrentPrice is defined
  useEffect(() => {
    if (!fetchedCurrentPrice) return; // Wait for fetchedCurrentPrice to be defined

    setCurrentPrice(fetchedCurrentPrice);
    setModalInputValue(fetchedCurrentPrice.price.toString());
  }, [fetchedCurrentPrice]);

  return (
    <View style={tw`flex-row items-center gap-x-4`}>
      <Text style={tw`font-poppinsRegular text-base`}>
        Cena:&nbsp;
        {isPriceLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
        ) : (
          <Text style={tw`font-poppinsMedium text-xl`}>{currentPrice?.price} zł</Text>
        )}
      </Text>

      {userHasAccess && (
        <CustomButton
          text="Zmień cenę"
          textStyles="text-xs p-3"
          onPress={openModal}
          disabled={currentPrice === null || isPriceLoading}
        />
      )}
    </View>
  );
}
