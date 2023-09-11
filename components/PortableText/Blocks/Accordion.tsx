"use client";
import { Disclosure } from "@headlessui/react";
import { NavArrowDown } from "app/cbd/product/[handle]/Accordions";
import RichContent from "components/RichContent";
import PortableText from "../PortableText";

type Props = {
  node: any;
};

export default function AccordionBlock({ node }: Props) {
  return (
    <>
      {node?.groups?.map((group: any) => (
        <div key={group._key} className="w-full text-left py-2 border-t-[1px] border-primary">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 w-full flex justify-between">
                  <h2 className={`text-left ${open && "font-bold"}`}>{group.title}</h2>
                  <div
                    className={`${
                      open ? "transform rotate-180" : ""
                    } inline-block transition-transform duration-200`}
                  >
                    <NavArrowDown />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="pb-2">
                  <RichContent blocks={group.body} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </>
  );
}
