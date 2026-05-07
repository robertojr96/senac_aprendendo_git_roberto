// main.ts — arquivo principal: importa módulos e registra Event Listeners (Passo 21)

import "./scss/style.scss";
import { carregarDepoimentos, enviarFormulario } from "./api";
import {
  renderizarDepoimentos,
  exibirAlertaForm,
  preencherEndereco,
} from "./ui";

// Passo 18: carregar depoimentos na home
const listaDepoimentos = document.getElementById("lista-depoimentos");
if (listaDepoimentos) {
  carregarDepoimentos()
    .then((dados) => renderizarDepoimentos(dados))
    .catch(() => {
      listaDepoimentos.innerHTML =
        "<p>Não foi possível carregar os depoimentos.</p>";
    });
}

// Passo 20: envio do formulário de contato via POST
const btnEnviar = document.getElementById(
  "btn-enviar",
) as HTMLButtonElement | null;
// Busca de endereço pelo CEP
const campoCep = document.getElementById(
  "campo-cep",
) as HTMLInputElement | null;
if (campoCep) {
  campoCep.addEventListener("input", async () => {
    const cep = campoCep.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (!dados.erro) {
      preencherEndereco(dados);
    }
  });
}
if (btnEnviar) {
  btnEnviar.addEventListener("click", async () => {
    const nome = (document.getElementById("campo-nome") as HTMLInputElement)
      .value;
    const email = (document.getElementById("campo-email") as HTMLInputElement)
      .value;
    const mensagem = (
      document.getElementById("campo-mensagem") as HTMLTextAreaElement
    ).value;
    const feedbackContainer = document.getElementById("feedback-form");

    try {
      const resposta = await enviarFormulario(nome, email, mensagem);
      exibirAlertaForm(resposta.status === 201, feedbackContainer);
    } catch {
      exibirAlertaForm(false, feedbackContainer);
    }
  });
}

// Troca de temas
document.querySelectorAll<HTMLElement>("[data-theme]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const theme = (e.target as HTMLElement).getAttribute("data-theme");
    document.body.className = theme === "default" ? "" : theme || "";
  });
});
