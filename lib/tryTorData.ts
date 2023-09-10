import { FaGripLinesVertical, FaHandsWash, FaCut, FaClock, FaLifeRing, FaShieldAlt, FaFeather, FaWater, FaArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa'

export const hairTypeData = {
    curly: {
      variantId: "gid://shopify/ProductVariant/43618533376246",
      color: "#E4D5D4",
      title: "TOR for Curly Hair",
      description:
        "TOR's Curly Line has been specifically formulated to address the unique needs of curly hair - to balance curls, increase definition, bounce, shine, and moisture, while protecting against breakage and frizz.",
      benefits: [
        {
          icon: FaClock,
          text: "Longer-lasting style",
        },
        {
          icon: FaLifeRing,
          text: "Amazing Frizz Control",
        },
        {
          icon: FaShieldAlt,
          text: "Superior Breakage Protection",
        },
      ],
      photo: "/images/hairtypes/curly-hair-girl.jpg",
      headerImg: "/images/trytor/CurlyMinis.jpg",
      styling: {
        variantId: "gid://shopify/ProductVariant/44022272458998",
        photo: "/images/trytor/styling/CHD150ml.png",
        title: "HD Curl Cream",
        description:
          "TOR HD Curl Cream for Curly Hair is designed to make curls stand out with a soft hold while conditioning and defining both curls and waves. This versatile cream was designed for consumers that have naturally curly or permed hair. It enhances natural texture and provides incredible humidity resistance while making curls touchable and frizz free.",
        price: 27,
      },
    },
    medium: {
      variantId: "gid://shopify/ProductVariant/43618533441782",
      color: "#D7E1DC",
      title: "TOR for Medium & Thick Hair",
      description:
        "TOR's Medium/Thick Line has been specifically formulated to address the unique needs of medium density and thick hair, creating shine, protecting, and moisturizing, without added weight. The end result is silky, soft, manageable hair.",
      benefits: [
        {
          icon: FaCut,
          text: "Easier Styling",
        },
        {
          icon: FaGripLinesVertical,
          text: "Naturally Detangling",
        },
        {
          icon: FaHandsWash,
          text: "Luxe Lather",
        },
      ],
      photo: "/images/hairtypes/thick-hair-girl.jpg",
      headerImg: "/images/trytor/Med-ThickMinis3.jpg",
      styling: {
        variantId: "gid://shopify/ProductVariant/44022245556470",
        photo: "/images/trytor/styling/MTmilk150ml.png",
        title: "Styling Milk",
        description:
          "TOR Styling Milk for Medium/Thick hair is designed to provide maximum styling versatility. It can help create any desired style while keeping a natural look and movement. Styling Milk works equally well for diffusing to create natural waves or a beach look, increasing volume, or smoothing straight hair. This all-in-one styling provides all the benefits of a cream with the control of the gel and the definition of a mousse in a cream base.",
        price: 24,
      },
    },
    fine: {
      variantId: "gid://shopify/ProductVariant/43618533409014",
      color: "#E4E2DB",
      title: "TOR for Fine & Thin Hair",
      description:
        "TOR's Fine/Thin Line has been specifically formulated to address the unique needs of fine and thin hair, to create voluptuous, soft, manageable hair with shine.",
      benefits: [
        {
          icon: FaFeather,
          text: "No build-up",
        },
        {
          icon: FaWater,
          text: "Naturally moisturizing",
        },
        {
          icon: FaExpandArrowsAlt,
          text: "Maximum volume",
        },
      ],
      photo: "/images/hairtypes/fine-hair-girl.jpg",
      headerImg: "/images/trytor/FineThinMinis.jpg",
      styling: {
        variantId: "gid://shopify/ProductVariant/44022270951670",
        photo: "/images/trytor/styling/FTSpray_300ml.png",
        title: "Anti-Static Hair Spray",
        description:
          "TOR Anti-Static Styling spray help you build that body/style without the fear of static. This light hold spray provides flexible styling and manageability without stiff hold. It provides flexible control so the style is held in place; yet comb and brush easily without flaking. After brushing, hair is soft, flexible and fuller with a natural, healthy look.",
        price: 24,
      },
    },
  } as any;