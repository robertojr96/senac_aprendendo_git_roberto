import { useEffect, useState } from "react";
import { carregarDepoimentos } from "../api";
import { Depoimento } from "../types";

const Home = () => {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDepoimentos()
      .then(setDepoimentos)
      .catch(() => setDepoimentos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container mt-5">
      <div className="py-5 text-center">
        <h1>Bem-vindo ao nosso site</h1>
        <p className="lead">
          Explore produtos, fale conosco e confira o que nossos clientes têm a
          dizer.
        </p>
      </div>

      <section className="mb-5">
        <h2>O que nossos clientes dizem</h2>
        {loading ? (
          <p>Carregando depoimentos...</p>
        ) : depoimentos.length === 0 ? (
          <p>Não foi possível carregar os depoimentos.</p>
        ) : (
          <div className="row">
            {depoimentos.map((item) => (
              <div key={item.name} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {item.site}
                    </h6>
                    <p className="card-text">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
