import { useState } from 'react';
import { CartItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface OrderConfirmModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onConfirm: (name: string, phone: string) => void;
}

export const OrderConfirmModal = ({
  open,
  onClose,
  items,
  total,
  onConfirm,
}: OrderConfirmModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name and phone number',
        variant: 'destructive',
      });
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(name, phone);
      setName('');
      setPhone('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-secondary p-3 rounded-lg space-y-2 max-h-48 overflow-y-auto">
            <h4 className="font-semibold">Order Summary</h4>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="phone">WhatsApp Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                maxLength={10}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Place Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
