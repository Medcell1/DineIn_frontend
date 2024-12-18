'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { updateUserProfile } from '@/action/user'
import { Skeleton } from '@/components/ui/skeleton'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useTheme } from 'next-themes'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  file: z.instanceof(File).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileForm({ user }: { user: ProfileFormValues & { image: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  })
const {theme} = useTheme();
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      const fileInput = document.getElementById('image') as HTMLInputElement
      const file = fileInput?.files?.[0] || data.file

      const updatedUser = await updateUserProfile(
        {
          name: data.name,
          email: data.email,
          location: data.location,
          phoneNumber: data.phoneNumber,
        },
        file
      )

      console.log('Profile updated successfully:', updatedUser)
      toast.success("Profile updated successfully");
      if (file) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Error updating profile")
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
          <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === "dark" ? "dark" : "light"}
            />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="personal-info">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>
                <AnimatePresence>
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <FormField
                        label="Name"
                        id="name"
                        register={register}
                        error={errors.name}
                      />
                      <FormField
                        label="Email"
                        id="email"
                        type="email"
                        register={register}
                        error={errors.email}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="additional-info">
              <AccordionTrigger>Additional Information</AccordionTrigger>
              <AccordionContent>
                <AnimatePresence>
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <FormField
                        label="Location"
                        id="location"
                        register={register}
                        error={errors.location}
                      />
                      <FormField
                        label="Phone Number"
                        id="phoneNumber"
                        register={register}
                        error={errors.phoneNumber}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setValue('file', file) // Update form state with selected file
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export interface FormFieldProps {
  label: string;
  id: keyof ProfileFormValues
  type?: string
  register: any
  error?: {
    message?: string
  }
}

function FormField({ label, id, type = 'text', register, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register(id)} />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
