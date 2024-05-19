import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useStateContext } from '../context/stateContext'
import { useNavigate } from 'react-router-dom'


function MainLayout({ children }) {
  const { setAlert, currentUser, userAvailable } = useStateContext()
  const navigate = useNavigate()
    useEffect(() => {
        if (userAvailable === false || !currentUser) {
          setAlert({ isShow: true, message: "User not found", duration: 3000, type: "error" })
          navigate("/login")
        }
    }, [userAvailable, currentUser])
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}

export default MainLayout