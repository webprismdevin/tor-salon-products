"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useFbq from "lib/useFbq";
import useSessionId from "lib/useSessionId";
import getEventId from "lib/getEventId";

export default function SendPageView({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [fbp, fbc] = useFbq();
  const [sessionID] = useSessionId();

  useEffect(() => {
    if (sessionID === null) return;

    const eventID = getEventId("PageView", sessionID);

    if (fbp === null) {
      fetch(
        `/api/event/PageView?location=${window.location.href}&event_id=${eventID}`
      );
      window.fbq("track", "PageView", {}, { eventID: eventID });
      return;
    }

    fetch(
      `/api/event/PageView?location=${
        window.location.href
      }&event_id=${eventID}${fbp ? `&fbp=${fbp}` : ""}${
        fbc !== null ? `&fbc=${fbc}` : ""
      }`
    );
    window.fbq("track", "PageView", {}, { eventID: eventID });
    
  }, [pathname, sessionID, fbp]);

  return <>{children}</>;
}
