
"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Wait for session to be updated
        const session = await getSession();
        if (session) {
          router.push("/");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <FileText className="w-8 h-8" />
          <span className="font-bold text-2xl">NotionLite</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Enter your credentials to access your documents
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? "Signing in..." : "Sign in"}</span>
              </Button>
            </form>

            <div className="mt-6 border-t pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-3">Demo Accounts Available:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-gray-800">👤 Admin Account</p>
                    <p className="font-mono">admin@demo.com / admin123</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-gray-800">👤 Regular Users</p>
                    <p className="font-mono">alice@demo.com / password123</p>
                    <p className="font-mono">bob@demo.com / password123</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-gray-800">👤 Test Account</p>
                    <p className="font-mono">john@doe.com / johndoe123</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
