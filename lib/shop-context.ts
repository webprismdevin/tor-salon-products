import { createContext } from "react";

const ShopContext = createContext<any>({
    shop: {
        name: '',
        short_name: ''
    }
})

export default ShopContext