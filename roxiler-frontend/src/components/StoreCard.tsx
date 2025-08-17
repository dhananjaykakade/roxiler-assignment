import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Star } from 'lucide-react';
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";


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
  id:string
  userId: string;
  value: number;
name: string;
}


const StoreCard = ({ store, onRate , checkIfRated,userId,editRating }: { store: Store, onRate: (store: Store) => void , checkIfRated: (rating: Ratings[],userId: string | null) => boolean,userId:string | null, editRating: (store: Store) => void}) => {
const [totalUserRated,setTotalUserRated] = useState<number>(0);
const [userSubmittedRating,setUserSubmittedRating] = useState<number | null>(null);


useEffect(() => {
  setTotalUserRated(Number(store.rating.length));
  const userRating = store.rating.find(r => r.userId === userId);
  setUserSubmittedRating(userRating ? userRating.value : null);
}, [store.rating, userId]);

  return (
    <Card
      id={store.id}
      className="rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{store.name}</CardTitle>
<div className="flex items-center gap-2 text-sm">
  {store.averageRating > 0 ? (
<>
    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-yellow-800 rounded-full">
      <Star className="w-4 h-4 text-amber-400" /> {store.averageRating.toFixed(1)}
      <span className="text-md text-gray-500">/ 5</span>
    </span>

    <div>
      {store.averageRating >= 4 ? (
        <div className="flex gap-1">
        <Badge variant="default" className="bg-green-100 text-green-800">Highly Rated</Badge>
        <Badge variant="default" className="bg-purple-100 text-purple-800">Recommended</Badge>
        </div>
      ) : store.averageRating >= 3 ? (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">Moderately Rated</Badge>
      ) : (
        <Badge variant="default" className="bg-red-100 text-red-800">Low Rated</Badge>
      )}
    </div>
    
    </>
  ) : (
    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
      No ratings yet
    </span>
  )}
</div>

{totalUserRated > 0 && (
  <div className="flex items-center gap-2 text-sm">
    <span className="font-medium text-yellow-800">Total Users Rated:</span>{" "}
    {totalUserRated}
  </div>
)}

{userSubmittedRating !== null && (
  <div className="flex items-center gap-2 text-sm">
    <span className="font-medium text-yellow-800">Your Rating:</span>{" "}
    <Star className="w-4 h-4 text-amber-400" /> {userSubmittedRating} / 5
  </div>
)}

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
        {checkIfRated(store.rating, userId || null) ? (
          <Button className="mt-4 cursor-pointer" onClick={() => editRating(store)}>
            Edit Rating
          </Button>
        ) : (
          <Button className="mt-4 cursor-pointer" onClick={() => onRate(store)}>
            Rate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
