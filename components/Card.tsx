import Link from "next/link";
import Image from "next/image";

const Card = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: {
    title: string;
    imageUrl: string;
    path: string;
  };
}) => {
  const { title, imageUrl, path } = content;

  return (
    <div className="min-w-[140px] md:w-[260px] grid gap-3">
      <Link href={path}>
        <Image src={imageUrl} width={320} height={320} alt={title} />
        <h3 className="text-center text-lg line-clamp-2 h-14">{title}</h3>
      </Link>
      {children}
    </div>
  );
};

export default Card;
