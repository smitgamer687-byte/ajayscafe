import { FoodItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Drumstick } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
}

export const FoodCard = ({ item, onAdd }: FoodCardProps) => {
  const isOutOfStock = item.stock === 0;

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-card-foreground">{item.name}</h3>
          <Badge variant={item.isVeg ? "success" : "destructive"} className="ml-2">
            {item.isVeg ? <Leaf className="h-3 w-3" /> : <Drumstick className="h-3 w-3" />}
          </Badge>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">₹{item.price}</span>
          <Button
            onClick={() => onAdd(item)}
            disabled={isOutOfStock}
            variant="default"
            size="sm"
            className="rounded-full"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
