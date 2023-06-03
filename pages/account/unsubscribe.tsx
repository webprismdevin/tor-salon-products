export default function Unsubscribe() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-4xl font-bold text-center">Unsubscribed</h1>
      <p className="text-center">
        You have been unsubscribed from our mailing list.
      </p>
      <p className="text-center">
        <a href="/" className="underline">Return to home page</a>
      </p>
    </div>
  );
}
