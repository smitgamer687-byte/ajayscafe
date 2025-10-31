import { useState } from 'react';
import { FoodItem, CartItem, Category } from '@/types';
import { menuItems } from '@/data/menuData';
import { FoodCard } from '@/components/customer/FoodCard';
import { SearchBar } from '@/components/customer/SearchBar';
import { CategoryFilter } from '@/components/customer/CategoryFilter';
import { ProductOptionsModal } from '@/components/customer/ProductOptionsModal';
import { Cart } from '@/components/customer/Cart';
import { OrderConfirmModal } from '@/components/customer/OrderConfirmModal';
import { useToast } from '@/hooks/use-toast';
import { UtensilsCrossed } from 'lucide-react';

const categories: Category[] = ['All', 'Pizza', 'Beverages', 'Desserts', 'Appetizers', 'Main Course'];

const Customer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { toast } = useToast();

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: FoodItem) => {
    if (item.options && item.options.length > 0) {
      setSelectedItem(item);
    } else {
      addToCart(item, {}, '');
    }
  };

  const addToCart = (item: FoodItem, selectedOptions: any, specialInstructions: string) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
          selectedOptions,
          specialInstructions,
        },
      ]);
    }
    setSelectedItem(null);
    toast({
      title: 'Added to cart',
      description: `${item.name} added successfully`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleConfirmOrder = async (name: string, phone: string) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderPayload = {
      order: {
        name,
        phone,
        foodItems: cart.map((item) => item.name).join(', '),
        quantity: cart.map((item) => item.quantity).join(', '),
        total,
      },
      source: 'WebsiteDirect',
    };

    const BOT_WEBHOOK_URL = 'https://whatsapp-order-bot-vj1p.onrender.com/webhook/google-sheets';

    try {
      const response = await fetch(BOT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      console.log('Response from bot:', result);

      toast({
        title: 'Order Placed!',
        description: 'Your order has been sent successfully. We will contact you soon!',
      });

      setCart([]);
      setShowOrderModal(false);
    } catch (error) {
      console.error('Webhook Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <UtensilsCrossed className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-primary">The Foodie Café</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full md:flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="w-full md:w-auto overflow-x-auto">
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} onAdd={handleAddToCart} />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No items found</p>
          </div>
        )}
      </main>

      <Cart
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onConfirm={() => setShowOrderModal(true)}
      />

      {selectedItem && (
        <ProductOptionsModal
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={addToCart}
        />
      )}

      <OrderConfirmModal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        items={cart}
        total={total}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
};

export default Customer;
