const PRICE = 7.9;
const TOTAL = 100;

// ✅ Aquí pones los números vendidos manualmente (luego lo conectamos a backend)
const soldNumbers = [2, 7, 15, 28, 39, 44, 63];

const grid = document.getElementById("numberGrid");
const selectedText = document.getElementById("selectedNumbers");
const totalPriceEl = document.getElementById("totalPrice");
const payBtn = document.getElementById("payBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let selected = [];

function renderGrid() {
  grid.innerHTML = "";
  for (let i = 1; i <= TOTAL; i++) {
    const el = document.createElement("div");
    el.textContent = String(i).padStart(2, "0");
    el.className = "number";

    if (soldNumbers.includes(i)) {
      el.classList.add("sold");
      el.title = "Vendido";
    } else {
      el.onclick = () => toggleNumber(i, el);
      el.title = "Disponible";
    }

    grid.appendChild(el);
  }
  updateProgress();
}

function toggleNumber(num, el) {
  if (selected.includes(num)) {
    selected = selected.filter(n => n !== num);
    el.classList.remove("selected");
  } else {
    selected.push(num);
    el.classList.add("selected");
  }
  selected.sort((a,b) => a-b);
  updateSummary();
}

function updateSummary() {
  if (!selected.length) {
    selectedText.textContent = "—";
    payBtn.disabled = true;
  } else {
    selectedText.textContent = selected.map(n => String(n).padStart(2, "0")).join(", ");
    payBtn.disabled = false;
  }

  const total = selected.length * PRICE;
  totalPriceEl.textContent = `S/ ${total.toFixed(2)}`;
}

function updateProgress() {
  const sold = soldNumbers.length;
  const percent = (sold / TOTAL) * 100;
  progressBar.style.width = percent + "%";
  progressText.textContent = `${sold} / ${TOTAL} números vendidos`;
}

function openWhatsAppCheckout() {
  if (!selected.length) return;

  const nums = selected.map(n => String(n).padStart(2, "0")).join(", ");
  const total = (selected.length * PRICE).toFixed(2);

  const phone = "51940463632"; // sin +
  const message = `Hola quiero comprar los números: ${nums}. El monto a pagar es: S/ ${total}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

payBtn.addEventListener("click", openWhatsAppCheckout);

renderGrid();
updateSummary();
