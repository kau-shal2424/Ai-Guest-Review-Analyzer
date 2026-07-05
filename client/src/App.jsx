import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Components from "./pages/Components";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Public / Non-Layout Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/components" element={<Components />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;