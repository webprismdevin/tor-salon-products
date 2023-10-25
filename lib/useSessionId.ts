import { useEffect, useState } from "react";

export default function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check if sessionStorage already has a unique identifier
    const existingSessionId = sessionStorage.getItem("t_id");
    if (existingSessionId) {
      // If it does, set the state variable
      setSessionId(existingSessionId);
      return;
    }

    // Generate a unique identifier
    const sessionId = crypto.randomUUID();
    // Store the unique identifier in sessionStorage
    sessionStorage.setItem("t_id", sessionId);
    // Set the state variable
    setSessionId(sessionId);
  }, []);

  return [sessionId as string];
}
