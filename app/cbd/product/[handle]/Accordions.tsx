"use client";

import { Disclosure } from "@headlessui/react";

export type AccordionProps = {
  data: [
    {
      _key: string;
      title: string;
      content: string;
    }
  ];
};

export const Accordions = ({ data }: AccordionProps) => {
  if (!data) return <></>;

  return (
    <div className="w-full">
      {data.map((item) => (
        <div
          key={item._key}
          className="w-full text-left py-2 border-t-[1px] border-primary"
        >
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 w-full flex justify-between">
                  {item.title}
                  <div
                    className={`${
                      open ? "transform rotate-180" : ""
                    } inline-block transition-transform duration-200`}
                  >
                    <NavArrowDown />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="pb-2">
                  <p>{item.content}</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  );
};

export const NavArrowDown = () => {
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
};
