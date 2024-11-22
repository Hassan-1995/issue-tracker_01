"use client";

import { Button, TextField, Flex } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const RegistrationPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegistrationForm>();

  const onSubmit = async (data: RegistrationForm) => {
    try {
      await axios.post("/api/register", data);
      alert("Registration successful!");
      router.push("/welcome"); // Navigate to a welcome page after registration
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      //   justify="center"
      gap="5"
      className="min-h-screen p-5"
    >
      <h1 className="text-center font-bold text-4xl">Register</h1>
      <form
        className="max-w-lg w-full space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name Field */}
        <TextField.Root
          className="block w-full border-none bg-transparent px-4 py-2 text-lg outline-none"
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />

        {/* Email Field */}
        <TextField.Root
          className="block w-full border-none bg-transparent px-4 py-2 text-lg outline-none"
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />

        {/* Password Field */}
        <TextField.Root
          className="block w-full border-none bg-transparent px-4 py-2 text-lg outline-none"
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />

        {/* Phone Number Field */}
        <TextField.Root
          className="block w-full border-none bg-transparent px-4 py-2 text-lg outline-none"
          type="tel"
          placeholder="Phone Number"
          {...register("phoneNumber", {
            required: "Phone number is required",
          })}
        />

        {/* Submit Button */}
        <Button type="submit" variant="solid" size="3">
          Register
        </Button>
      </form>
    </Flex>
  );
};

export default RegistrationPage;
