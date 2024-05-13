import { View, Text, Alert, ActivityIndicator, TextInput } from "react-native";
import { useCallback, useEffect, useState, type ComponentProps } from "react";
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

  const [modalInputValue, setModalInputValue] = useState(currentPrice?.price.toString() || "");

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
    if (!currentPrice) return;
    if (modalInputValue === "") {
      return Alert.alert("Błąd", "Wprowadź poprawną cenę.");
    }
    if (modalInputValue === currentPrice.price?.toString()) {
      return;
    }

    try {
      const updatedPrice = await appwriteUpdatePrice(modalInputValue, currentPrice.$id);
      if (updatedPrice.errors) {
        setModalInputValue(currentPrice.price.toString());
        return Alert.alert("Nieprawidłowa wartość", updatedPrice.errors.join("\n"));
      }

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

  useEffect(() => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      btn2: {
        ...prevModalData.btn2,
        onPress: updatePrice,
      },
    }));
  }, [modalInputValue]);

  useEffect(() => {
    if (!fetchedCurrentPrice) return;

    setCurrentPrice(fetchedCurrentPrice);
    setModalInputValue(fetchedCurrentPrice.price.toString());
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
          disabled={currentPrice === null || isPriceLoading}
        />
      )}
    </View>
  );
}
