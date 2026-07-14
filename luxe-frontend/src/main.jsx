import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'
import AdminLayout from './AdminLayout.jsx';
import RootLayout from './RootLayout.jsx';

import './styles/index.css'

// USER COMPONENTS
import HomePage from './pages/HomePage.jsx';
import Shop from './pages/Shop.jsx';
import AddCategory from './pages/Admin/AddCategory.jsx';
import Categories from './pages/Categories.jsx';
import AddItems from './pages/Admin/AddItems.jsx';
import SignUp from './pages/SIgnUp.jsx';
import Login from './pages/Login.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Profile from './pages/Profile.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import NoPermission from './pages/NoPermission.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import Shipping from './pages/Shipping.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import VerifyToken from './pages/VerifyToken.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import OrderCancel from './pages/OrderCancel.jsx';

// ADMIN COMPONENTS
import Dashboard from './pages/Admin/Dashboard.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import Products from './pages/Admin/Products.jsx';
import AdminCategories from './pages/Admin/AdminCategories.jsx';
import AdminOrders from './pages/Admin/AdminOrders.jsx';

// CONTEXT PROVIDERS
import AuthProvider from '../store/AuthContext.jsx';
import CartProvider from '../store/CartContext.jsx';
import WishlistProvider from '../store/WishlistContext.jsx';
import AuthRoute from './components/AuthRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFound from './pages/NotFound.jsx';


const router = createBrowserRouter([
  {
    path: '/verify/:token', element: <VerifyToken />
  },

  {
    element: <RootLayout />,
    children: [

      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'shop', element: <Shop /> },
          { path: 'signup', element: <SignUp /> },
          { path: 'login', element: <Login /> },
          { path: 'cart', element: <AuthRoute><Cart /></AuthRoute> },
          { path: 'wishlist', element: <AuthRoute><Wishlist /></AuthRoute> },
          { path: 'profile', element: <AuthRoute><Profile /></AuthRoute> },
          { path: 'checkout', element: <AuthRoute><Checkout /></AuthRoute> },
          { path: 'my-orders', element: <AuthRoute><MyOrders /></AuthRoute> },
          { path: 'product/:id', element: <ProductDetails /> },
          { path: 'categories', element: <Categories /> },
          { path: 'about', element: <About /> },
          { path: 'contact', element: <Contact /> },
          { path: 'faq', element: <FAQ /> },
          { path: 'shipping', element: <Shipping /> },
          { path: 'privacy', element: <Privacy /> },
          { path: 'terms', element: <Terms /> },
          { path: 'no-permission', element: <NoPermission /> },
          { path: 'success', element: <OrderSuccess /> },
          { path: 'cancel', element: <OrderCancel /> },
          { path: '*', element: <NotFound /> },
        ]
      },

      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <Products /> },
          { path: "add-item", element: <AddItems /> },
          { path: "categories", element: <AdminCategories /> },
          { path: "add-category", element: <AddCategory /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "users", element: <AdminUsers /> },
          { path: "*", element: <NotFound /> },
        ]
      }

    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>

          <RouterProvider router={router} />

        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)