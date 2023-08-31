import { Dispatch, SetStateAction } from "react";

export function Pagination({
  length,
  index,
  setPage,
}: {
  length: number;
  index: number;
  setPage: Dispatch<SetStateAction<[number, number]>>;
}) {
  if(length < 2) return null;

  return (
    <div className="flex w-full justify-center gap-4 mt-4 absolute bottom-6 z-10">
      {Array.from({ length }, (_, i) => (
        <div key={i} onClick={() => setPage([i, 0])}>
          <div
            className={`cursor-pointer w-3 h-3 ${i === index ? "bg-black" : "bg-gray-300"}`}
            style={{ borderRadius: "50%" }}
          />
        </div>
      ))}
    </div>
  );
}
