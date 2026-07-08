import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Household from "./pages/Household";
import Items from "./pages/Items";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/household" element={<Household />} />
        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
