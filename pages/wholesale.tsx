import {
  Button,
  Container,
  Divider,
  GridItem,
  Heading,
  SimpleGrid,
  Select,
  Stack,
  Text,
  Image,
  Link,
  Box,
  chakra,
  useNumberInput,
  HStack,
  Input,
  AspectRatio,
  CloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Icon,
  Tag,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState, createContext } from "react";
import AuthContext from "../lib/auth-context";
import Loader from "../components/Loader";
import { gql, GraphQLClient } from "graphql-request";
import { groq } from "next-sanity";
import formatter from "../lib/formatter";
import { sanity } from "../lib/sanity";
import loadCart from "../lib/Cart/loadCart";
import createCart from "../lib/Cart/createCart";
import removeCartItem from "../lib/Cart/removeCartItem";
import addToCart from "../lib/Cart/addToCart";
import applyDiscountToCart from "../lib/Cart/applyDiscountToCart";
import updateCartItemQty from "../lib/Cart/updateCartItemQty";
import { FaInfoCircle, FaShippingFast } from "react-icons/fa";
import Head from "next/head";

const WholesaleCartContext = createContext<any>({
  cart: [],
  setCart: () => null,
});

export default function Wholesale({ products, page }: any) {
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState<any>();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function getCart() {
    let localCartData = await JSON.parse(
      window.localStorage.getItem(
        `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart:wholesale`
      ) as any
    );

    if (localCartData) {
      const existingCart = await loadCart(localCartData.id);

      if (existingCart.cart !== null) {
        setCart({
          id: localCartData.id,
          checkoutUrl: localCartData.checkoutUrl,
          status: "clean",
          estimatedCost: existingCart.cart.estimatedCost,
          lines: existingCart.cart.lines.edges,
          discount: existingCart.cart.discountCodes,
        });

        return;
      }
    }

    localCartData = await createCart();

    console.log(localCartData);

    setCart({
      id: localCartData.cartCreate.cart.id,
      checkoutUrl: localCartData.cartCreate.cart.checkoutUrl,
      estimatedCost: null,
      lines: [],
    });

    window.localStorage.setItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart:wholesale`,
      JSON.stringify(localCartData.cartCreate.cart)
    );
  }

  async function handleAddToCart(variantId: string) {
    const response = await addToCart(cart.id, variantId, 1);

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });
  }

  async function handleSubmit(
    shipping: any,
    billing: any,
    same: boolean,
    note: string
  ) {
    setSubmitting(true);

    const response = await fetch("/api/create-wholesale-order", {
      method: "POST",
      body: JSON.stringify({
        lineItems: cart.lines,
        customerId: user.id,
        email: user.email,
        billingAddress: billing,
        shippingAddress: same ? billing : shipping,
        note,
      }),
    }).then((res) => res.json());

    console.log(response.response)

    if (response) {
      setSubmitting(false);
      if (response.response.draftOrderCreate.userErrors.length === 0) {
        //clean up cart
        window.localStorage.removeItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart:wholesale`
        );
        setCart({
          status: "dirty",
        });
        toast({
          title: "Order submitted successfully!",
          description:
            "You will recieve a confirmation and invoice once the order has been reviewed.",
          duration: null,
          isClosable: true,
          status: "success",
        });
      }
      if (response.response.draftOrderCreate.userErrors.length > 0) {
        toast({
          title: "Order submission failed",
          description:
            "Something went wrong when submitting your order. Send us a message via the chat in the bottom right corner for assistance.",
          duration: null,
          isClosable: true,
          status: "error",
        });
      }
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (cart && cart.status === "dirty") getCart();
  }, [cart]);

  if (!user)
    return (
      <Container py={20} centerContent>
        <Loader />
      </Container>
    );

  if (user && !user.isPro)
    return (
      <Container py={20} centerContent>
        <Text>You do not have access to this page.</Text>
        <Text>
          If you believe this is a mistake, please send us a message via our
          chat.
        </Text>
      </Container>
    );

  return (
    <Stack py={20} px={8} bgColor={"gray.200"}>
      <Head>
        <title>Order Wholesale</title>
      </Head>
      <WholesaleCartContext.Provider value={{ cart, setCart }}>
        <Heading size={"2xl"} px={2} as="h1">
          Wholesale
        </Heading>
        <Stack py={6} px={2}>
          <Heading>Pricing Guides</Heading>
          <Link
            target="_blank"
            href={`${page.retailGuideUrl}?dl=tor-msrp-retail-pricing-guide.pdf`}
          >
            Download: Retail Pricing Guide
          </Link>
          <Link
            target="_blank"
            href={`${page.wholesaleGuideUrl}?dl=tor-wholesale-pricing-guide.pdf`}
          >
            Download: Wholesale Pricing Guide
          </Link>
        </Stack>
        <Stack direction={["column", "row"]} align="flex-start" gap={8}>
          <Products products={products} handleAddToCart={handleAddToCart} />
          {cart && (
            <WholesaleCart
              cart={cart}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </Stack>
      </WholesaleCartContext.Provider>
    </Stack>
  );
}

function WholesaleCart({ cart, handleSubmit, submitting }: any) {
  const [billingInfo, updateBilling] = useState({
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "United States",
  });
  const [shippingInfo, updateShipping] = useState({
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "United States",
  });
  const [sameAsBilling, setSame] = useState(false);
  const [note, setNote] = useState("");

  function validateOrder() {
    if (sameAsBilling) {
      if (
        billingInfo.address1 &&
        billingInfo.city &&
        billingInfo.province &&
        billingInfo.zip
      )
        return true;
      else return false;
    }
    if (!sameAsBilling) {
      if (
        billingInfo.address1 &&
        billingInfo.city &&
        billingInfo.province &&
        billingInfo.zip &&
        shippingInfo.address1 &&
        shippingInfo.city &&
        shippingInfo.province &&
        shippingInfo.zip
      )
        return true;
      else return false;
    }
  }

  return (
    <Stack
      spacing={4}
      flexGrow={1}
      p={8}
      ml={16}
      bgColor="white"
      borderRadius={5}
    >
      <Heading>Your Order</Heading>
      <Divider />
      <Stack spacing={2}>
        {cart &&
          cart.lines &&
          cart.lines.length > 0 &&
          cart.lines.map((line: any) => (
            <CartLineItem key={line.node.id} product={line} />
          ))}
      </Stack>
      {cart.lines && cart.lines.length > 0 && <Divider />}
      <Stack>
        <Stack direction="row" align={"center"}>
          <Icon as={FaInfoCircle} />
          <Text>
            Shipping &amp; tax (or tax-exemption) will be added to your invoice.
          </Text>
        </Stack>
        <Stack direction="row" align={"center"}>
          <Icon as={FaShippingFast} />
          <Text>Orders over 250+ ship for free!</Text>
        </Stack>
        <Stack direction="row" justify={"space-between"}>
          <Text fontSize="4xl" fontWeight={600}>
            Total:
          </Text>
          <Text fontSize="4xl" fontWeight={600}>
            {cart.estimatedCost ? formatter.format(cart.estimatedCost.totalAmount.amount / 2) : "$0.00"}
          </Text>
        </Stack>
      </Stack>
      <CustomerDetails
        billingInfo={billingInfo}
        updateBilling={updateBilling}
        shippingInfo={shippingInfo}
        updateShipping={updateShipping}
        sameAsBilling={sameAsBilling}
        setSame={setSame}
        validation={validateOrder()}
      />
      <Textarea
        placeholder="Add an additional note?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
      />
      <Button
        onClick={() =>
          handleSubmit(shippingInfo, billingInfo, sameAsBilling, note)
        }
        disabled={!validateOrder()}
        isLoading={submitting}
      >
        Submit Order
      </Button>
    </Stack>
  );
}

function CustomerDetails({
  billingInfo,
  updateBilling,
  shippingInfo,
  updateShipping,
  sameAsBilling,
  setSame,
  validation,
}: any) {
  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem>
        <h2>
          <AccordionButton px={2}>
            <Box flex="1" textAlign="left">
              Customer Details
              {!validation && (
                <Tag ml={2} colorScheme={"orange"}>
                  Additional Details Needed
                </Tag>
              )}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} px={2}>
          <Text mb={4} fontSize="sm">
            Please complete your order details.
          </Text>
          <Stack w="full">
            <Text>Billing Address</Text>
            <Input
              placeholder="Company"
              value={billingInfo.company}
              onChange={(e) =>
                updateBilling({ ...billingInfo, company: e.target.value })
              }
            />
            <Input
              placeholder="Street"
              value={billingInfo.address1}
              onChange={(e) =>
                updateBilling({ ...billingInfo, address1: e.target.value })
              }
            />
            <Input
              placeholder="Street line 2"
              value={billingInfo.address2}
              onChange={(e) =>
                updateBilling({ ...billingInfo, address2: e.target.value })
              }
            />
            <SimpleGrid gap={2} templateColumns={"repeat(2, 1fr)"}>
              <GridItem colSpan={[2, 1]}>
                <Input
                  placeholder="City"
                  value={billingInfo.city}
                  onChange={(e) =>
                    updateBilling({ ...billingInfo, city: e.target.value })
                  }
                />
              </GridItem>
              <GridItem colSpan={[2, 1]}>
                <Input
                  placeholder="State"
                  value={billingInfo.province}
                  onChange={(e) =>
                    updateBilling({ ...billingInfo, province: e.target.value })
                  }
                />
              </GridItem>
              <GridItem colSpan={[2, 1]}>
                <Input
                  placeholder="Zip"
                  value={billingInfo.zip}
                  onChange={(e) =>
                    updateBilling({ ...billingInfo, zip: e.target.value })
                  }
                />
              </GridItem>
              <GridItem colSpan={[2, 1]}>
                <Input
                  placeholder="Country"
                  value={billingInfo.country}
                  onChange={(e) =>
                    updateBilling({ ...billingInfo, country: e.target.value })
                  }
                />
              </GridItem>
            </SimpleGrid>
          </Stack>
          <Stack w="full" mt={4}>
            <Text>Shipping Address</Text>
            <Checkbox onChange={(e) => setSame(e.target.checked)}>
              Same as billing
            </Checkbox>
            {!sameAsBilling && (
              <>
                <Input
                  placeholder="Company"
                  value={shippingInfo.company}
                  onChange={(e) =>
                    updateBilling({ ...shippingInfo, company: e.target.value })
                  }
                />
                <Input
                  placeholder="Street"
                  value={shippingInfo.street1}
                  onChange={(e) =>
                    updateShipping({ ...shippingInfo, street1: e.target.value })
                  }
                />
                <Input
                  placeholder="Street line 2"
                  value={shippingInfo.address2}
                  onChange={(e) =>
                    updateShipping({
                      ...shippingInfo,
                      address2: e.target.value,
                    })
                  }
                />
                <SimpleGrid gap={2} templateColumns={"repeat(2, 1fr)"}>
                  <GridItem colSpan={[2, 1]}>
                    <Input
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        updateShipping({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <Input
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        updateShipping({
                          ...shippingInfo,
                          state: e.target.value,
                        })
                      }
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <Input
                      placeholder="Zip"
                      value={shippingInfo.zip}
                      onChange={(e) =>
                        updateShipping({ ...shippingInfo, zip: e.target.value })
                      }
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <Input
                      placeholder="Country"
                      value={shippingInfo.country}
                      onChange={(e) =>
                        updateShipping({
                          ...shippingInfo,
                          country: e.target.value,
                        })
                      }
                    />
                  </GridItem>
                </SimpleGrid>
              </>
            )}
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function Products({ products, handleAddToCart }: any) {
  return (
    <Stack spacing={4} minW="50%" flexShrink={0}>
      {products?.map((product: any) => (
        <Product
          product={product}
          key={product.node.id}
          handleAddToCart={handleAddToCart}
        />
      ))}
    </Stack>
  );
}

function Product({ product, handleAddToCart }: any) {
  const variants = product.node.variants.edges;
  const [activeVariant, setVariant] = useState(variants[0].node.id);

  function findPrice() {
    const price = variants.filter((v: any) => {
      return v.node.id === activeVariant;
    });
    return price[0].node.priceV2.amount;
  }

  return (
    <Stack direction="row" shadow="md" p={8} w="full" bgColor={"white"}>
      <AspectRatio ratio={1 / 1} boxSize={120} flexShrink={0}>
        <Image
          src={product.node.images.edges[0].node.url}
          alt={product.node.title}
        />
      </AspectRatio>
      <Stack spacing={4} w="full">
        <Stack direction="row" justify={"space-between"}>
          <Text fontSize="2xl">{product.node.title}</Text>
          <WholesalePrice price={findPrice()} />
        </Stack>
        <Variants
          variants={product.node.variants.edges}
          handleAddToCart={() => handleAddToCart(activeVariant)}
          setVariant={setVariant}
        />
      </Stack>
    </Stack>
  );
}

function WholesalePrice({ price }: any) {
  return (
    <>
      <Stack direction="row">
        <chakra.span
          fontSize="2xl"
          fontWeight={600}
          color={"gray.300"}
          textDecor="line-through"
        >
          {formatter.format(price)}
        </chakra.span>
        <chakra.span fontSize="2xl" fontWeight={300}>
          {formatter.format(price / 2)}
        </chakra.span>
      </Stack>
    </>
  );
}

function Variants({ variants, handleAddToCart, setVariant }: any) {
  return (
    <Stack w="full">
      {variants.length === 1 && (
        <Button alignSelf="flex-end" onClick={handleAddToCart}>
          Add To Cart
        </Button>
      )}
      {variants.length > 1 && (
        <Stack direction="row" justify="space-between">
          <Select maxW={240} onChange={(e) => setVariant(e.target.value)}>
            {variants.map((v: any) => (
              <option key={v.node.id} value={v.node.id}>
                {v.node.title}
              </option>
            ))}
          </Select>
          <Button flexShrink={1} onClick={handleAddToCart}>
            Add To Cart
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

function CartLineItem({ product }: { product: any }) {
  const { cart, setCart } = useContext(WholesaleCartContext);

  async function handleRemoveItem() {
    const response = await removeCartItem(cart.id, product.node.id);

    setCart({
      ...cart,
      status: "dirty",
    });
  }

  return (
    <Stack direction="row" w="full" justify={"space-between"} pb={[4, 2]}>
      <AspectRatio
        ratio={1 / 1}
        flexGrow={0}
        minW={["100px", "120px"]}
        maxW={["100px", "120px"]}
      >
        <Image
          borderRadius={6}
          src={product.node.merchandise.image?.url}
          alt={product.node.merchandise.product.title}
        />
      </AspectRatio>
      <Stack spacing={6} flexGrow={1}>
        <Stack direction="row">
          <Box flexGrow={1}>
            <Text fontSize={[16, 18]} fontWeight="bold">
              {product.node.merchandise.product.title}
            </Text>
            {product.node.merchandise.title !== "Default Title" && (
              <Text mt={1} fontSize={[14, 16]}>
                {product.node.merchandise.title}
              </Text>
            )}
          </Box>
          <CloseButton
            cursor={"pointer"}
            userSelect="none"
            onClick={handleRemoveItem}
          />
        </Stack>
        <Stack direction="row" justify={"space-between"}>
          <ItemQty product={product} />
          <Text fontSize={[16, 18]}>
            {formatter.format(
              product.node.estimatedCost.totalAmount.amount / 2
            )}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
function ItemQty({ product }: { product: any }) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      min: 0,
      defaultValue: product.node.quantity,
    });
  const { cart, setCart } = useContext(WholesaleCartContext);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({ readOnly: false });

  async function handleQtyUpdate(newQty: string) {
    const resp = await updateCartItemQty(
      cart.id,
      product.node.id,
      parseInt(newQty)
    );

    console.log(resp.cartLinesUpdate);

    setCart({
      ...cart,
      status: "clean",
      estimatedCost: resp.cartLinesUpdate.cart.estimatedCost,
      lines: resp.cartLinesUpdate.cart.lines.edges,
    });
  }

  return (
    <HStack>
      <Button size="sm" fontSize="md" {...dec} variant="ghost">
        -
      </Button>
      <Input
        size="sm"
        borderRadius={5}
        textAlign="center"
        w={[10]}
        {...input}
        onBlur={(e) => handleQtyUpdate(e.target.value)}
      />
      <Button size="sm" fontSize="md" {...inc} variant="ghost">
        +
      </Button>
    </HStack>
  );
}

export async function getStaticProps() {
  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

  // Shopify Request
  const query = gql`
    {
      products(
        first: 200
        query: "tag_not:Bundle AND tag_not:gift_card AND tag_not:soap AND tag_not:lip_balm AND NOT product_type:Candles"
        sortKey: PRODUCT_TYPE
      ) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            variants(first: 3) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                  }
                }
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                }
              }
            }
            priceRange {
              maxVariantPrice {
                amount
              }
              minVariantPrice {
                amount
              }
            }
            compareAtPriceRange {
              maxVariantPrice {
                amount
              }
            }
          }
        }
      }
    }
  `;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  const wholesaleQuery = groq`*[_type == "wholesale"]
    {...,
      "retailGuideUrl": retailGuide.asset->url,
      "wholesaleGuideUrl": wholesaleGuide.asset->url,
    }[0]`;

  const page = await sanity.fetch(wholesaleQuery, {});

  return {
    props: {
      products: res.products.edges,
      page,
    },
    revalidate: 60,
  };
}
