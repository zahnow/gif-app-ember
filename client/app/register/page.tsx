"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Center,
  Input,
  Field,
  Fieldset,
  Heading,
  Alert,
} from "@chakra-ui/react";
import { authClient } from "@/components/auth/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authClient.signUp.email(
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          onSuccess: () => {
            router.push(redirectPath);
          },
        },
      );

      if (response.error) {
        throw new Error(
          `Registration failed (${response.error.code}): ${response.error.message}`,
        );
      }
    } catch (error: any) {
      console.error("Registration failed", error);
      setErrorMessage(error.message);
      setIsInvalid(true);
    }
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <>
      {isInvalid && (
        <Alert.Root status={"error"}>
          <Alert.Indicator />
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>
      )}
      <Center h="80vh">
        <Box
          maxW="400px"
          w="full"
          mx="auto"
          mt="20"
          p="8"
          borderWidth="1px"
          borderRadius="lg"
        >
          <form onSubmit={handleSubmit}>
            <Fieldset.Root>
              <Fieldset.Legend>
                <Heading>Register</Heading>
              </Fieldset.Legend>
              <Fieldset.Content>
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Field.RequiredIndicator />
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Field.RequiredIndicator />
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Password</Field.Label>
                  <Field.RequiredIndicator />
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </Field.Root>
                <Button type="submit" width="full">
                  Register
                </Button>
              </Fieldset.Content>
            </Fieldset.Root>
          </form>
        </Box>
      </Center>
    </>
  );
}
