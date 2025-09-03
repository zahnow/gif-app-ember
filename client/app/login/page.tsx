"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Center,
  Input,
  Field,
  Fieldset,
  Heading,
  Text,
  Alert,
} from "@chakra-ui/react";
import { authClient } from "@/components/auth/auth-client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || null;
  const [form, setForm] = useState({ email: "", password: "" });
  const [isInvalid, setIsInvalid] = useState(false);

  console.log("Redirect path:", redirectPath);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: redirectPath || "/",
      });
      if (response.error) {
        throw new Error(
          `Login failed (${response.error.code}): ${response.error.message}`,
        );
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setIsInvalid(true);
    }
  };

  return (
    <>
      {isInvalid && (
        <Alert.Root status={"error"}>
          <Alert.Indicator />
          <Alert.Title>Invalid email or password.</Alert.Title>
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
                <Heading>Login</Heading>
                Log in to use Search and view GIF details.
              </Fieldset.Legend>
              <Fieldset.Content>
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
                  Login
                </Button>
                <Text fontSize="sm" textAlign="center">
                  <Link
                    href={`/register${redirectPath ? `?redirect=${redirectPath}` : ""}`}
                  >
                    Create account
                  </Link>
                </Text>
              </Fieldset.Content>
            </Fieldset.Root>
          </form>
        </Box>
      </Center>
    </>
  );
}
