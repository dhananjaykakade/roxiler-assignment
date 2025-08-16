// src/pages/admin/AddUser.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from "@/api/axios";

export default function AddNewUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.name.length < 20 || form.name.length > 60) {
      return setError("Name must be between 20 and 60 characters.");
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError("Invalid email address.");
    }
    if (form.address.length > 400) {
      return setError("Address must be less than 400 characters.");
    }
    if (form.password.length < 8 || form.password.length > 16) {
      return setError("Password must be 8-16 characters long.");
    }
    if (!/[A-Z]/.test(form.password)) {
      return setError("Password must contain at least one uppercase letter.");
    }
    if (!/[^a-zA-Z0-9]/.test(form.password)) {
      return setError("Password must contain at least one special character.");
    }

    try {
      setLoading(true);
      await api.post("/api/admin/users", form);
      setSuccess("User created successfully!");
      setForm({ name: "", email: "", address: "", password: "", role: "USER" });
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New User</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <Textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <Select
            onValueChange={(val) => setForm({ ...form, role: val })}
            value={form.role}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="OWNER">Store Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading} className="w-full cursor-pointer">
          {loading ? "Creating..." : "Create User"}
        </Button>
      </form>
    </div>
  );
}
