const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const WHATSAPP_NUMBER = "51915161364";
const PLANS = {
  mensual:   { name: "Mensual",   price: 7.90 },
  trimestral:{ name: "Trimestral",price: 21.90 },
  anual:     { name: "Anual",     price: 80.90 },
};

let selectedPlanKey = "mensual";

function money(n){
  return "S/ " + Number(n || 0).toFixed(2);
}

function setStatus(type, msg){
  const box = $("#statusBox");
  box.className = "status show " + (type || "");
  box.textContent = msg;
}

function clearStatus(){
  const box = $("#statusBox");
  box.className = "status";
  box.textContent = "";
}

function openModal(id){
  const el = $("#" + id);
  if(!el) return;
  el.classList.add("show");
  el.setAttribute("aria-hidden", "false");
}

function closeModal(id){
  const el = $("#" + id);
  if(!el) return;
  el.classList.remove("show");
  el.setAttribute("aria-hidden", "true");
}

function safeDigits(str){ return String(str || "").replace(/\D+/g, ""); }

function validateDNI(dni){
  const d = safeDigits(dni);
  if(d.length !== 8) return { ok:false, msg:"El DNI debe tener 8 dígitos." };
  if(/^(\d)\1+$/.test(d)) return { ok:false, msg:"El DNI no puede ser repetido (ej: 11111111)." };
  return { ok:true };
}

function validatePhone(phone){
  const digits = safeDigits(String(phone || "").trim());
  if(digits.length < 9) return { ok:false, msg:"WhatsApp inválido. Ingresa al menos 9 dígitos." };
  return { ok:true };
}

function validateEmail(email){
  const e = String(email || "").trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  return ok ? { ok:true } : { ok:false, msg:"Correo inválido." };
}

/* ===== FX ===== */
function createExplosion(x, y){
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  const colors = ["#ff3aa6","#00e5ff","#7c4dff","#ffd166","#2ef2a6","#ff5a7a"];
  for(let i=0;i<14;i++){
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    const dx = (Math.random() - 0.5) * 140;
    const dy = (Math.random() - 0.5) * 140;
    particle.style.setProperty("--dx", dx.toFixed(1) + "px");
    particle.style.setProperty("--dy", dy.toFixed(1) + "px");
    explosion.appendChild(particle);
  }
  explosion.style.left = x + "px";
  explosion.style.top  = y + "px";
  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 900);
}

function flyTo(targetEl, fromEl){
  if(!targetEl || !fromEl) return;

  const b1 = fromEl.getBoundingClientRect();
  const b2 = targetEl.getBoundingClientRect();
  const startX = b1.left + b1.width/2;
  const startY = b1.top + b1.height/2;
  const endX   = b2.left + b2.width/2;
  const endY   = b2.top + b2.height/2;

  const dot = document.createElement("div");
  dot.className = "fly-dot";
  dot.style.left = startX + "px";
  dot.style.top  = startY + "px";
  document.body.appendChild(dot);

  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 120;

  dot.animate([
    { transform:"translate(-50%,-50%) scale(1)", left:startX+"px", top:startY+"px", opacity:1 },
    { transform:"translate(-50%,-50%) scale(1.2)", left:midX+"px", top:midY+"px", opacity:1 }
  ], { duration: 320, easing:"cubic-bezier(.2,.9,.2,1)" });

  const anim2 = dot.animate([
    { transform:"translate(-50%,-50%) scale(1.2)", left:midX+"px", top:midY+"px", opacity:1 },
    { transform:"translate(-50%,-50%) scale(.6)", left:endX+"px", top:endY+"px", opacity:.9 }
  ], { duration: 380, delay: 260, easing:"cubic-bezier(.2,.9,.2,1)" });

  anim2.onfinish = () => dot.remove();
}

/* ===== Countdown (20 Marzo - Lima referencial) ===== */
function getLimaTarget(){
  const now = new Date();
  const year = now.getFullYear();
  // Referencial: 20 Marzo 20:00 Lima ~ 21 Marzo 01:00 UTC
  const targetUTC = Date.UTC(year, 2, 21, 1, 0, 0);
  const t = new Date(targetUTC);
  if(now.getTime() > t.getTime()){
    return new Date(Date.UTC(year + 1, 2, 21, 1, 0, 0));
  }
  return t;
}

function tickCountdown(){
  const target = getLimaTarget();
  const now = new Date();
  let diff = Math.max(0, target.getTime() - now.getTime());

  const d = Math.floor(diff / (1000*60*60*24)); diff -= d*(1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60)); diff -= h*(1000*60*60);
  const m = Math.floor(diff / (1000*60)); diff -= m*(1000*60);
  const s = Math.floor(diff / 1000);

  $("#cdDays").textContent = String(d);
  $("#cdHours").textContent = String(h).padStart(2,"0");
  $("#cdMins").textContent = String(m).padStart(2,"0");
  $("#cdSecs").textContent = String(s).padStart(2,"0");

  if($("#feedD")){
    $("#feedD").textContent = String(d);
    $("#feedH").textContent = String(h).padStart(2,"0");
    $("#feedM").textContent = String(m).padStart(2,"0");
    $("#feedS").textContent = String(s).padStart(2,"0");
  }
}

