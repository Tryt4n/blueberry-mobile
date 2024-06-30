import OrderContextProvider from "@/context/OrdersContext";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <OrderContextProvider>{children}</OrderContextProvider>;
}
