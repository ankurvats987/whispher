import { useEffect, useState } from "react";
import { replace, useSearchParams } from "react-router";
import authAPI from "../service/authService";
import { Logo } from "../components/Logo";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../components/ErrorMessage";
import { updatePassword } from "../features/auth/authThunks";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [email, setEmail] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const verifyToken = async () => {
    try {
      const response = await authAPI.post("/user/reset/verify", { token });
      setEmail(response.data.data.email);
      setIsTokenValid(true);
    } catch (error) {
      setIsTokenValid(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [token]);

  const onSubmit = async (data) => {
    await verifyToken();

    if (isTokenValid) {
      // Update new password
      try {
        await dispatch(updatePassword({ password: data.pwd, token })).unwrap();

        toast.success("Password reset successfully");
        navigate("/feed", { replace: true });
      } catch (error) {
        console.error(error);
        setError("root", {
          type: "manual",
          message: "Something went wrong",
        });
      }
    }
  };

  const password = watch("pwd");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>
        <div className="text-card-foreground bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
          {isTokenValid ? (
            <>
              <div className="flex flex-col space-y-1.5 p-6 text-center pb-6">
                <h3 className="tracking-tight text-2xl font-bold text-gray-800">
                  Change your password
                </h3>
              </div>
              <div className="flex flex-col p-6 pt-0 space-y-6">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    {errors.root && (
                      <ErrorMessage message={errors.root.message} />
                    )}
                    <div className="space-y-2">
                      <label
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                        htmlFor="pwd"
                      >
                        New Password
                      </label>
                      <input
                        {...register("pwd", {
                          required: "Password is required.",
                          minLength: {
                            value: 8,
                            message: "Password must have atleast 8 characters.",
                          },
                        })}
                        className="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                        id="pwd"
                        placeholder="Enter new password"
                        type="password"
                      ></input>
                      {errors.pwd && (
                        <div className="text-red-500 text-xs ml-2">
                          {errors.pwd.message}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                        htmlFor="confirmPwd"
                      >
                        Confirm Password
                      </label>
                      <input
                        {...register("confirmPwd", {
                          required: "Confirm password is required.",
                          validate: (value) =>
                            value === password || "Passwords do not match.",
                        })}
                        className="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                        id="confirmPwd"
                        placeholder="Confirm your password"
                        type="password"
                      ></input>
                      {errors.confirmPwd && (
                        <div className="text-red-500 text-xs ml-2">
                          {errors.confirmPwd.message}
                        </div>
                      )}
                    </div>

                    <Button
                      isDisabled={isSubmitting}
                      extraStyle={
                        "bg-primary hover:bg-primary/90 px-4 py-2 w-full bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl h-12 text-lg"
                      }
                      title={isSubmitting ? "Submitting..." : "Save Changes"}
                    />
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Link Expired
                  </h3>
                  <p className="text-gray-600">
                    This password reset link has expired or is invalid.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-4 rounded-xl border border-orange-100 mt-4">
                  <p className="text-sm text-gray-600">
                    Password reset links are only valid for{" "}
                    <strong>10 minutes</strong> for security reasons.
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => navigate("/login", { replace: true })}
                    extraStyle={
                      "bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl h-12 px-6 font-medium"
                    }
                    title="Back to Login"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
