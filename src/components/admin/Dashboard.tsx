import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ShoppingBag, Clock, UtensilsCrossed } from 'lucide-react';

export const Dashboard = () => {
  // Mock data - in real app, this would come from state/API
  const stats = [
    { title: 'Total Orders', value: '156', icon: ShoppingBag, change: '+12%' },
    { title: 'Total Revenue', value: '₹45,230', icon: TrendingUp, change: '+8%' },
    { title: 'Pending Orders', value: '8', icon: Clock, change: '-2%' },
    { title: 'Menu Items', value: '24', icon: UtensilsCrossed, change: '+3' },
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', items: 'Pizza, Cold Coffee', total: 428, status: 'completed' },
    { id: '2', customer: 'Jane Smith', items: 'Burger, Fries', total: 349, status: 'preparing' },
    { id: '3', customer: 'Mike Johnson', items: 'Pasta', total: 299, status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your café overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-success mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.items}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold">₹{order.total}</p>
                </div>
                <Badge variant={order.status === 'completed' ? 'success' : 'default'}>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
