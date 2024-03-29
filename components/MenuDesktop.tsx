import Link from "next/link";
import { Suspense } from "react";
import { MenuProps } from "./Header";
import MegaMenu from "./MegaMenu";

declare type MenuLinkProps = {
  _key: string;
  title: string;
  slug: {
    current: string;
  };
  url: string;
};

export default function MenuDesktop({ menu }: MenuProps) {
  return (
    <div className="flex-row items-center gap-4 z-10 hidden md:flex">
      <Suspense fallback={<Shop />}>
        <MegaMenu menu={menu} />
      </Suspense>
      {menu.links.map((link: MenuLinkProps) => (
        <Link key={link._key} href={link.url}>
          {link.title}
        </Link>
      ))}
    </div>
  );
}

function Shop() {
  return (
    <div className="flex items-center">
      <span>Shop Hair</span>
      <ChevronDown />
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
