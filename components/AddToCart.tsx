import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import addToCart from "../lib/Cart/addToCart";
import CartContext from "../lib/CartContext";

const AddToCart = ({variant}: { variant: string}) => {

    const { cart, setCart } = useContext(CartContext)
    
    async function handleAddToCart() {
        const response = await addToCart(cart.id, variant)
    
        setCart({
          ...cart,
          status: "dirty",
          lines: response.cartLinesAdd.cart.lines,
        });
      }
    
    return <Button onClick={handleAddToCart} alignSelf={"flex-start"}>Add To Cart</Button>
}

export default AddToCart