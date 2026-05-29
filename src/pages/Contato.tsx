import { ChangeEvent, useState } from "react";
import { enviarFormulario } from "../api";

const Contato = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [status, setStatus] = useState<"success" | "danger" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const valor = event.target.value;
    const cep = valor.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, cep: valor }));

    if (cep.length !== 8) return;

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();

      if (!dados.erro) {
        setForm((prev) => ({
          ...prev,
          rua: dados.logradouro || "",
          bairro: dados.bairro || "",
          cidade: dados.localidade || "",
          estado: dados.uf || "",
        }));
      }
    } catch {
      // ignore error, leave existing values
    }
  };

  const handleSubmit = async () => {
    setSending(true);
    setStatus(null);
    setFeedback("");

    try {
      const resposta = await enviarFormulario(form.nome, form.email, form.mensagem);
      if (resposta.ok) {
        setStatus("success");
        setFeedback("Mensagem enviada com sucesso!");
        setForm({
          nome: "",
          email: "",
          mensagem: "",
          cep: "",
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
        });
      } else {
        setStatus("danger");
        setFeedback("Erro ao enviar. Tente novamente.");
      }
    } catch {
      setStatus("danger");
      setFeedback("Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container mt-5">
      <h2 className="mb-4">Contato</h2>

      {status && (
        <div className={`alert alert-${status}`} role="alert">
          {feedback}
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="campo-nome" className="form-label">
            Nome
          </label>
          <input
            id="campo-nome"
            name="nome"
            type="text"
            className="form-control"
            placeholder="Fulano de Tal"
            value={form.nome}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-email" className="form-label">
            Email
          </label>
          <input
            id="campo-email"
            name="email"
            type="email"
            className="form-control"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-mensagem" className="form-label">
            Mensagem
          </label>
          <textarea
            id="campo-mensagem"
            name="mensagem"
            className="form-control"
            rows={3}
            value={form.mensagem}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-cep" className="form-label">
            CEP
          </label>
          <input
            id="campo-cep"
            name="cep"
            type="text"
            className="form-control"
            placeholder="00000-000"
            value={form.cep}
            onChange={handleCepChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-rua" className="form-label">
            Rua
          </label>
          <input
            id="campo-rua"
            name="rua"
            type="text"
            className="form-control"
            placeholder="Rua das Flores"
            value={form.rua}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-bairro" className="form-label">
            Bairro
          </label>
          <input
            id="campo-bairro"
            name="bairro"
            type="text"
            className="form-control"
            placeholder="Centro"
            value={form.bairro}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-cidade" className="form-label">
            Cidade
          </label>
          <input
            id="campo-cidade"
            name="cidade"
            type="text"
            className="form-control"
            placeholder="São Paulo"
            value={form.cidade}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="campo-estado" className="form-label">
            Estado
          </label>
          <input
            id="campo-estado"
            name="estado"
            type="text"
            className="form-control"
            placeholder="SP"
            value={form.estado}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary mt-4"
        onClick={handleSubmit}
        disabled={sending}
      >
        {sending ? "Enviando..." : "Enviar"}
      </button>
    </main>
  );
};

export default Contato;
