export default async function getLocalCart(){
  const localCartData = window.localStorage.getItem(`${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`)

  if(localCartData){
      const { id , checkoutUrl}  = JSON.parse(localCartData);

      return { id, checkoutUrl }
  }

  return null
}