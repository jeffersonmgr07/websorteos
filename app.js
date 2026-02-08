const PRICE = 7.9;
const TOTAL = 100;

// simula números vendidos
const soldNumbers = [3, 7, 18, 22, 45, 60, 78];

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
    const btn = document.createElement("div");
    btn.textContent = i;
    btn.classList.add("number");

    if (soldNumbers.includes(i)) {
      btn.classList.add("sold");
    } else {
      btn.classList.add("available");
      btn.onclick = () => toggleNumber(i, btn);
    }

    grid.appendChild(btn);
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
  if (selected.length === 0) {
    selectedText.textContent = "Ninguno";
    payBtn.disabled = true;
  } else {
    selectedText.textContent = selected.join(", ");
    payBtn.disabled = false;
  }

  totalPrice.textContent = `S/ ${(selected.length * PRICE).toFixed(2)}`;
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
    `Números: ${selected.join(", ")} — Total: S/ ${(selected.length * PRICE).toFixed(2)}`;
};

closeModal.onclick = () => {
  modal.style.display = "none";
};

renderGrid();
