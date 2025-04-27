// src/pages/SignUp.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { signUpSchema, SignUpFormData } from "../utils/validators";
import { FormContainer } from "../components/common/FormContainer";
import { InputField } from "../components/common/InputField";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, error, isLoading, isAuthenticated } = useAuth();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  React.useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: SignUpFormData) => {
    const result = await signUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result?.success) {
      setSignupSuccess(true);
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  };

  return (
    <>
      <FormContainer
        title="Create an account"
        subtitle="Already have an account? Sign in below"
        onSubmit={handleSubmit(onSubmit)}
      >
        {signupSuccess && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="text-sm text-green-700">
                  <p>Account created successfully! Redirecting to sign in...</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
          id="name"
          label="Full Name"
          register={register("name")}
          error={errors.name}
          required
        />

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

        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>

        <div className="text-sm mt-6 text-center">
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </FormContainer>
    </>
  );
};

export default SignUp;
