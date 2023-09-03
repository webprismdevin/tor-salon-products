import Slide from "./Slide";
import SlideWrapper from "./SlideWrapper";

export default function Slides({ data }: any) {
  return (
    <div>
      <SlideWrapper data={data}>
        {data.slides.map((slide: any) => (
          <Slide key={slide._key} slide={slide} />
        ))}
      </SlideWrapper>
    </div>
  );
}
