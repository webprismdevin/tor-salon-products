import extractGID from "./extract-gid";

export async function getRating(gid: string) {
  const id = extractGID(gid);

  const res = await fetch(
    `https://api.yotpo.com/products/${process.env.NEXT_PUBLIC_YOTPO_APP_KEY}/${id}/bottomline`
  );

  const data = await res.json();

  return data.response?.bottomline.average_score;
}

export function removeCents(dollarAmount: number) {
  if (dollarAmount.toString().endsWith(".00")) {
    return dollarAmount.toString().slice(0, -3); // Remove the last 3 characters (.00)
  }
  if (dollarAmount.toString().endsWith(".0")) {
    return dollarAmount.toString().slice(0, -2); // Remove the last 2 characters (.0)
  }
  return dollarAmount; // Return the original input if it doesn't end with .00
}
