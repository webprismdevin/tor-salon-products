import { forwardRef } from "react";
import Link from "next/link";

export const Button = forwardRef(
  (
    {
      as = "button",
      className = "",
      variant = "primary",
      width = "auto",
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: "primary" | "secondary" | "inline";
      width?: "auto" | "full";
      [key: string]: any;
    },
    ref
  ) => {
    const Component = props?.href ? Link : as;

    const baseButtonClasses = "py-3 px-5 font-heading text-xl uppercase cursor-pointer";

    const variants = {
      primary: `${baseButtonClasses} bg-primary text-contrast`,
      secondary: `${baseButtonClasses} border border-primary/10 bg-contrast text-primary`,
      inline: "border-b border-primary/10 leading-none pb-1",
    };

    const widths = {
      auto: "w-auto",
      full: "w-full",
    };

    const styles = `${variants[variant]} ${widths[width]} ${className}`;

    return (
      <Component
        // @todo: not supported until react-router makes it into Remix.
        // preventScrollReset={true}
        className={styles}
        {...props}
        ref={ref}
      />
    );
  }
);
