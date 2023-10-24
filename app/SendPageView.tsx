"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SendPageView({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    fetch(`/api/event/PageView?location=${pathname}`);
  }, []);

  useEffect(() => {
    fetch(`/api/event/PageView?location=${pathname}`);
  }, [pathname]);

  return <>{children}</>;
}
