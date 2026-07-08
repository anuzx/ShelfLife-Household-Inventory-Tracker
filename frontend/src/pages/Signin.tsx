import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../validator/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      navigate("/dashboard");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Sign in
        </h1>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.password?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white rounded-md py-2 font-medium hover:bg-gray-900 disabled:bg-blue-300 transition-colors"
        >
          {mutation.isPending ? "Loading..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export { Signin };
