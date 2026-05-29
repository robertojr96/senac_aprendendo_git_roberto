import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Contato from "./pages/Contato";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Produtos from "./pages/Produtos";
import { CartState } from "./types";

const App = () => {
  const [theme, setTheme] = useState("default");
  const [cartState, setCartState] = useState<CartState>({});

  useEffect(() => {
    document.body.className = theme === "default" ? "" : theme;
  }, [theme]);

  const totalQuantity = useMemo(
    () => Object.values(cartState).reduce((sum, value) => sum + value, 0),
    [cartState],
  );

  return (
    <>
      <NavBar totalQuantity={totalQuantity} theme={theme} onThemeChange={setTheme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/produtos"
          element={<Produtos cartState={cartState} setCartState={setCartState} />}
        />
        <Route path="/contato" element={<Contato />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
