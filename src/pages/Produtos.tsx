import { Dispatch, SetStateAction } from "react";
import { products } from "../data/products";
import { CartState, Product } from "../types";

type ProdutosProps = {
  cartState: CartState;
  setCartState: Dispatch<SetStateAction<CartState>>;
};

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Produtos = ({ cartState, setCartState }: ProdutosProps) => {
  const handleSelect = (product: Product, checked: boolean) => {
    setCartState((prev) => {
      const next = { ...prev };
      if (checked) {
        next[product.id] = prev[product.id] || 1;
      } else {
        delete next[product.id];
      }
      return next;
    });
  };

  const handleQuantity = (product: Product, value: number) => {
    setCartState((prev) => {
      if (!prev[product.id]) return prev;
      return { ...prev, [product.id]: value };
    });
  };

  const cartItems = products
    .filter((product) => Boolean(cartState[product.id]))
    .map((product) => ({
      product,
      qtd: cartState[product.id] || 1,
      subtotal: product.price * (cartState[product.id] || 1),
    }));

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <main className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Produtos</h2>
          <p>Selecione os produtos e veja o resumo do carrinho.</p>
        </div>
        <button
          className="btn btn-outline-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#cartOffcanvas"
          aria-controls="cartOffcanvas"
        >
          Ver carrinho ({cartItems.length})
        </button>
      </div>

      <div className="row gy-4">
        {products.map((product) => {
          const selected = Boolean(cartState[product.id]);
          const quantidade = cartState[product.id] || 1;

          return (
            <div key={product.id} className="col-md-4">
              <div className="card" style={{ width: "100%" }}>
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>

                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`item-${product.id}`}
                      checked={selected}
                      onChange={(event) => handleSelect(product, event.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`item-${product.id}`}>
                      Selecionar (R$ {formatPrice(product.price)})
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Quantidade</label>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      value={quantidade}
                      disabled={!selected}
                      onChange={(event) => {
                        const value = Math.max(1, Number(event.target.value) || 1);
                        handleQuantity(product, value);
                      }}
                    />
                  </div>

                  <button className="btn btn-primary" disabled={!selected}>
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="container mt-5">
        <div className="alert alert-info text-center">
          <h4>
            Valor Total: R$ {formatPrice(total)}
          </h4>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            Carrinho de Compras
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Fechar"
          />
        </div>
        <div className="offcanvas-body">
          <div id="cart-summary">
            {cartItems.length === 0 ? (
              <p>Nenhum produto selecionado ainda.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="mb-3">
                  <strong>{item.product.title}</strong>
                  <br />
                  {item.qtd} x R$ {formatPrice(item.product.price)} = R$ {formatPrice(item.subtotal)}
                </div>
              ))
            )}
          </div>
          <div className="mt-3">
            <strong>Total: R$ {formatPrice(total)}</strong>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Produtos;
