import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield } from "lucide-react";
import { useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";
import { Alert } from "@/components/ui/alert";
const Profile = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await api.post("/api/auth/change-password", {
        email: user.email,
        oldPassword,
        newPassword,
      });

      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto py-10 pt-20">
        {message && (
          <Alert
            variant={
              message.includes("successfully") ? "default" : "destructive"
            }
            className="flex m-4 w-auto -z-10"
          >
            {message}
          </Alert>
        )}

        <Card className="border border-gray-300 shadow-md rounded-xl overflow-hidden bg-white">
          <CardHeader className="text-black border-b border-gray-200">
            <CardTitle className="text-xl font-bold">My Profile</CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <User className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Mail className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Shield className="text-black w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <h2 className="text-lg font-semibold text-black">
                Change Password
              </h2>

              <div>
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="border-gray-300 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="border-gray-300 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-gray-300 mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Profile;
