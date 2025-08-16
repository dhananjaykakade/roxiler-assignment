import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Star } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";


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
  userId: string;
  value: number;
name: string;
}


const StoreCard = ({ store, onRate , checkIfRated,userId }: { store: Store, onRate: (store: Store) => void , checkIfRated: (rating: Ratings[],userId: string | null) => boolean,userId:string | null }) => {




  return (
    <Card
      id={store.id}
      className="rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{store.name}</CardTitle>
<div className="flex items-center gap-2 text-sm">
  {store.averageRating > 0 ? (
    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-yellow-800 rounded-full">
      <Star className="w-4 h-4 text-amber-400" /> {store.averageRating.toFixed(1)}
      <span className="text-md text-gray-500">/ 5</span>
    </span>
  ) : (
    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
      No ratings yet
    </span>
  )}
</div>

      </CardHeader>

      <CardContent className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-800">Location:</span>{" "}
          {store.address}
        </p>
        <p>
          <span className="font-medium text-gray-800">Owner:</span>{" "}
          {store.owner.name}
        </p>
      </CardContent>

      <CardFooter>
 <Button
        className="mt-4"
        onClick={() => onRate(store)}
        disabled={checkIfRated(store.rating, userId || null)}
      >
        {checkIfRated(store.rating, userId|| null) ? "Already Rated" : "Rate"}
      </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
