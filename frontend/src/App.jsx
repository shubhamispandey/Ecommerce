
import './App.css'
import { useState } from 'react'
import PageWrapper from './app/Page'
import CartPage from './components/CartPage'

function App() {
  const [showCart, setShowCart] = useState(false)

  return (
    <>
      {showCart ? (
        <CartPage onBack={() => setShowCart(false)} />
      ) : (
        <PageWrapper onNavigateToCart={() => setShowCart(true)} />
      )}
    </>
  )
}

export default App
