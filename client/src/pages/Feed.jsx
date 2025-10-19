import React from "react";
import FeedNav from "../components/FeedNav";
import FeedMain from "../components/FeedMain";

export const Feed = () => {
  return (
    <div className="min-h-screen">
      <FeedNav />
      <FeedMain />
    </div>
  );
};
