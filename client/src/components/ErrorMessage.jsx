import warning from "../assets/warning.png";

const ErrorMessage = ({ message }) => {
  return (
    <div className="w-full px-3 py-2 flex gap-x-4 items-center bg-red-100">
      <img src={warning} className="w-3 h-3" />
      <span className="text-sm text-gray-700">
        {message ? message : "Something went wrong!"}
      </span>
    </div>
  );
};

export default ErrorMessage;
