import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onConfirm: () => void;
}

export const Cart = ({ items, onUpdateQuantity, onRemove, onConfirm }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card className="fixed bottom-4 right-4 p-4 shadow-xl z-50 max-w-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span>Your cart is empty</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 shadow-xl z-50 max-w-sm w-full max-h-96 overflow-y-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="font-semibold">Cart</span>
          </div>
          <Badge>{itemCount} items</Badge>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6"
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 ml-1"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 space-y-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-primary">₹{total}</span>
          </div>
          <Button onClick={onConfirm} className="w-full" size="lg">
            Confirm Order
          </Button>
        </div>
      </div>
    </Card>
  );
};
