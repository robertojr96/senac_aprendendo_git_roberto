// api.ts — funções de comunicação com a internet (Passos 18 e 20)

interface Depoimento {
  name: string;
  site: string;
  body: string;
}

export async function carregarDepoimentos(): Promise<Depoimento[]> {
  return [
    {
      name: "Mariana Silva",
      site: "www.lojasdemoda.com.br",
      body: "O site é muito fácil de navegar e o processo de compra foi super rápido. Recomendo para quem busca moda com entrega ágil.",
    },
    {
      name: "Carlos Pereira",
      site: "www.cursosonline.com.br",
      body: "A área do aluno é clara e o conteúdo funciona muito bem no celular. Consegui estudar no meu tempo sem dificuldades.",
    },
    {
      name: "Ana Souza",
      site: "www.supermercado24h.com.br",
      body: "Adorei o layout e a busca por produtos. O carrinho ficou organizado e o checkout foi simples de usar.",
    },
  ];
}

export async function enviarFormulario(
  nome: string,
  email: string,
  mensagem: string,
): Promise<Response> {
  const corpo = JSON.stringify({
    title: nome,
    body: mensagem,
    email: email,
    userId: 1,
  });
  const resposta = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: corpo,
  });
  return resposta;
}
