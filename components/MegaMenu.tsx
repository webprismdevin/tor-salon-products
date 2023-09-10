"use client";

import { AnimatePresence, useCycle, motion } from "framer-motion";
import Link from "next/link";
import { MenuProps } from "./Header";
import { ChevronDown } from "./MenuDesktop";

type CollectionLink = {
  _id: string;
  _type: string;
  store: {
    title: string;
    slug: {
      current: string;
    };
  };
};

type MegaMenuItem = {
  _key: string;
  _type: string;
  title: string;
  collectionLinks?: CollectionLink[];
  url?: string;
};

export default function MegaMenu({ menu, children }: MenuProps) {
  const [open, cycleOpen] = useCycle(false, true);
  const { mega_menu } = menu;

  return (
    <>
      <div className="flex items-center" onMouseEnter={() => cycleOpen()}>
        <span>Shop</span>
        <ChevronDown />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -100, zIndex: -1 }}
            animate={{ opacity: 1, y: 0, zIndex: 1 }}
            exit={{ opacity: 0, y: -100, zIndex: -1 }}
            className="absolute top-16 left-0 p-8 w-full bg-white shadow-md"
            onMouseLeave={() => cycleOpen()}
          >
            <div className="flex flex-row items-start gap-8">
              {mega_menu.map((item: MegaMenuItem) => {
                if (item._type == "collectionGroup")
                  return (
                    <div key={item._key} className="flex flex-col gap-4">
                      <div className="font-bold">{item.title}</div>
                      {item.collectionLinks!.map((link: CollectionLink) => (
                        <Link
                          key={link._id}
                          href={`/${link._type}/${link.store.slug.current}`}
                        >
                          {link.store.title}
                        </Link>
                      ))}
                    </div>
                  );
              })}
              <div className="flex flex-col gap-4">
                <div className="font-bold">More</div>
                <div className="flex flex-col gap-4">
                  {mega_menu.map((item: MegaMenuItem) => {
                    if (item._type !== "collectionGroup")
                      return (
                        <Link href={item.url!} key={item._key}>
                          {item.title}
                        </Link>
                      );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
