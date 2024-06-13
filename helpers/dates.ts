import { format } from "date-fns/format";
import { pl } from "date-fns/locale/pl";

export function formatDate(date: string | number | Date, formatStr?: string) {
  return format(date, formatStr ? formatStr : "dd.MM.yyyy", { locale: pl });
}
