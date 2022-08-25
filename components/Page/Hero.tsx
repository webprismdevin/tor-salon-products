import {
  AspectRatio,
  Box,
  Button,
  Heading,
  Select,
  Stack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useContext, useEffect } from "react";
import addToCart from "../../lib/Cart/addToCart";
import CartContext from "../../lib/CartContext";
import { VariantContext } from "../../pages/pages/[slug]";

export function HeroWithProduct({ hero }: any) {
  const product = hero.content[0].product.store;

  return (
    <div>
      <Box p={20}>
        <Stack direction={["column", "row"]} spacing={40} align="flex-start">
          <AspectRatio flexShrink={0} ratio={2 / 3} width={400} height={600} pos={"sticky"} top={42}>
            <Image
              src={product.previewImageUrl}
              layout="fill"
              alt={product.title}
            />
          </AspectRatio>
          <Stack spacing={8}>
            <Heading size="2xl">{hero.title}</Heading>
            <Box
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
            {product.variants.length > 1 && (
              <VariantSelect variants={product.variants} />
            )}
            <AddToCart />
          </Stack>
        </Stack>
      </Box>
    </div>
  );
}

export function VariantSelect({ variants }: any) {
  const { variant, updateVariant } = useContext(VariantContext);

  useEffect(() => {
    if (variant === "") {
      updateVariant(variants[0].store.gid);
    }
  }, []);

  return (
    <Select onChange={(e) => updateVariant(e.target.value)} value={variant}>
      {variants.map((variant: any) => (
        <option key={variant._id} value={variant.store.gid}>
          {variant.store.title}
        </option>
      ))}
    </Select>
  );
}

export function AddToCart() {
  const { variant } = useContext(VariantContext);
  const { cart, setCart } = useContext(CartContext);

  async function handleAddToCart() {
    const response = await addToCart(cart.id, variant, 1, "");

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });
  }

  return <Button size="lg" onClick={handleAddToCart}>Add To Cart</Button>;
}
