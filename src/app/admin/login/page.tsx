"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const errorMap: { [key: string]: string } = {
          "CredentialsSignin": "Invalid email or password. Please try again.",
          "UserNotFound": "No account found with this email. Please sign up.",
        };

        setError(errorMap[result.error] || "An unexpected error occurred. Please try again later.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 lg:block relative">
        <Image
          src="/images/taste_bg.jpg"
          alt="Restaurant interior"
          layout="fill"
          objectFit="cover"
          className="rounded-r-2xl"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login to DineIn</CardTitle>
            <CardDescription>Enter your credentials to access your restaurant dashboard.</CardDescription>
          </CardHeader>
          
          {error && (
            <div className="px-4 py-5">
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              className="w-full" 
              type="submit" 
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="mr-2 h-5 w-5 text-white animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
            <div className="mt-2 flex justify-between w-full text-sm items-end">
              <a href="#" className="text-primary hover:underline font-bold">Forgot password?</a>
            </div>
            <div className="mt-4 flex space-x-1 w-full text-sm items-center justify-center">
              <p>Don't have an account?</p>
              <a href="/admin/signup" className="text-primary hover:underline font-bold">Register</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}