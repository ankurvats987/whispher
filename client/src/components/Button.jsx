import React from "react";

export const Button = ({
  title = "",
  extraStyle,
  children = null,
  onClick = null,
  isDisabled = false,
}) => {
  return (
    <button
      disabled={isDisabled}
      className={`cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${extraStyle}`}
      onClick={onClick}
    >
      {title === "" ? children : title}
    </button>
  );
};
