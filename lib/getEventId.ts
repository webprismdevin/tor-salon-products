export default function getEventId(event: string, sessionId: string) {
  const event_id = `${event}_${sessionId}_${crypto.randomUUID()}`;
  return event_id;
}
