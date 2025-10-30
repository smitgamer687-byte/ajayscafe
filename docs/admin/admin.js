// API Base URL - Change this to your deployed backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Main Admin Panel Component
const AdminPanel = () => {
    const [currentPage, setCurrentPage] = React.useState('dashboard');
    const [orders, setOrders] = React.useState([]);
    const [menuItems, setMenuItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [orderFilter, setOrderFilter] = React.useState('all');
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [editingItem, setEditingItem] = React.useState(null);
    const [isAddingItem, setIsAddingItem] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        category: 'Hot Beverages',
        price: '',
        image: '',
        popular: false
    });

    // Fetch data on mount
    React.useEffect(() => {
        fetchOrders();
        fetchMenuItems();
    }, []);

    // Fetch orders from backend
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`);
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    // Fetch menu items from backend
    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/menu`);
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, status) => {
        try {
            await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    // Delete menu item
    const deleteMenuItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await fetch(`${API_BASE_URL}/menu/${itemId}`, {
                method: 'DELETE'
            });
            fetchMenuItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete menu item');
        }
    };

    // Save menu item (add or update)
    const saveMenuItem = async () => {
        if (!formData.name || !formData.price) {
            alert('Please fill in required fields');
            return;
        }

        const menuItem = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            image: formData.image,
            popular: formData.popular
        };

        try {
            if (editingItem) {
                await fetch(`${API_BASE_URL}/menu/${editingItem.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menuItem)
                });
            } else {
                await fetch(`${API_BASE_URL}/menu`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menuItem)
                });
            }
            fetchMenuItems();
            closeEditModal();
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert('Failed to save menu item');
        }
    };

    const closeEditModal = () => {
        setEditingItem(null);
        setIsAddingItem(false);
        setFormData({
            name: '',
            description: '',
            category: 'Hot Beverages',
            price: '',
            image: '',
            popular: false
        });
    };

    // Calculate statistics
    const acceptedOrders = orders.filter(o =>
        ['completed', 'preparing', 'ready'].includes(o.status)
    );
    const totalOrders = acceptedOrders.length;
    const totalRevenue = acceptedOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id?.toString().includes(searchQuery);
        const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
        return matchesSearch && matchesFilter;
    });

    // Loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 overflow-y-auto">
                {currentPage === 'dashboard' && (
                    <Dashboard
                        totalOrders={totalOrders}
                        totalRevenue={totalRevenue}
                        pendingOrders={pendingOrders}
                        menuItemsCount={menuItems.length}
                        recentOrders={orders.slice(0, 4)}
                        setSelectedOrder={setSelectedOrder}
                        setCurrentPage={setCurrentPage}
                    />
                )}
                {currentPage === 'orders' && (
                    <Orders
                        orders={filteredOrders}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        orderFilter={orderFilter}
                        setOrderFilter={setOrderFilter}
                        selectedOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                        updateOrderStatus={updateOrderStatus}
                    />
                )}
                {currentPage === 'menu' && (
                    <MenuManagement
                        menuItems={menuItems}
                        deleteMenuItem={deleteMenuItem}
                        setEditingItem={setEditingItem}
                        setIsAddingItem={setIsAddingItem}
                        setFormData={setFormData}
                        editingItem={editingItem}
                        isAddingItem={isAddingItem}
                        formData={formData}
                        saveMenuItem={saveMenuItem}
                        closeEditModal={closeEditModal}
                    />
                )}
            </div>
        </div>
    );
};

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage }) => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    AJ
                </div>
                <div>
                    <h2 className="font-bold text-lg">Admin Panel</h2>
                    <p className="text-sm text-gray-600">AJAYS Cafe</p>
                </div>
            </div>
        </div>
        <nav className="flex-1 p-4">
            {[
                { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                { id: 'orders', icon: '🛒', label: 'Orders' },
                { id: 'menu', icon: '🍽️', label: 'Menu' }
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                        currentPage === item.id
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
            <button
                onClick={() => (window.location.href = '../customer/index.html')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-600 hover:bg-blue-50"
            >
                <span className="text-xl">👥</span>
                <span className="font-medium">Customer View</span>
            </button>
        </div>
    </div>
);

// Dashboard Component
const Dashboard = ({
    totalOrders,
    totalRevenue,
    pendingOrders,
    menuItemsCount,
    recentOrders,
    setSelectedOrder,
    setCurrentPage
}) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard icon="🛍️" title="Total Orders" value={totalOrders} color="blue" />
            <StatCard icon="💰" title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} color="green" />
            <StatCard icon="⏰" title="Pending Orders" value={pendingOrders} color="orange" />
            <StatCard icon="🍽️" title="Menu Items" value={menuItemsCount} color="purple" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-3">
                {recentOrders.map(order => (
                    <div
                        key={order.id}
                        className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg"
                    >
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-lg">{order.customerName}</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'rejected'
                                            ? 'bg-red-100 text-red-700'
                                            : order.status === 'preparing'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">₹{order.total}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedOrder(order);
                                setCurrentPage('orders');
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            👁️ View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const StatCard = ({ icon, title, value, color }) => {
    const colors = {
        blue: 'border-blue-500 bg-blue-100',
        green: 'border-green-500 bg-green-100',
        orange: 'border-orange-500 bg-orange-100',
        purple: 'border-purple-500 bg-purple-100'
    };
    return (
        <div className={`bg-white rounded-xl p-6 border-l-4 ${colors[color]} shadow-sm`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-600 mb-2">{title}</p>
                    <p className="text-4xl font-bold">{value}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );
};

// Orders Component
const Orders = ({ orders, searchQuery, setSearchQuery, orderFilter, setOrderFilter, selectedOrder, setSelectedOrder, updateOrderStatus }) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Order Management</h1>
        <div className="flex gap-4 mb-6">
            <input
                type="text"
                placeholder="Search by customer name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>

        <div className="grid grid-cols-3 gap-6">
            {orders.map(order => (
                <OrderCard key={order.id} order={order} setSelectedOrder={setSelectedOrder} updateOrderStatus={updateOrderStatus} />
            ))}
        </div>

        {selectedOrder && (
            <OrderModal order={selectedOrder} setSelectedOrder={setSelectedOrder} updateOrderStatus={updateOrderStatus} />
        )}
    </div>
);

// OrderCard Component
const OrderCard = ({ order, setSelectedOrder, updateOrderStatus }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative">
        {order.status !== 'pending' && order.status !== 'rejected' && (
            <div className="absolute top-4 right-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'preparing'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {order.status}
                </span>
            </div>
        )}
        <h3 className="font-bold text-xl mb-2">{order.customerName}</h3>
        <p className="text-gray-600 text-sm mb-1">Order #{order.id}</p>
        <p className="text-gray-600 text-sm mb-1">📞 {order.phoneNumber}</p>
        <p className="text-gray-600 text-sm mb-4">🕐 {order.orderDate}</p>
        <p className="text-2xl font-bold text-orange-600 mb-4">₹{order.total}</p>

        <div className="flex gap-2">
            <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
                👁️
            </button>

            {order.status === 'pending' && (
                <>
                    <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => updateOrderStatus(order.id, 'rejected')}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Reject
                    </button>
                </>
            )}

            {order.status === 'preparing' && (
                <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                    Complete
                </button>
            )}
        </div>
    </div>
);

// Order Modal
const OrderModal = ({ order, setSelectedOrder, updateOrderStatus }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{order.customerName}</h2>
                    <p className="text-gray-600">Order #{order.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-2xl">✕</button>
            </div>
            <div className="space-y-4 mb-6">
                <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{order.phoneNumber}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Order Time</p>
                    <p className="font-medium">{order.orderDate}</p>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t-2">
                    <span>Total</span>
                    <span className="text-orange-600">₹{order.total}</span>
                </div>
            </div>
            {order.status === 'pending' && (
                <div className="flex gap-3">
                    <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Accept Order
                    </button>
                    <button
                        onClick={() => updateOrderStatus(order.id, 'rejected')}
                        className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Reject
                    </button>
                </div>
            )}
            {order.status === 'preparing' && (
                <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                    Mark as Completed
                </button>
            )}
        </div>
    </div>
);

// Menu Management Component
const MenuManagement = ({
    menuItems,
    deleteMenuItem,
    setEditingItem,
    setIsAddingItem,
    setFormData,
    editingItem,
    isAddingItem,
    formData,
    saveMenuItem,
    closeEditModal
}) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Menu Management</h1>
        <div className="mb-6 flex justify-end">
            <button
                onClick={() => {
                    setIsAddingItem(true);
                    setEditingItem(null);
                    setFormData({
                        name: '',
                        description: '',
                        category: 'Hot Beverages',
                        price: '',
                        image: '',
                        popular: false
                    });
                }}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
                ➕ Add New Item
            </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
            {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200')}
                    />
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                        <p className="text-xl font-bold text-orange-600 mb-4">₹{item.price}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditingItem(item);
                                    setFormData(item);
                                }}
                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteMenuItem(item.id)}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {(isAddingItem || editingItem) && (
            <MenuItemModal
                formData={formData}
                setFormData={setFormData}
                saveMenuItem={saveMenuItem}
                closeEditModal={closeEditModal}
                editingItem={editingItem}
            />
        )}
    </div>
);

// MenuItem Modal
const MenuItemModal = ({ formData, setFormData, saveMenuItem, closeEditModal, editingItem }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
        <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
                {editingItem ? 'Edit Menu Item' : 'Add New Item'}
            </h2>

            <div className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                    <option value="Hot Beverages">Hot Beverages</option>
                    <option value="Cold Beverages">Cold Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                </select>
                <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.popular}
                        onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    />
                    <span>Mark as Popular</span>
                </label>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={saveMenuItem}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    {editingItem ? 'Update' : 'Add Item'}
                </button>
                <button
                    onClick={closeEditModal}
                    className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

ReactDOM.render(<AdminPanel />, document.getElementById('root'));
