import { Routes, Route } from "react-router-dom";
import EcommerceHero from "./components/EcommerceHero";
import Register from "./pages/Register";
import Login from "./pages/login";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#2B8D8B] py-6 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Routes>
          <Route path="/" element={<EcommerceHero />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
// usuario marcos pass prueba  mi email y pass (123456789// 