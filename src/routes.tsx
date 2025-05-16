import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/customers/HomePage';
import UserCreateAccount from './pages/customers/auth/UserCreateAccount';
import UserLogin from './pages/customers/auth/UserLogin';
import NotFound from './pages/NotFound';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import SellerDashboard from './components/seller/SellerDashboard';
import ProtectedRoute from './middlewares/ProtectedRoute';
import NewShopForm from './components/seller/NewShop';
import SellersList from './components/admin/SellersList';
import ShopDetails from './components/admin/ShopDetails';
import AdminViewProducts from './components/admin/AdminViewProducts';
import AdminViewCategories from './components/admin/AdminViewCategories';
import AdminNotFound from './components/admin/AdminNotFound';
import SellerProductsList from './components/seller/SellerProductsList';
import SingleProductDetails from './components/customers/products/SingleProductDetails';
import CartCheckout from './components/customers/cart/MyCart';
import CustomerProfile from './pages/customers/profile/CustomerProfile';
import MyOrders from './pages/customers/orders/MyOrders';
import SellerViewOrders from './pages/seller/orders/SellerViewOrders';
import OrderDetailsPage from './pages/seller/orders/OrderDetailsPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:slug" element={<SingleProductDetails />} />

      <Route path="/create-account" element={<UserCreateAccount />} />
      <Route path="/login" element={<UserLogin />} />
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/my-cart" element={<CartCheckout />} />
        <Route path="my-account" element={<CustomerProfile />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
        <Route path="/seller" element={<DashboardLayout />}>
          <Route path="" element={<SellerDashboard />} />
          <Route path="new-shop" element={<NewShopForm />} />
          <Route path="products" element={<SellerProductsList />} />
          <Route path="orders" element={<SellerViewOrders />} />
          <Route
            path="single-order-details/:orderId"
            element={<OrderDetailsPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="" element={<h1>Hello, this is the admin</h1>} />
          <Route path="sellers" element={<SellersList />} />
          <Route path="shop-details" element={<ShopDetails />} />
          <Route path="products" element={<AdminViewProducts />} />
          <Route path="categories" element={<AdminViewCategories />} />

          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
