import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../features/auth/authSlice";
import ErrorMessage from "../components/ErrorMessage";
import { loginUser } from "../features/auth/authThunks";
import ForgotPassword from "../components/ForgotPassword";
import { toast } from "react-toastify";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authLoading = useSelector((state) => state.auth.loading);
  const from = location.state?.from?.pathname || "/feed";

  const { message, code } = location.state || {};

  const [showLogin, setLogin] = useState(true);

  const [checked, setChecked] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [once, setOnce] = useState(true);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const resultAction = await dispatch(
      loginUser({ username: data.username, password: data.password })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }

    if (loginUser.rejected.match(resultAction)) {
      setError("root", {
        type: "manual",
        message: resultAction.payload,
      });
    }
  };

  useEffect(() => {
    if (once && message && code) {
      code === 1 && toast.success(message);
      setOnce(false);
    }

    return () => {
      clearAuthError();
      setLogin(true);
    };
  }, [dispatch]);

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword((val) => !val);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>
        {showLogin ? (
          <div className="text-card-foreground bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <div className="flex flex-col space-y-1.5 p-6 text-center pb-6">
              <h3 className="tracking-tight text-2xl font-bold text-gray-800">
                Welcome Back
              </h3>
              <p className="text-gray-600 mt-2">
                Sign in to continue your conversations
              </p>
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
                      htmlFor="email"
                    >
                      Username
                    </label>
                    <input
                      {...register("username", {
                        required: "Username is required.",
                      })}
                      className="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                      id="username"
                      placeholder="Enter your username"
                      type="text"
                      fdprocessedid="plsmav"
                    ></input>
                    {errors.username && (
                      <div className="text-red-500 text-xs ml-2">
                        {errors.username.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative w-full">
                      <input
                        {...register("password", {
                          required: "Password is required.",
                        })}
                        className="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                        id="password"
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                      ></input>

                      <div className="absolute right-3 top-[55%] -translate-y-1/2">
                        <button
                          className="cursor-pointer transition-transform duration-200 hover:scale-110"
                          onClick={handleShowPassword}
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-4 h-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.98 8.223C2.68 9.55 1.75 11.156 1.5 12c1.5 4.5 5.5 7.5 10.5 7.5 1.875 0 3.645-.445 5.178-1.234m3.342-2.956C22.32 14.45 23.25 12.844 23.5 12c-1.5-4.5-5.5-7.5-10.5-7.5-1.875 0-3.645.445-5.178 1.234M3 3l18 18"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-4 h-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.364 4.5 12 4.5c4.637 0 8.578 3.01 9.964 7.183.07.207.07.431 0 .639C20.577 16.49 16.636 19.5 12 19.5c-4.636 0-8.577-3.01-9.964-7.178z"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {errors.password && (
                      <div className="text-red-500 text-xs ml-2">
                        {errors.password.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 items-center">
                    <input
                      type="checkbox"
                      role="checkbox"
                      aria-checked={checked}
                      data-state={checked ? "checked" : "unchecked"}
                      onClick={() => setChecked((prev) => !prev)}
                      value="on"
                      className="peer h-4 w-4 shrink-0 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-md"
                      id="remember"
                    ></input>
                    <label
                      className="font-medium peer-disable:cursor-not-allowed peer-disabled:opacity-70 text-sm text-gray-600"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogin(false)}
                    className="text-sm text-purple-600 hover:text-purple-700 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button
                  isDisabled={isSubmitting || authLoading}
                  extraStyle={
                    "bg-primary hover:bg-primary/90 px-4 py-2 w-full bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl h-12 text-lg font-medium"
                  }
                  title={isSubmitting || authLoading ? "Logging..." : "Log In"}
                />
              </form>

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ForgotPassword setLogin={setLogin} />
        )}
      </div>
    </main>
  );
};
