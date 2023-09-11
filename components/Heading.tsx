import { createElement } from "react";

const headingSize = {
  h1: "text-4xl md:text-5xl lg:text-6xl",
  h2: "text-3xl md:text-4xl lg:text-5xl",
  h3: "text-2xl md:text-3xl lg:text-4xl",
};

export function Heading({
  children,
  as,
  className,
  size,
}: {
  children: React.ReactNode;
  as: "h1" | "h2" | "h3";
  className?: string;
  size?: "h1" | "h2" | "h3";
}) {

  

  return createElement(
    as,
    { className: `${headingSize[size ? size : as]} font-heading ${className}` },
    children
  );
}
