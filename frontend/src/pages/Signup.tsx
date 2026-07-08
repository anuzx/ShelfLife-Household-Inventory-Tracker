import { useForm } from "react-hook-form";
import { registerSchema, type RegisterFormData } from "../validator/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate("/signin");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };
  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <form
         onSubmit={handleSubmit(onSubmit)}
         className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md space-y-4"
       >
         <h1 className="text-2xl font-semibold text-gray-800 text-center">
           Create an account
         </h1>
 
         <div>
           <input
             {...register("name")}
             placeholder="Name"
             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
         </div>
 
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
           <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
         </div>
 
         <button
           type="submit"
           disabled={mutation.isPending}
          className="w-full bg-black text-white rounded-md py-2 font-medium hover:bg-black disabled:bg-blue-300 transition-colors"
         >
           {mutation.isPending ? "Loading..." : "Signup"}
         </button>
       </form>
     </div>
   );
};

export {Signup};
