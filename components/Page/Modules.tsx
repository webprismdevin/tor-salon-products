import React from "react";
import BigTextBlock from "./Modules/BigTextBlock";
import FeaturedInformation from "./Modules/FeaturedInformation";
import ReviewSlider from "../ReviewSlider";
import SecondBuyButton from "./Modules/SecondBuyButton";
import HairTypes from "./Modules/HairTypes";
import ReviewSection from "./Modules/ReviewSection";
import EmailSignup from "./Modules/EmailSignup";


export default function Modules({ modules, product }: any) {
  return (
    <React.Fragment>
      {modules.map((module: any) => {
        switch (module._type) {
          case "module.featuredInformation":
            return <FeaturedInformation key={module._key} module={module} />;
          case "module.bigTextBlock":
            return <BigTextBlock key={module._key} module={module} />;
          case "module.reviewSlider":
            return <ReviewSlider key={module._key} reviews={module.reviews} />;
          case "additionalBuyButton":
            return <SecondBuyButton product={product} key={module._key} />
          case "hairTypeSection":
            return <HairTypes key={module._key} />
          case "reviewSection":
            return <ReviewSection key={module._key} />
          case "module.emailSignup" :
            return <EmailSignup key={module._key} {...module} />
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
}
