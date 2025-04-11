"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from 'next-auth/react'
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.string({ message: "Email is required" }).email().min(5).max(50),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must at least 8 characters" })
      .regex(/[A-z]/, "Password at leat One Uppercase")
      .regex(/[a-z]/, "Password at least one lowercase")
      .regex(/[0-9]/, "Password at least one number")
      .regex(/[@#$%^&*]/, "Password at least one special character"),
  })

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading,setIsLoading] =useState<boolean>(false)
  const router = useRouter()

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    setIsLoading(true)
    const result = await signIn('credentials',{
      email : values.email,
      password : values.password,
      redirect : false
    })
    setIsLoading(false)
    
    if(result?.error){
      toast.error(result.error)
    }else{
      toast.success("Login successfully")
      router.push("/dashboard")
    }

    
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center">Login</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoading}
                    type="password"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="ml-auto w-fit -mt-3">
            <Link href={"/forgot-password"} className="hover:underline">
              Forgot Password ?
            </Link>
          </div>

          <Button disabled={isLoading} type="submit" className="w-full cursor-pointer">
            {
              isLoading ? "Loading..." : "Login"
            }   
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
          <p>
            Don't have account ? {" "} 
            <Link href={"/register"} className="text-primary drop-shadow-md">
              Create here
            </Link> 
          </p>
      </div>
    </div>
  );
};

export default LoginPage;

