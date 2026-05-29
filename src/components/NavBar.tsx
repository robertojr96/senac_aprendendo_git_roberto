import { NavLink } from "react-router-dom";

type NavBarProps = {
  totalQuantity: number;
  theme: string;
  onThemeChange: (theme: string) => void;
};

const themes = [
  { id: "default", label: "Padrão" },
  { id: "tema-warm", label: "Quente" },
  { id: "tema-cool", label: "Fresco" },
  { id: "tema-nature", label: "Natureza" },
  { id: "tema-tech", label: "Tecnologia" },
  { id: "tema-dark", label: "Escuro" },
];

const NavBar = ({ totalQuantity, theme, onThemeChange }: NavBarProps) => {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Meu Projeto
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/produtos">
                Produtos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contato">
                Contato
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="themeDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                Temas
              </button>
              <ul className="dropdown-menu" aria-labelledby="themeDropdown">
                {themes.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => onThemeChange(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <NavLink to="/produtos" className="btn btn-outline-primary ms-3">
              <span className="me-2">🛒</span>
              Carrinho <span className="badge bg-danger ms-2">{totalQuantity}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
