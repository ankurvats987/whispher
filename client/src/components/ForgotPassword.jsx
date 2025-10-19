import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import { resetPassword } from "../features/auth/authThunks";
import ErrorMessage from "./ErrorMessage";

const ForgotPassword = ({ setLogin }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      await dispatch(resetPassword(data.email)).unwrap();
      setEmailSent(data.email);
      setIsSuccess(true);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error?.message || "Could not verify or email is incorrect",
      });
    }
  };

  // Success view
  if (isSuccess) {
    return (
      <div className="text-card-foreground bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="tracking-tight text-2xl font-bold text-gray-800">
            Check Your Email!
          </h3>
        </div>
        <div className="flex flex-col p-6 pt-0 space-y-6">
          <div className="space-y-4 text-center">
            <p className="text-gray-600 leading-relaxed">
              We've sent a password reset link to
            </p>
            <p className="font-semibold text-purple-600 break-all">
              {emailSent}
            </p>
            <div className="bg-gradient-to-r from-rose-50 to-purple-50 p-4 rounded-xl border border-purple-100 mt-4">
              <p className="text-sm text-gray-600">
                The link will expire in <strong>10 minutes</strong>
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              extraStyle={
                "bg-white border-2 border-gray-200 hover:bg-gray-50 px-4 py-2 w-full text-gray-700 rounded-xl h-12 text-lg font-medium"
              }
              title={"Back to Login"}
              onClick={() => setLogin(true)}
            />
            <button
              onClick={() => setIsSuccess(false)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm cursor-pointer"
            >
              Try different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="text-card-foreground bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
      <div className="flex flex-col space-y-1.5 p-6 text-center pb-6">
        <h3 className="tracking-tight text-2xl font-bold text-gray-800">
          Reset Password
        </h3>
        <p className="text-gray-600 mt-2">
          Enter your email below and we'll send you a link.
        </p>
      </div>
      <div className="flex flex-col p-6 pt-0 space-y-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {errors.root && <ErrorMessage message={errors.root.message} />}
            <div className="space-y-2">
              <label
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                id="email"
                placeholder="Enter your Email"
                type="email"
              />
              {errors.email && (
                <div className="text-red-500 text-xs ml-2">
                  {errors.email.message}
                </div>
              )}
            </div>

            <Button
              isDisabled={isSubmitting}
              extraStyle={
                "bg-primary hover:bg-primary/90 px-4 py-2 w-full bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl h-12 text-lg font-medium"
              }
              title={isSubmitting ? "Sending..." : "Send Link"}
            />
          </div>
        </form>

        <div className="text-center">
          <p
            className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            onClick={() => setLogin(true)}
          >
            Back to login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
