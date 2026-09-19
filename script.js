// ====== EDIT THESE ======
const WHATSAPP_NUMBER = "2340000000000"; // country code + number, digits only
const CURRENCY = "₦";
const CAKES = [
  { id: 1, name: "Chocolate Fudge",  emoji: "🍫", price: 15000, desc: "Rich chocolate sponge with fudge frosting." },
  { id: 2, name: "Vanilla Berry",    emoji: "🍓", price: 14000, desc: "Light vanilla layers with strawberry cream." },
  { id: 3, name: "Red Velvet",       emoji: "❤️", price: 16000, desc: "Classic red velvet with cream cheese icing." },
  { id: 4, name: "Lemon Drizzle",    emoji: "🍋", price: 12000, desc: "Zesty lemon cake with a sweet glaze." },
  { id: 5, name: "Carrot & Walnut",  emoji: "🥕", price: 13000, desc: "Moist spiced carrot cake with walnuts." },
  { id: 6, name: "Cupcakes (box of 6)", emoji: "🧁", price: 8000, desc: "Six cupcakes in mixed flavours." }
];
// ========================

const cart = {};
const fmt = n => CURRENCY + n.toLocaleString();

document.getElementById("cakes").innerHTML = CAKES.map(c => `
  <article class="cake">
    <div class="pic" aria-hidden="true">${c.emoji}</div>
    <div class="info">
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <span class="price">${fmt(c.price)}</span>
      <button data-add="${c.id}">Add to order</button>
    </div>
  </article>`).join("");

function render() {
  const ids = Object.keys(cart);
  document.getElementById("cart").innerHTML = ids.length
    ? ids.map(id => {
        const c = CAKES.find(x => x.id == id);
        return `<li><span>${c.name}</span>
          <span class="qty"><button data-dec="${id}" aria-label="Remove one ${c.name}">−</button>
          <span>${cart[id]}</span>
          <button data-add="${id}" aria-label="Add one ${c.name}">+</button></span></li>`;
      }).join("")
    : '<li class="empty">Your cart is empty. Add a cake to start.</li>';
  document.getElementById("total").textContent = fmt(total());
}
const total = () => Object.keys(cart).reduce((s, id) => s + CAKES.find(c => c.id == id).price * cart[id], 0);

document.addEventListener("click", e => {
  const add = e.target.dataset.add, dec = e.target.dataset.dec;
  if (add) cart[add] = (cart[add] || 0) + 1;
  if (dec && --cart[dec] <= 0) delete cart[dec];
  if (add || dec) render();
});

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!Object.keys(cart).length) return alert("Add at least one cake to your order.");
  const f = new FormData(e.target);
  const lines = Object.keys(cart).map(id => {
    const c = CAKES.find(x => x.id == id);
    return `- ${cart[id]} x ${c.name} (${fmt(c.price * cart[id])})`;
  });
  const text = [
    "New cake order", ...lines, `Total: ${fmt(total())}`, "",
    `Name: ${f.get("name")}`, `Phone: ${f.get("phone")}`, `Date: ${f.get("date")}`,
    `Delivery: ${f.get("address") || "Pickup"}`,
    f.get("message") ? `Cake message: ${f.get("message")}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});

render();
