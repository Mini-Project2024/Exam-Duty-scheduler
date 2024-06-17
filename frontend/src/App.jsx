import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/pages/Index";
import Main from "./components/Main";
import User from "./components/User";
import { UserProvider } from './components/pages/UserContext';
const App = () => {
  return (
    <UserProvider> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/users/*" element={<User/>} />
        <Route path="/main/*" element={<Main />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );

};

export default App;
