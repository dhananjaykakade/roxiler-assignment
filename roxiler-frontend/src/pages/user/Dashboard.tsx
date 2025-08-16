import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import StoreCard from "@/components/StoreCard";
import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Store {
  id: string;
  name: string;
  address: string;
  owner: {
    id: string;
    name: string;
  };
  averageRating: number;
  rating: Ratings[];
}
interface Ratings {
  id: string;
  userId: string;
  value: number;
  name: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [error, setError] = useState("");
  const [componentLoading, setComponentLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [ratingId, setRatingId] = useState<string | null>(null);

  const fetchStores = async (
    query?: string,
    pageParam?: number,
    limitParam?: number
  ) => {
    setComponentLoading(true);
    try {
      const response = await api.get("/api/stores", {
        params: {
          search: query || "",
          page: pageParam ?? currentPage,
          limit: limitParam ?? itemsPerPage,
        },
      });
      setStores(response.data.data.stores);
    } catch (error) {
      setError("Failed to fetch stores");
      console.error("Error fetching stores:", error);
    } finally {
      setComponentLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(searchTerm.trim(), currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStores(searchTerm.trim(), 1, itemsPerPage);
  };

  const handleRateClick = (store: Store) => {
    setSelectedStore(store);
    setIsDialogOpen(true);
    const existingRating = store.rating.find((r) => r.userId === user?.id);
    if (existingRating) {
      setRating(existingRating.value);
      setRatingId(existingRating.id);
    } else {
      setRating(null);
      setRatingId(null);
    }
  };

  const checkIfRated = (ratings: Ratings[], userId: string | null) => {
    if (!userId) return false;
    return !!ratings.find((rating) => rating.userId === userId);
  };

  const submitRating = async () => {
    if (!selectedStore || !rating) return;

    try {
      await api.post(`/api/ratings`, {
        storeId: selectedStore.id,
        value: rating,
      });
      setIsDialogOpen(false);
      fetchStores(searchTerm.trim(), currentPage, itemsPerPage);
    } catch (error: any) {
      console.error("Error submitting rating", error);
      setError(error.response?.data?.message || "error submitting rating");
    }
  };

  const editRating = async () => {
    if (!selectedStore || !rating) return;

    try {
      setComponentLoading(true);
      await api.put(`/api/ratings/${ratingId}`, {
        value: rating,
      });
      setIsDialogOpen(false);
      fetchStores(searchTerm.trim(), currentPage, itemsPerPage);
    } catch (error: any) {
      console.error("Error editing rating", error);
      setError(error.response?.data?.message || "error editing rating");
    } finally {
      setComponentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading user...
      </div>
    );
  }
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Please log in to view.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        {error && (
          <Alert variant="destructive" className="mb-6 z-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSearch}
          className="flex flex-col w-1/2 sm:flex-row items-center gap-3 mb-8"
        >
          <Input
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-lg"
          />
          <Button type="submit" className="w-full sm:w-auto cursor-pointer">
            Search
          </Button>
        </form>

        {componentLoading && loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">Loading stores...</p>
          </div>
        ) : stores.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 pt-10 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRate={handleRateClick}
                checkIfRated={checkIfRated}
                userId={user.id}
                editRating={handleRateClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No stores available.
          </div>
        )}

        <div className="w-full h-[2px] my-4 rounded-2xl bg-gray-200"></div>

        <div className="flex flex-wrap justify-between items-center gap-3 py-4">
          <div className="flex items-center gap-2">
            <Button
              className="cursor-pointer"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button
              className="cursor-pointer"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={stores.length < itemsPerPage}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <Select onValueChange={(val) => setItemsPerPage(Number(val))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedStore && checkIfRated(selectedStore.rating, user.id)
                  ? `Edit Rating for ${selectedStore.name}`
                  : `Rate ${selectedStore?.name}`}
              </DialogTitle>
            </DialogHeader>

            <RadioGroup
              value={rating?.toString() || ""}
              onValueChange={(val) => setRating(Number(val))}
              className="space-y-2"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <RadioGroupItem value={num.toString()} id={`rating-${num}`} />
                  <Label htmlFor={`rating-${num}`}>{num}</Label>
                </div>
              ))}
            </RadioGroup>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedStore && checkIfRated(selectedStore.rating, user.id)
                    ? editRating()
                    : submitRating()
                }
                disabled={!rating || !selectedStore}
                className="cursor-pointer"
              >
                {selectedStore && checkIfRated(selectedStore.rating, user.id)
                  ? "Update Rating"
                  : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
