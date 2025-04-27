// src/pages/SignIn.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInSchema, SignInFormData } from "../utils/validators";
import { FormContainer } from "../components/common/FormContainer";
import { InputField } from "../components/common/InputField";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error, isLoading, isAuthenticated } = useAuth();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  React.useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: SignInFormData) => {
    await signIn(data);
  };

  return (
    <>
      <FormContainer
        title="Sign in to your account"
        subtitle="Enter your credentials below"
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <InputField
          id="email"
          label="Email Address"
          type="email"
          register={register("email")}
          error={errors.email}
          required
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          register={register("password")}
          error={errors.password}
          required
        />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="text-sm mt-6 text-center">
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </FormContainer>
    </>
  );
};

export default SignIn;
