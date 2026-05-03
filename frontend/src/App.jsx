
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import PageWrapper from './app/Page'
import CartPage from './components/CartPage'
import ProductDetail from './components/ProductDetail'

function AppRoutes() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={<PageWrapper onNavigateToCart={() => navigate('/cart')} />} />
      <Route path="/cart" element={<CartPage onBack={() => navigate('/')} />} />
      <Route path="/product-item" element={<ProductDetail />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
