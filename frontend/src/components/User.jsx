import React from 'react'
import Header from "./Header";
import UserSidebar from './UserSidebar';
import Footer from './Footer'
import MainContent from './MainContent';
import { Toaster } from 'react-hot-toast';
function User() {
  return (
<<<<<<< HEAD
    
      <div
      className="flex flex-col h-screen">
=======
    <div className='flex flex-col h-screen'>
>>>>>>> 038ddd3ffafa0abfb084f5f6c5ddbaa30ff3c848
       <Header/>
      
      <div className="flex flex-1">
      <UserSidebar />
        <div className="flex flex-col flex-1">
          <MainContent />
          <Footer />
          <Toaster />
        </div>
      </div>
    </div>
  )
}

export default User;