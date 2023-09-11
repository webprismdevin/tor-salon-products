import Link from "next/link";

export const Button = ({
  as,
  className = "",
  variant = "primary",
  width = "auto",
  ...props
}: {
  as?: "button";
  className?: string;
  variant?: "primary" | "secondary" | "inline";
  width?: "auto" | "full";
  [key: string]: any;
}) => {
  const baseButtonClasses =
    "py-3 px-5 text-lg md:py-3 md:px-5 font-heading md:text-xl uppercase cursor-pointer";

  const variants = {
    primary: `${baseButtonClasses} bg-primary text-contrast`,
    secondary: `${baseButtonClasses} border border-primary/10 bg-contrast text-primary`,
    inline: "leading-none",
  };

  const widths = {
    auto: "w-auto",
    full: "w-full",
  };

  const styles = `${variants[variant]} ${widths[width]} ${className}`;

  if (!props.href) {
    return (
      <button className={styles} {...props}>
        {props.children}
      </button>
    );
  }

  return (
    <Link href={props.href} className={styles} {...props}>
      {props.children}
    </Link>
  );
};
