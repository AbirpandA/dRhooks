import React from "react";
import { ShimmerText } from "./shimmer-text";

const ShimmerTextDemo = () => {
  return (
    <ShimmerText
      duration={3}
      className="tracking-loose text-xl"
      shimmerWidth={20}
    >
      Loading...
    </ShimmerText>
  );
};

export default ShimmerTextDemo;
