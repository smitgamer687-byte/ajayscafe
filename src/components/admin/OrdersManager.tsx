import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X } from 'lucide-react';
import { Order } from '@/types';

type OrderStatus = 'all' | 'pending' | 'preparing' | 'completed' | 'rejected';

export const OrdersManager = () => {
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      customerPhone: '9876543210',
      items: [],
      total: 428,
      status: 'pending',
      timestamp: new Date('2025-10-31T10:30:00'),
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerPhone: '9876543211',
      items: [],
      total: 349,
      status: 'preparing',
      timestamp: new Date('2025-10-31T11:00:00'),
    },
  ]);

  const handleAccept = async (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'preparing' as const } : order
      )
    );
    // TODO: Send WhatsApp notification
  };

  const handleReject = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'rejected' as const } : order
      )
    );
  };

  const handleComplete = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'completed' as const } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) =>
    filter === 'all' ? true : order.status === filter
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'preparing':
        return 'default';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders</p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as OrderStatus)}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className={
              order.status === 'preparing' ? 'border-l-4 border-l-primary' : ''
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{order.customerName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                </div>
                <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold text-primary">₹{order.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Time:</span>
                  <span>{order.timestamp.toLocaleString()}</span>
                </div>
                {order.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      variant="default"
                      onClick={() => handleAccept(order.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => handleReject(order.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {order.status === 'preparing' && (
                  <Button className="w-full" onClick={() => handleComplete(order.id)}>
                    Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
