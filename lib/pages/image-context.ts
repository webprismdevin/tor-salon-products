import { createContext } from "react";

export const ImageContext = createContext<any>({
  image: {},
  setImage: () => null,
});