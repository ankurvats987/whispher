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
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${extraStyle}`}
      onClick={onClick}
    >
      {title === "" ? children : title}
    </button>
  );
};
