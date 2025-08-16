import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";

interface Rating {
  id: string;
  value: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Store {
  id: string;
  name: string;
  address: string;
  ratings: Rating[];
}

export default function OwnerDashboard() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", address: "" });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStore = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/stores/get/owner`);
        setStore(res.data.data || null);
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [user]);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/stores", form);
      setStore(res.data.data.store);
    } catch (error) {
      console.error("Error creating store:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (!store) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Owner Dashboard
          </h2>
          <p className="mb-6 text-muted-foreground max-w-md">
            You don’t have a store listed yet. Add your store to start receiving
            ratings.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="cursor-pointer">
                Add Your Store
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Store</DialogTitle>
                <DialogDescription>
                  Enter your store details below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddStore} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Store Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. My Shop"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <Textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Enter store address"
                    required
                  />
                </div>

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full cursor-pointer"
                >
                  {loading ? "Creating..." : "Create Store"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }

  const averageRating =
    store.ratings.length > 0
      ? (
          store.ratings.reduce((sum, r) => sum + r.value, 0) /
          store.ratings.length
        ).toFixed(1)
      : "N/A";

  return (
    <>
      <Navbar />
      <div className="pt-18 p-4 space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold">{store.name}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {store.address}
          </p>
          <p className="mt-3 text-lg font-semibold">
            <Star className="inline w-5 h-5 text-red-600" /> Average Rating:{" "}
            <span className="text-red-600">{averageRating}</span> / 5
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Ratings Received</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.ratings.length > 0 ? (
                store.ratings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell>{rating.user.name}</TableCell>
                    <TableCell>{rating.user.email}</TableCell>
                    <TableCell>{rating.value} / 5</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center italic text-muted-foreground"
                  >
                    No ratings yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
