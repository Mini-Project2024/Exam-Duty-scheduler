import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/pages/Index";
import Main from "./components/Main";
import User from "./components/User";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/users" element={<User/>} />
        <Route path="/main/*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
