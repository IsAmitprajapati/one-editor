"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import Axios from "@/lib/Axios";

const formSchema = z
  .object({
    email: z.string({ message: "Email is required" }).email().min(5).max(50),
  })

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading,setIsLoading] =useState<boolean>(false)

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const payload = {
      email : values.email
    }
    
    try{
      setIsLoading(true)
      const response = await Axios.post("/api/auth/forgot-password",payload)

      if(response.status === 200){
        toast.success(response.data.message)
        form.reset()
      }
    }catch(error : any){
      toast.error(error?.response?.data?.error)
    }finally{
      setIsLoading(false)
    }

  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center">Forgot Password</h1>
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

          <Button disabled={isLoading} type="submit" className="w-full cursor-pointer">
            {
              isLoading ? "Loading..." : "Submit"
            }   
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
          <p>
            Already have account ? {" "} 
            <Link href={"/login"} className="text-primary drop-shadow-md">
              Login
            </Link> 
          </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

