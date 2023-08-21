import Link from "next/link";
import Cart from "./Cart/Cart";
import MobileMenu from "./Menu/MobileMenu";
import MenuDesktop from "./MenuDesktop";

export type MenuProps = any;

export type HeaderProps = {
  menu: MenuProps;
};

export default function Header({ menu }: HeaderProps) {
  return (
    <div className="grid grid-cols-3 w-full p-4 shadow-md items-center sticky top-0 z-50 bg-white">
      <div className="col-span-1">
        <MenuDesktop menu={menu} />
        <MobileMenu menu={menu} />
      </div>
      <Link
        href="/"
        className="col-span-1 flex justify-center items-center font-heading text-2xl"
      >
        TOR
      </Link>
      <div className="col-span-1 flex justify-end items-center gap-4">
        <a
          href="https://account.torsalonproducts.com"
          target="_blank"
          className="hover:opacity-40 transition-opacity transitition-duration-200"
        >
          <IconUser />
        </a>
        <Cart />
      </div>
    </div>
  );
}

export function IconUser() {
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
        d="M5 20v-1a7 7 0 017-7v0a7 7 0 017 7v1M12 12a4 4 0 100-8 4 4 0 000 8z"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
