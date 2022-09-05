import React from "react";
import BigTextBlock from "./BigTextBlock";
import FeaturedInformation from "./FeaturedInformation";
import ReviewSlider from "../ReviewSlider";


export function Modules({ modules }: any) {
  return (
    <React.Fragment>
      {modules.map((module: any) => {
        switch (module._type) {
          case "featuredInformation":
            return <FeaturedInformation key={module._key} module={module} />;
          case "bigTextBlock":
            return <BigTextBlock key={module._key} module={module} />;
          case "module.reviewSlider":
            return <ReviewSlider key={module._key} reviews={module.reviews} />;
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
}
