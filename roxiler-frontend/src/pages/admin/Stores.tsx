// src/pages/admin/Stores.tsx
import { CustomTable } from "@/components/CustomTable"
import {useState,useEffect}from "react"
import api from "@/api/axios"
import { Select,SelectItem,SelectContent,SelectTrigger,SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react";
interface Store {
    id: string;
  name: string;
  address: string;
  averageRating: number;
  owner: Owner;
}
interface Owner {
  id: string;
  name: string;
  email: string;
}

export default function Stores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
  

    const handleRowClick = (store: Store) => {
        setSelectedStore(store);
        setDialogOpen(true);
    };


    const fetchStores = async (currentPage:number, itemsPerPage:number) => {
        setLoading(true);
        try {
            const response = await api.get("/api/stores", {
                params: {
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            setStores(response.data.data.stores);
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchStores(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);


    if(loading){
      return <div>Loading...</div>;
    }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stores</h2>
      <CustomTable
        data={stores}
        columns={[
            { key: "name", label: "Store Name" },
            { key: "address", label: "Address" },
            { key: "averageRating", label: "Average Rating" },
            {
              label: "Actions",
              render: (store: Store) => (
                <Button className="cursor-pointer" variant="outline" onClick={() => handleRowClick(store)}>View Details</Button>
              )
            }
        ]}
      />

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

<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-md rounded-lg shadow-lg">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-gray-800">
        Store Details
      </DialogTitle>
    </DialogHeader>

    {selectedStore && (
      <div className="space-y-3 mt-4 text-sm text-gray-700">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Name:</span>
          <span>{selectedStore.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Owner Email:</span>
          <span>{selectedStore.owner.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Address:</span>
          <span className="text-right">{selectedStore.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Average Rating:</span>
          <span className="text-yellow-600 font-semibold">
            <Star className="inline-block"/> {selectedStore.averageRating ?? "N/A"}
          </span>
        </div>
      </div>
    )}

    <DialogFooter className="mt-6">
      <Button
        variant="outline"
        className="w-full sm:w-auto cursor-pointer"
        onClick={() => setDialogOpen(false)}
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}
