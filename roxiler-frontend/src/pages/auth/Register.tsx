import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (formData.address.length > 400) {
      setError("Address cannot be more than 400 characters.");
      return false;
    }
    if (
      !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password) ||
      formData.password.length < 8 ||
      formData.password.length > 16
    ) {
      setError(
        "Password must be 8-16 chars, include uppercase & special char."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post(`/api/auth/signup`, formData);
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="w-full max-w-lg rounded-2xl shadow-lg border ">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold ">Register</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Please fill in the details to register.
                </CardDescription>
              </div>
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="cursor-pointer"
              >
                Sign In
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Register As</label>
          <Select
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, role: val }))
            }
            value={formData.role}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="OWNER">Store Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <p className="text-xs text-red-500 italic">
                  name should be between 20 and 60 characters
                </p>

                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="rounded-lg"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="rounded-md"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your address"
                  className="rounded-md"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <p className="text-xs text-red-500 italic">
                  Password should be at least 8 characters long and contain at
                  least one uppercase letter, one lowercase letter, and one
                  number.
                </p>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="rounded-md"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-gray-500 text-center w-full">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="p-0 h-auto w-auto cursor-pointer"
              >
                Sign In
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
