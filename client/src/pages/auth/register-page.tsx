import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {SubmitHandler, useForm} from 'react-hook-form'
import { SignUpSchema, SignUpSchemaType } from "@/schemas/auth-schema";
import {zodResolver} from '@hookform/resolvers/zod'
import { Eye, EyeClosed } from "lucide-react";
import {  useRegisterUserMutation } from "@/services/mutations";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [viewEye, setViewEye] = useState(false);

  const {register, handleSubmit, formState:{errors}} = useForm<SignUpSchemaType>({resolver: zodResolver(SignUpSchema)})
  const {mutate: registerUser, isPending} = useRegisterUserMutation()

  const onSubmit: SubmitHandler<SignUpSchemaType> = (values:SignUpSchemaType) => {
        registerUser(values)
  }

  return (
    <section className="flex justify-center items-center min-h-screen">
    <form
      className="flex flex-col justify-center items-center space-y-4 min-w-2/3 md:min-w-[400px] md:max-w-[600px] mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
        <h1 className="text-xl font-bold text-left">Create your account</h1>
        <Input placeholder="Enter your username..." {...register("username")} />
        {errors.username && (
          <p className="text-rose-600">{errors.username.message}</p>
        )}
        <Input placeholder="Enter your email..." {...register("email")} />
        {errors.email && (
          <p className="text-rose-600">{errors.email.message}</p>
        )}
        <div className="w-full flex relative">
          <Input
            placeholder="Enter your password..."
            type={viewEye ? "text" : "password"}
            {...register("password")}
          />
          {viewEye ? (
            <Eye
              className="absolute right-3 mt-2 cursor-pointer"
              size={20}
              onClick={() => setViewEye(!viewEye)}
            />
          ) : (
            <EyeClosed
              className="absolute right-3 mt-2 cursor-pointer"
              size={20}
              onClick={() => setViewEye(!viewEye)}
            />
          )}
        </div>
        {errors.password && (
          <p className="text-rose-600">{errors.password.message}</p>
        )}
        <Button className="w-full px-4 py-4 text-lg font-bold rounded-lg">
          {isPending ? "Submitting" : "Register"}
        </Button>
        <div className="flex justify-center items-center space-x-3">
          <p>Already have an account?</p>
          <p
            className="text-gray-600 font-bold underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </p>
        </div>
      </form>
    </section>
  )
}
