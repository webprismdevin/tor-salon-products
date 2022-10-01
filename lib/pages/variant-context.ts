import { createContext } from "react";

export const VariantContext = createContext<any>({
  variant: "",
  updateVariant: () => null,
});
