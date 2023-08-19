import MenuDesktop from "./MenuDesktop";

export type MenuProps = any;

export type HeaderProps = {
  menu: MenuProps;
};

export default function Header({ menu }: HeaderProps) {
  return (
    <div className="grid grid-cols-3 w-full p-4 shadow-md items-center">
      <div className="col-span-1">
        <MenuDesktop menu={menu} />
      </div>
      <div className="col-span-1 flex justify-center items-center font-heading text-2xl">TOR</div>
      <div className="col-span-1 flex justify-end items-center gap-4">
        <div>Account</div>
        <div>Cart</div>
      </div>
    </div>
  );
}
