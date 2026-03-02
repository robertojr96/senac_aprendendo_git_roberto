function calcularTotal() {
  const checkboxes = document.querySelectorAll('.item-produto');
  let total = 0;

  checkboxes.forEach(cb => {
    if (!cb) return;
    if (cb.checked) {
      const card = cb.closest('.card');
      const qtdInput = card ? card.querySelector('.qtd-produto') : null;
      const qtd = qtdInput ? Number(qtdInput.value) : 1;
      const price = parseFloat(cb.value) || 0;
      total += price * qtd;
    }
  });

  const out = document.getElementById('valor-total');
  if (out) {
    out.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  calcularTotal();
  const controls = document.querySelectorAll('.item-produto, .qtd-produto');
  controls.forEach(el => {
    el.addEventListener('change', calcularTotal);
    el.addEventListener('input', calcularTotal);
  });
});
