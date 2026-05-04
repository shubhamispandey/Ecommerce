import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import PageWrapper from "./app/Page";
import CartPage from "./components/CartPage";
import ProductDetail from "./components/ProductDetail";
import AuthPage from "./components/AuthPage";
import { store } from "./store/store";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<PageWrapper onNavigateToCart={() => navigate("/cart")} />}
      />
      <Route path="/cart" element={<CartPage onBack={() => navigate("/")} />} />
      <Route path="/product-item/:id" element={<ProductDetail />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
