"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SignUpDTO } from "@/@types"
import { signup } from "@/action/auth"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required")
      return false
    }
    if (!location.trim()) {
      setError("Location is required")
      return false
    }
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    if (!phoneNumber.trim()) {
      setError("Phone Number is required")
      return false
    }
    if (!password.trim()) {
      setError("Password is required")
      return false
    }
    if (!image) {
      setError("Profile Image is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const signupData: SignUpDTO = {
        name: name.trim(),
        location: location.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
        file: image!
      }

      await signup(signupData)

      router.push("/admin/login")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during signup"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setImage(files[0])
    } else {
      setImage(null)
    }
  }

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
            <CardTitle className="text-2xl font-bold">Sign Up for DineIn</CardTitle>
            <CardDescription>Create your account to manage your restaurant.</CardDescription>
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="image">Profile Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    disabled={isLoading}
                  />
                  {image && (
                    <p className="text-sm text-green-600 mt-1">
                      {image.name} selected
                    </p>
                  )}
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="mt-2 text-sm text-center">
              Already have an account?{" "}
              <a href="/admin/login" className="text-primary hover:underline">Login</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}