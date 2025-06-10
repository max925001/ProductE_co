import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import { useSelector } from 'react-redux'
import ProductPage from './pages/ProductPage'
import DashboardPage from './pages/DashboardPage'
import EditDeleteProductsPage from './pages/EditDeleteProductsPage'
import PrivateRoute from './components/PrivateRoute'
import AddNewProduct from './pages/AddNewProduct'
import UnauthorizedPage from './pages/UnauthorizedPage'

function App() {
const {data} = useSelector((state) => state.auth);

  return (
    <Routes>
<Route path='/' element={data ? <HomePage /> : <Navigate to='/login' />}/>
<Route path='/product/:id' element={data ? <ProductPage /> : <Navigate to='/login' />}/>
<Route path='/login' element={<LoginPage />} />
<Route element={<PrivateRoute requireAdmin={true} />}>
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/add-product" element={<AddNewProduct />} />
<Route path="/edit-delete-products" element={<EditDeleteProductsPage />} />
</Route>
<Route path="/unauthorized" element={<UnauthorizedPage />} />




    </Routes>
  )
}

export default App
