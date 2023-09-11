import { PortableText, PortableTextComponents } from "@portabletext/react";
import AccordionBlock from "components/PortableText/Blocks/Accordion";

export default function RichContent({ blocks }: any) {
  return <PortableText value={blocks} components={richContentComponents} />;
}

export const richContentComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-4 mt-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mb-2 mt-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mb-1 mt-3">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 my-8">{children}</ul>,
    number: ({ children }) => <ol className="ml-5 my-8">{children}</ol>,
    checkmarks: ({ children }) => (
      <ol className="m-auto text-lg">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ listStyleType: "disclosure-closed" }}>{children}</li>
    ),
    checkmarks: ({ children }) => <li>✅ {children}</li>,
  },
  marks: {
    em: ({ children }) => (
      <em className="text-gray-600 font-semibold">{children}</em>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          className="decoration-solid decoration-black"
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noindex nofollow" : ""}
        >
          {children}
        </a>
      );
    },
    // need to rebuild this - use links for now
    // annotationProduct: ({ children }) => (
    //   <span className="text-red-500">{children}</span>
    // ),
  },
  types: {
    blockAccordion: ({ value }) => {
      console.log(value);

      return <AccordionBlock node={value} />;
    },
    blockCallout: (props) => (
      <div className="bg-primary/20 text-black p-4 mb-4 flex justify-start items-start gap-4 relative">
        <div className="animate-pulse">
          <IconLight />
        </div>
        <div>{props.value.text}</div>
      </div>
    ),
    // signupForm: (props: any) => {
    //   return <SignupForm {...props} />;
    // },
  },
};

export const IconLight = () => {
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
        d="M9 18h6M10 21h4M9 15c.001-2-.499-2.5-1.5-3.5-1-1-1.476-2.013-1.5-3.5-.047-3.05 2-5 6-5 4.001 0 6.049 1.95 6 5-.023 1.487-.5 2.5-1.5 3.5-.999 1-1.499 1.5-1.5 3.5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
