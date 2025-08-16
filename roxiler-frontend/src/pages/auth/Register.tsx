import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";



const Register = () => {
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role:""
  });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
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
    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password) || formData.password.length < 8 || formData.password.length > 16) {
      setError("Password must be 8-16 chars, include uppercase & special char.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRoleChange = (newRole: string) => {
  setFormData(prev => ({ ...prev, role: newRole }));
};

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log("Submitting form data:", formData);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      console.log("Registration successful");
      navigate("/login");
    } catch (err) {
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
        {/* Header */}
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold ">
                Register
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Please fill in the details to register.
              </CardDescription>
            </div>
            <Button variant="link" >
              Sign In
            </Button>
          </div>
        </CardHeader>

        {/* Role Selection */}
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 ">
              <input
                type="radio"
                value="USER"
                checked={formData.role === "USER"}
                onChange={() => handleRoleChange("USER")}
                className="accent-blue-500"
              />
              User
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 ">
              <input
                type="radio"
                value="OWNER"
                checked={formData.role === "OWNER"}
                onChange={() => handleRoleChange("OWNER")}
                className="accent-blue-500"
              />
              Store Owner
            </label>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
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
              <Input
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


        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Registering..." : "Register"}
        </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-gray-500 text-center w-full">
            Already have an account?{" "}
            <Button variant="link" className="p-0 h-auto w-auto cursor-pointer">
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
