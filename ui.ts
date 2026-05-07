// ui.ts — manipulação do DOM (Passos 17, 18, 20)

interface Depoimento {
  name: string;
  site: string;
  body: string;
}

export function renderizarDepoimentos(dados: Depoimento[]): void {
  const container = document.getElementById("lista-depoimentos");
  if (!container) return;
  container.innerHTML = dados
    .map(
      (item) => `
    <div class="col-md-4 mb-3">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${item.site}</h6>
          <p class="card-text">${item.body}</p>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

export function exibirAlertaForm(
  sucesso: boolean,
  container: HTMLElement | null,
): void {
  if (!container) return;
  container.innerHTML = sucesso
    ? `<div class="alert alert-success">Mensagem enviada com sucesso!</div>`
    : `<div class="alert alert-danger">Erro ao enviar. Tente novamente.</div>`;
}

interface Endereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export function preencherEndereco(dados: Endereco): void {
  (document.getElementById("campo-rua") as HTMLInputElement).value =
    dados.logradouro;
  (document.getElementById("campo-bairro") as HTMLInputElement).value =
    dados.bairro;
  (document.getElementById("campo-cidade") as HTMLInputElement).value =
    dados.localidade;
  (document.getElementById("campo-estado") as HTMLInputElement).value =
    dados.uf;
}
