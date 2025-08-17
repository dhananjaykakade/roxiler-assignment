import { CustomTable } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Select,
  SelectItem,
  SelectContent,
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
import { Star } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  address: string;
  averageRating: number | null;
  stores: Stores[] | null;
}

interface Stores {
  id: string;
  name: string;
  address: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchUsers = async (currentPage: number, itemsPerPage: number) => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/users", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <CustomTable
        data={users}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "role", label: "Role" },
          {
            label: "Store Rating",
            render: (row) =>
              row.role === "OWNER" ? (
                row.averageRating !== null ? (
                  <span className="font-semibold">
                    <span className="text-red-600">
                      <Star className="inline-block w-4 h-4 mb-1 mr-1" />
                      {row.averageRating.toFixed(1)}
                    </span>{" "}
                    / 5
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">
                    No ratings yet
                  </span>
                )
              ) : (
                <span className="text-muted-foreground italic">N/A</span>
              ),
          },
        ]}
        actions={(row) => (
          <Button
            size="sm"
            className="cursor-pointer"
            variant="outline"
            onClick={() => handleRowClick(row)}
          >
            Details
          </Button>
        )}
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
            disabled={users.length < itemsPerPage}
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

          {selectedUser && (
            <div className="space-y-3 mt-4 text-sm text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Name:</span>
                <span>{selectedUser.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Role:</span>
                <span>{selectedUser.role}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Address:</span>
                <span className="text-right">{selectedUser.address}</span>
              </div>

              {selectedUser.stores?.length > 0 && (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Store:</span>
                    <span>{selectedUser.stores[0].name}</span>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">
                      Store Address:
                    </span>
                    <span>{selectedUser.stores[0].address}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">
                      Store Rating:
                    </span>
                    <span className="flex items-center">
                      <Star className="inline-block w-4 h-4 mr-1 text-amber-500" />
                      {selectedUser?.averageRating.toFixed(1)}
                    </span>
                  </div>
                </>
              )}
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
  );
}