/* ===== Suscripción ===== */
function setPlan(planKey){
  selectedPlanKey = planKey in PLANS ? planKey : "mensual";
  const p = PLANS[selectedPlanKey];
  $("#subPlanLine").textContent = `Plan: ${p.name} — ${money(p.price)}`;
}

function resetSubFlow(){
  clearStatus();
}

function openSubscribe(planKey, triggerEl){
  setPlan(planKey);
  resetSubFlow();
  openModal("subModal");

  if(triggerEl){
    const rect = triggerEl.getBoundingClientRect();
    createExplosion(rect.left + rect.width/2, rect.top + rect.height/2);
    flyTo($("#waFloat"), triggerEl);
  }
}

function canContinue(){
  const nombres = $("#nombres").value.trim();
  const apellidos = $("#apellidos").value.trim();
  const whatsapp = $("#whatsapp").value.trim();
  const dni = $("#dni").value.trim();
  const correo = $("#correo").value.trim();

  if(!nombres || !apellidos) return { ok:false, msg:"Completa nombres y apellidos." };

  const pOk = validatePhone(whatsapp);
  if(!pOk.ok) return { ok:false, msg:pOk.msg };

  const dOk = validateDNI(dni);
  if(!dOk.ok) return { ok:false, msg:dOk.msg };

  const eOk = validateEmail(correo);
  if(!eOk.ok) return { ok:false, msg:eOk.msg };

  return { ok:true };
}

function buildWhatsAppMessage(){
  const p = PLANS[selectedPlanKey];
  const nombres = $("#nombres").value.trim();
  const apellidos = $("#apellidos").value.trim();
  const whatsapp = $("#whatsapp").value.trim();
  const dni = $("#dni").value.trim();
  const correo = $("#correo").value.trim();

  const lines = [
    `Hola JudithAlva.com 👋`,
    `Quiero suscribirme al plan: ${p.name} (${money(p.price)})`,
    ``,
    `Datos:`,
    `- Nombres: ${nombres}`,
    `- Apellidos: ${apellidos}`,
    `- WhatsApp: ${whatsapp}`,
    `- DNI: ${dni}`,
    `- Correo: ${correo}`,
    ``,
    `Sorteo principal: PlayStation 5 (20 de marzo)`,
    `Transmisión: Facebook Live y TikTok Live`,
  ];

  return encodeURIComponent(lines.join("\n"));
}

/* ===== Init ===== */
function initEvents(){
  $("#year").textContent = String(new Date().getFullYear());

  tickCountdown();
  setInterval(tickCountdown, 1000);

  // Auth
  $("#openAuth").addEventListener("click", () => openModal("authModal"));
  $$("[data-close='authModal']").forEach(b => b.addEventListener("click", () => closeModal("authModal")));

  // Close modals by clicking backdrop
  $$("#authModal, #subModal").forEach(mod => {
    mod.addEventListener("click", (e) => {
      if(e.target === mod){
        mod.classList.remove("show");
        mod.setAttribute("aria-hidden","true");
      }
    });
  });
  $$("[data-close='subModal']").forEach(b => b.addEventListener("click", () => closeModal("subModal")));

  // Carousel
  $("#prizeLeft")?.addEventListener("click", () => $("#prizeCarousel").scrollBy({left:-360, behavior:"smooth"}));
  $("#prizeRight")?.addEventListener("click", () => $("#prizeCarousel").scrollBy({left:360, behavior:"smooth"}));

  // Open subscribe from plans
  $$("[data-subscribe]").forEach(btn => {
    btn.addEventListener("click", () => {
      const planKey = btn.getAttribute("data-subscribe");
      openSubscribe(planKey, btn);
    });
  });

  // Open subscribe from prizes
  $$("[data-open-plan]").forEach(btn => {
    btn.addEventListener("click", () => {
      const planKey = btn.getAttribute("data-open-plan");
      openSubscribe(planKey, btn);
    });
  });

  // Live validation (optional)
  ["nombres","apellidos","whatsapp","dni","correo"].forEach(id => {
    $("#" + id).addEventListener("input", () => {
      const ok = canContinue();
      if(ok.ok) clearStatus();
    });
  });

  // Continue to WhatsApp (FIX con fallback)
  $("#continueBtn").addEventListener("click", () => {
    const ok = canContinue();
    if(!ok.ok){
      setStatus("bad", ok.msg);
      return;
    }

    const msg = buildWhatsAppMessage();

    // Usa api.whatsapp.com (muy compatible) — puedes cambiar a wa.me si prefieres
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`;

    // Animación final
    const btn = $("#continueBtn");
    const rect = btn.getBoundingClientRect();
    createExplosion(rect.left + rect.width/2, rect.top + rect.height/2);
    flyTo($("#waFloat"), btn);

    // Intento 1: popup
    const win = window.open(url, "_blank");

    // Fallback: si el navegador bloquea popups
    if(!win){
      window.location.href = url;
    }
  });

  // Mobile nav active
  $$(".mobile-nav a").forEach(a => {
    a.addEventListener("click", () => {
      $$(".mobile-nav a").forEach(x => x.classList.remove("active"));
      a.classList.add("active");
    });
  });

  // Sidebar active (simple)
  $$(".side .ico").forEach(a => {
    a.addEventListener("click", () => {
      $$(".side .ico").forEach(x => x.classList.remove("active"));
      a.classList.add("active");
    });
  });
}

initEvents();
