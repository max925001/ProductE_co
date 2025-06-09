import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import { useSelector } from 'react-redux'
import ProductPage from './pages/ProductPage'

function App() {
const {data} = useSelector((state) => state.auth);

  return (
    <Routes>
<Route path='/' element={data ? <HomePage /> : <Navigate to='/login' />}/>
<Route path='/product/:id' element={data ? <ProductPage /> : <Navigate to='/login' />}/>
<Route path='/login' element={<LoginPage />} />



    </Routes>
  )
}

export default App
