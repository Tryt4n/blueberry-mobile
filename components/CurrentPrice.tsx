import { View, Text, Alert, ActivityIndicator } from "react-native";
import { useCallback, useEffect } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useModalContext } from "@/hooks/useModalContext";
import { useOrdersContext } from "@/hooks/useOrdersContext";
import { useAppwrite } from "@/hooks/useAppwrite";
import { updatePrice as appwriteUpdatePrice, getCurrentPrice } from "@/api/appwrite/currentPrice";
import CustomButton from "./CustomButton";

export default function CurrentPrice() {
  const { user } = useGlobalContext();
  const { showModal, setModalData, inputValue, setInputValue } = useModalContext();
  const { currentPrice, setCurrentPrice } = useOrdersContext();

  const {
    data: fetchedCurrentPrice,
    isLoading: isPriceLoading,
    refetchData: refetchPrice,
  } = useAppwrite(getCurrentPrice, [], {
    title: "Błąd",
    message: "Nie udało się pobrać aktualnej ceny.",
  });

  function openModal() {
    if (!currentPrice) return;

    setInputValue(currentPrice.price.toString() || "");

    setModalData({
      title: "Wprowadź nową cenę",
      btn2: {
        text: "Anuluj",
        type: "cancel",
      },
      btn1: {
        text: "Zapisz",
        type: "confirm",
        color: "primary",
      },
      input: {
        maxLength: 4,
        keyboardType: "number-pad",
      },
    });
    showModal();
  }

  const updatePrice = useCallback(async () => {
    if (!currentPrice) return;
    if (inputValue === "") {
      return Alert.alert("Błąd", "Wprowadź poprawną cenę.");
    }
    if (inputValue === currentPrice.price?.toString()) {
      return;
    }

    try {
      const errors = await appwriteUpdatePrice(inputValue, currentPrice.$id);
      if (errors) {
        return Alert.alert("Nieprawidłowa wartość", errors.join("\n"));
      }

      refetchPrice();
    } catch (error: any) {
      Alert.alert("Błąd", "Nie udało się zaktualizować ceny.");
    }
  }, [inputValue, currentPrice]);

  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn1: {
        ...prevModalData.btn1,
        onPress: updatePrice,
      },
    }));
  }, [inputValue]);

  useEffect(() => {
    if (!fetchedCurrentPrice) return;

    setCurrentPrice(fetchedCurrentPrice);
  }, [fetchedCurrentPrice]);

  return (
    <View className="flex-row items-center gap-4 mb-4">
      <Text className="font-poppinsRegular text-base w-fit">
        Cena:&nbsp;
        {isPriceLoading ? (
          <View className="">
            <ActivityIndicator
              size="small"
              color="rgb(59 130 246)"
            />
          </View>
        ) : (
          <Text className="font-poppinsMedium text-xl">{currentPrice?.price} zł</Text>
        )}
      </Text>

      {(user?.role === "admin" || user?.role === "moderator") && (
        <CustomButton
          text="Zmień cenę"
          textStyles="text-xs p-3"
          onPress={openModal}
          disabled={isPriceLoading}
        />
      )}
    </View>
  );
}
