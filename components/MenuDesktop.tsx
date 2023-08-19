import { Header } from "next/dist/lib/load-custom-routes";
import { MenuProps } from "./Header";

declare type MenuLinkProps = {
  _key: string;
  title: string;
  slug: {
    current: string;
  };
};

export default function MenuDesktop({ menu }: MenuProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex items-center">
        <span>Shop</span>
        <ChevronDown />
      </div>
      {menu.links.map((link: MenuLinkProps) => (
        <div key={link._key}>{link.title}</div>
      ))}
    </div>
  );
}

export function ChevronDown() {
  return (
    <svg
      width="24px"
      height="24px"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color="#000000"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
