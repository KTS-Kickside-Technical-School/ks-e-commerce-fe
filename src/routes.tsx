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
import SellerProductsList from './pages/seller/products/SellerProductsList';
import SingleProductDetails from './pages/customers/products/SingleProductDetails';
import CartCheckout from './components/customers/cart/MyCart';
import CustomerProfile from './pages/customers/profile/CustomerProfile';
import MyOrders from './pages/customers/orders/MyOrders';
import SellerViewOrders from './pages/seller/orders/SellerViewOrders';
import OrderDetailsPage from './pages/seller/orders/OrderDetailsPage';
import ForgotPassword from './pages/customers/auth/ForgotPassword';
import ResetPassword from './pages/customers/auth/ResetPassword';
import Profile from './pages/dashboard/account/Profile';
import SellerNotFound from './components/seller/SellerNotFound';
import MyShop from './pages/seller/shop/MyShop';
import HelpCenter from './pages/customers/statics/get-support/HelpCenter';
import About from './pages/customers/AboutUs';
import UserViewShops from './pages/customers/shops/UserViewShops';
import SingleShopDetails from './pages/customers/shops/SingleShopDetails';
import SystemInformation from './pages/admin/SystemInformation';
import Locations from './pages/admin/Locations';
import ProductsByCategory from './pages/customers/products/ProductsByCategory';
import SearchResults from './pages/customers/products/SearchResults';
import MySingleOrderDetails from './pages/customers/orders/MySingleOrderDetails';
import Orders from './pages/admin/Orders';
import SingleOrderDetails from './pages/admin/SingleOrderDetails';
import TrackOrderForm from './components/TrackOrderForm';
import SellerAds from './pages/admin/AdminFeaturedShops';
import TermsAndConditions from './pages/admin/termsAndConditions/TermsAndConditions';
import NewTermsAndConditions from './pages/admin/termsAndConditions/NewTermsAndConditions';
import UpdateTermsAndConditions from './pages/admin/termsAndConditions/UpdateTermsAndConditions';
import CustomersTermsAndConditions from './pages/customers/terms/CustomersTermsAndConditions';
import CustomerSingleTermsAndConditions from './pages/customers/terms/CustomerSingleTermsAndConditions';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:slug" element={<SingleProductDetails />} />

      <Route path="/create-account" element={<UserCreateAccount />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/about" element={<About />} />
      <Route path="/shops" element={<UserViewShops />} />
      <Route path="/shop/:id" element={<SingleShopDetails />} />
      <Route path="/category/:name" element={<ProductsByCategory />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/track-order" element={<TrackOrderForm />} />
      <Route path="/terms" element={<CustomersTermsAndConditions />} />
      <Route
        path="/terms/:slug"
        element={<CustomerSingleTermsAndConditions />}
      />

      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/my-cart" element={<CartCheckout />} />
        <Route path="my-account" element={<CustomerProfile />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-order/:id" element={<MySingleOrderDetails />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
        <Route path="/seller" element={<DashboardLayout />}>
          <Route path="" element={<SellerDashboard />} />
          <Route path="new-shop" element={<NewShopForm />} />
          <Route path="products" element={<SellerProductsList />} />
          <Route path="orders" element={<SellerViewOrders />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-shop" element={<MyShop />} />
          <Route path="*" element={<SellerNotFound />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="" element={<h1>Hello, this is the admin</h1>} />
          <Route path="sellers" element={<SellersList />} />
          <Route path="shop-details" element={<ShopDetails />} />
          <Route path="products" element={<AdminViewProducts />} />
          <Route path="categories" element={<AdminViewCategories />} />
          <Route path="profile" element={<Profile />} />
          <Route path="info" element={<SystemInformation />} />
          <Route path="locations" element={<Locations />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<SingleOrderDetails />} />
          <Route path="featured-shops" element={<SellerAds />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="terms/new" element={<NewTermsAndConditions />} />
          <Route
            path="terms/update/:slug"
            element={<UpdateTermsAndConditions />}
          />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
