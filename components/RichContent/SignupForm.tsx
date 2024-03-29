"use client";
import { Button } from "components/Button";
import { usePlausible } from "next-plausible";
import { FormEvent, useState } from "react";

export default function SignupForm({ children }: { children: any }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "IDLE" | "LOADING" | "ERROR" | "SUCCESS"
  >("IDLE");
  const plausible = usePlausible();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("LOADING");

    const response = await fetch("/api/addsubscriber", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

    // Handle response if necessary
    const data = await response.json();

    if (data.data.customerCreate?.userErrors?.length === 0) {
      plausible("Subscribe", { props: { method: "blog" } });
      setStatus("SUCCESS");
      setEmail("");
      setTimeout(() => {
        setStatus("IDLE");
      }, 1200);
    }

    if (data.data.customerCreate?.userErrors?.length > 0) {
      setStatus("ERROR");
      setEmail("Hmmm... something went wrong. Try another email address.");
      setTimeout(() => {
        setEmail("");
        setStatus("IDLE");
      }, 3000);
    }

    // ...
  }

  return (
    <div className="text-black px-6 py-6 mb-4 grid relative bg-black/10">
      <form onSubmit={onSubmit}>
        <>{children}</>
        <div className="flex">
          <input
            placeholder={"Enter your email address"}
            className="w-full py-2 px-3 border-b-2 border-black mt-2 bg-transparent focus:bg-white"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            className={`${
              status === "LOADING" && "animate-pulse bg-black text-white"
            } border-b-2 border-black hover:bg-black hover:text-white min-w-[140px] grid place-items-center`}
            variant="inline"
          >
            <div>{status === "SUCCESS" ? "Success!" : "Submit"}</div>
          </Button>
        </div>
      </form>
    </div>
  );
}
