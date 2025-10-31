import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Leaf, Drumstick } from 'lucide-react';
import { menuItems as initialMenuItems } from '@/data/menuData';
import { FoodItem } from '@/types';

export const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>(initialMenuItems);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove menu items</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  <Badge variant={item.isVeg ? 'success' : 'destructive'}>
                    {item.isVeg ? <Leaf className="h-3 w-3" /> : <Drumstick className="h-3 w-3" />}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">₹{item.price}</span>
                  <span className="text-sm text-muted-foreground">Stock: {item.stock}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
