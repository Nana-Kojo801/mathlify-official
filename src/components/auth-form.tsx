import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useAuth } from "./auth-provider";
import { useState } from "react";
import { Link } from "react-router";

type AuthFormProps = {
  type: "signup" | "login";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const { signup, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    setLoading(true);
    if (type === "signup") await signup(values);
    else await login(values);
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen px-6 bg-background text-white">
      <img
        src="/logo.png"
        alt="Mathlify Logo"
        className="w-20 h-20 mb-3 drop-shadow-lg"
      />

      <h1 className="text-4xl font-extrabold tracking-wide text-primary">
        Mathlify
      </h1>

      <p className="text-gray-300 text-lg mt-2">
        {type === "signup" ? "Sign up to continue" : "Log in to continue"}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 w-full max-w-sm space-y-6"
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-300">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 text-lg bg-gray-800 border border-gray-600 text-white rounded-3 px-4 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-300">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 text-lg bg-gray-800 border border-gray-600 text-white rounded-3 px-4 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 transition-all duration-200 shadow-lg">
            {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : type === "signup" ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <div className="flex items-center w-full max-w-sm my-5">
        <hr className="flex-1 border-gray-600" />
        <span className="mx-2 text-gray-400 text-sm">OR</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      <Link
        to={type === "signup" ? "/auth/login" : "/auth/signup"}
        className="text-gray-400 text-sm"
      >
        {type === "signup"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <span className="text-blue-400 font-medium cursor-pointer hover:underline">
          {type === "signup" ? "Log in" : "Sign up"}
        </span>
      </Link>
    </div>
  );
};

export default AuthForm;
