import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ChatBot from "./components/ChatBot.jsx";
import Home from "./pages/Home.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import Studio from "./pages/Studio.jsx";
import CraftExplorer from "./pages/CraftExplorer.jsx";
import Customiser from "./pages/Customiser.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Orders from "./pages/Orders.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/craft-explorer" element={<CraftExplorer />} />
          <Route path="/customiser" element={<Customiser />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
      <footer className="bg-maroon-900 text-maroon-100 py-8 text-center text-sm">
        <p className="font-display text-lg text-gold-400">KraftWear</p>
        <p className="mt-1 opacity-80">
          South Indian Ethnic Wear + AI Craft Studio · Phase 1 (catalogue &
          visualisation)
        </p>
      </footer>
      <ChatBot />
    </div>
  );
}
