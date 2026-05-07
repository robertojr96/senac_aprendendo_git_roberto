interface CartItem {
  title: string;
  qtd: number;
  price: number;
  subtotal: number;
}

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function atualizarCarrinho(): void {
  const checkboxes =
    document.querySelectorAll<HTMLInputElement>(".item-produto");
  let total = 0;
  let quantidadeTotal = 0;
  const carrinho: CartItem[] = [];

  checkboxes.forEach((cb) => {
    if (!cb || !cb.checked) return;
    const card = cb.closest(".card");
    const qtdInput = card
      ? card.querySelector<HTMLInputElement>(".qtd-produto")
      : null;
    const qtd = qtdInput ? Number(qtdInput.value) || 1 : 1;
    const price = parseFloat(cb.value) || 0;
    const title = card
      ? (card.querySelector(".card-title") as HTMLElement)?.textContent ||
        "Produto"
      : "Produto";
    const subtotal = price * qtd;
    total += subtotal;
    quantidadeTotal += qtd;
    carrinho.push({ title, qtd, price, subtotal });
  });

  const outTotal = document.getElementById("valor-total");
  const badge = document.getElementById("cart-badge");
  const summary = document.getElementById("cart-summary");
  const summaryTotal = document.getElementById("cart-total-summary");

  if (outTotal) {
    outTotal.textContent = formatarPreco(total);
  }
  if (badge) {
    badge.textContent = quantidadeTotal.toString();
  }
  if (summary) {
    if (carrinho.length === 0) {
      summary.innerHTML = "<p>Nenhum produto selecionado ainda.</p>";
    } else {
      summary.innerHTML = carrinho
        .map(
          (item) => `
          <div class="mb-3">
            <strong>${item.title}</strong><br>
            ${item.qtd} x R$ ${formatarPreco(item.price)} = R$ ${formatarPreco(
              item.subtotal,
            )}
          </div>
        `,
        )
        .join("");
    }
  }
  if (summaryTotal) {
    summaryTotal.textContent = formatarPreco(total);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarCarrinho();
  const controls = document.querySelectorAll<HTMLInputElement>(
    ".item-produto, .qtd-produto",
  );
  controls.forEach((el) => {
    el.addEventListener("change", atualizarCarrinho);
    el.addEventListener("input", atualizarCarrinho);
  });
});
