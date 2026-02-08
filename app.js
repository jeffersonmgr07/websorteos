const PRICE = 7.9;
const TOTAL = 100;

// simulación de vendidos
const soldNumbers = [2, 7, 15, 28, 39, 44, 63];

const grid = document.getElementById("numberGrid");
const selectedText = document.getElementById("selectedNumbers");
const totalPrice = document.getElementById("totalPrice");
const payBtn = document.getElementById("payBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const modal = document.getElementById("modal");
const modalSummary = document.getElementById("modalSummary");
const closeModal = document.getElementById("closeModal");

let selected = [];

function renderGrid() {
  for (let i = 1; i <= TOTAL; i++) {
    const el = document.createElement("div");
    el.textContent = i;
    el.className = "number";

    if (soldNumbers.includes(i)) {
      el.classList.add("sold");
    } else {
      el.onclick = () => toggleNumber(i, el);
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
  updateSummary();
}

function updateSummary() {
  selectedText.textContent = selected.length ? selected.join(", ") : "—";
  totalPrice.textContent = `S/ ${(selected.length * PRICE).toFixed(2)}`;
  payBtn.disabled = selected.length === 0;
}

function updateProgress() {
  const sold = soldNumbers.length;
  const percent = (sold / TOTAL) * 100;
  progressBar.style.width = percent + "%";
  progressText.textContent = `${sold} / ${TOTAL} números vendidos`;
}

payBtn.onclick = () => {
  modal.style.display = "flex";
  modalSummary.textContent =
    `Números: ${selected.join(", ")} — Total S/ ${(selected.length * PRICE).toFixed(2)}`;
};

closeModal.onclick = () => {
  modal.style.display = "none";
};

renderGrid();
