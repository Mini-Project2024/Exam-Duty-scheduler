import React from 'react'
import Header from "../Header";
import UserSidebar from '../UserSidebar';
function User() {
  return (
    <div>
       <Header
        // toggleTheme={toggleTheme}
        // isDarkTheme={isDarkTheme}
        // themeClass={themeClass}
        // transitionClass={transitionClass}
        // buttonThemeClass={buttonThemeClass}
      />
      <UserSidebar />
      
    </div>
  )
}

export default User;