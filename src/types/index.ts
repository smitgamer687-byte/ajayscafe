export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  description?: string;
  stock: number;
  options?: FoodOption[];
}

export interface FoodOption {
  type: 'size' | 'toppings' | 'custom';
  label: string;
  choices?: OptionChoice[];
  allowMultiple?: boolean;
}

export interface OptionChoice {
  name: string;
  price: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedOptions?: { [key: string]: string | string[] };
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'rejected';
  timestamp: Date;
}

export type Category = 'All' | 'Pizza' | 'Beverages' | 'Desserts' | 'Appetizers' | 'Main Course';
