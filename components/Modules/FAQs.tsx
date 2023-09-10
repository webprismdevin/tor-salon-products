"use client";
import { useState } from "react";

export default function FAQs({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-2 mx-auto max-w-prose p-4 md:p-8 lg:p-12">
      <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-center pb-4">
        {data.title}
      </h2>
      {data.faqs.map((faq: any) => (
        <Accordion faq={faq} key={faq._id} />
      ))}
    </div>
  );
}
const Accordion = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col pt-2 border-2 rounded py-2 px-4">
      <div
        className="flex flex-row gap-2 cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-heading text-xl">{faq.question}</h3>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div
        className={`overflow-hidden transition-all ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="font-body text-base pt-2">{faq.answer}</p>
      </div>
    </div>
  );
};
