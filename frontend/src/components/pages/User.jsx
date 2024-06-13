import React from 'react'
import Header from "../Header";
import UserSidebar from '../UserSidebar';
import MainContent from '../MainContent';
import Footer from '../Footer';
import { Toaster } from 'react-hot-toast';
function User() {
  return (
    <div className='flex flex-col h-screen'>
       <Header/>
      <div className="flex flex-1">
      <UserSidebar />
        {/* <SideBar themeClass={themeClass} transitionClass={transitionClass} /> */}
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