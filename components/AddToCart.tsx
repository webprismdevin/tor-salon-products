import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import CartContext from "../lib/CartContext";

const AddToCart = ({variant}: { variant: string}) => {

    const { cart, setCart } = useContext(CartContext)
    
    async function addToCart() {
        const response = await fetch("/api/addtocart", {
          method: "POST",
          body: JSON.stringify({
            variantId: variant,
            cartId: cart.id,
          }),
        }).then((res) => res.json());
    
        setCart({
          ...cart,
          status: "dirty",
          lines: response.response.cartLinesAdd.cart.lines,
        });
      }
    
    return <Button onClick={addToCart} alignSelf={"flex-start"}>Add To Cart</Button>
}

export default AddToCart