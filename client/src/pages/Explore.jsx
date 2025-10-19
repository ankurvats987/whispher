import React from "react";
import FeedNav from "../components/FeedNav";
import FeedMain from "../components/FeedMain";

const Explore = () => {
  return (
    <>
      <FeedNav />;
      <FeedMain showExplore={true} />
    </>
  );
};

export default Explore;
