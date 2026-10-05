/* OMVIRO — frontend interactions
   Contact form is frontend-only. Set CONTACT_EMAIL below or connect a backend/form service. */
const CONTACT_EMAIL = ""; // Example: "hello@yourdomain.com" — replace with a real, monitored inbox.

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

// Service/academy links can prefill the contact topic for convenience.
document.querySelectorAll("[data-service], [data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = document.querySelector("#interest");
    const requested = link.dataset.service || link.dataset.interest;
    if (!select) return;
    const options = [...select.options];
    const match = options.find((option) => option.text.toLowerCase().includes(requested.toLowerCase()));
    if (match) select.value = match.value;
    else if (requested.toLowerCase().includes("academy")) select.value = "Omviro Academy updates";
  });
});

const form = document.querySelector("#contactForm");
const feedback = document.querySelector("#formFeedback");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const interest = String(data.get("interest") || "").trim();
  const message = String(data.get("message") || "").trim();

  // Avoid silently claiming a message was sent. If no email is configured,
  // show a clear setup notice and keep the user's entered data in the form.
  if (!CONTACT_EMAIL) {
    feedback.textContent = "Demo mode: the form is validated, but no message has been sent. Configure CONTACT_EMAIL in script.js or connect a backend form service.";
    return;
  }

  const subject = encodeURIComponent(`Omviro inquiry: ${interest}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`);
  feedback.textContent = "Opening your email app. Please review and send the message there.";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});


/* LOCAL DEMO STORE, CART, CUSTOMER SESSION & ADMIN ORDER VIEW.
   Do not use this client-side demo for real accounts or sensitive customer data. */
const CART_KEY = "omviro_demo_cart_v1";
const ORDERS_KEY = "omviro_demo_orders_v1";
const SESSION_KEY = "omviro_demo_session_v1";
// Static QR supplied by the owner is shown at checkout. Confirm the amount in your UPI app before paying. Never collect/store a UPI PIN.
const OMVIRO_UPI_ID = "Use the uploaded Omviro QR";
const OMVIRO_PAYEE_NAME = "Omviro";
const cartDialog = document.querySelector("#cartDialog");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const accountOutput = document.querySelector("#accountOutput");
const readStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let cart = readStore(CART_KEY, []);
const money = (n) => n ? "₹" + Number(n).toLocaleString("en-IN") : "Quote required";
function renderCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartItems.innerHTML = cart.length ? cart.map((item, i) => `<div class="cart-row"><div><strong>${escapeHTML(item.name)}</strong><small>${money(item.price)}</small></div><div class="cart-qty"><button type="button" data-cart-minus="${i}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-cart-plus="${i}" aria-label="Increase quantity">+</button><button type="button" data-cart-remove="${i}" aria-label="Remove item">×</button></div></div>`).join("") : '<p class="form-note">Your cart is empty. Add a service or product above.</p>';
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.querySelector("#cartTotal").textContent = "Estimated total: " + money(total);
  const paymentAmount = document.querySelector("#paymentAmount");
  const paymentQr = document.querySelector("#paymentQr");
  const upiLabel = document.querySelector("#paymentUpiLabel");
  if (paymentAmount) paymentAmount.textContent = money(total);
  if (upiLabel) upiLabel.textContent = OMVIRO_UPI_ID;
  if (paymentQr && total > 0) {
    paymentQr.src = "assets/omviro-payment-qr.jpeg";
    paymentQr.alt = "Omviro UPI payment QR supplied by the owner. Check the amount in your UPI app before paying.";
    paymentQr.hidden = false;
  } else if (paymentQr) {
    paymentQr.removeAttribute("src"); paymentQr.hidden = true;
  }
  const copyButton = document.querySelector("#copyUpi");
  if (copyButton) copyButton.hidden = true;
  if (upiLabel) upiLabel.textContent = "Scan the Omviro QR";
  writeStore(CART_KEY, cart);
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c])); }
document.querySelectorAll(".add-cart").forEach(button => button.addEventListener("click", () => {
  const id = button.dataset.id; const found = cart.find(item => item.id === id);
  if (found) found.qty++; else cart.push({ id, name: button.dataset.name, price: Number(button.dataset.price), qty: 1 });
  renderCart(); if (cartDialog && !cartDialog.open) cartDialog.showModal();
}));
document.querySelector("#cartOpen")?.addEventListener("click", () => { renderCart(); cartDialog.showModal(); });
cartItems.addEventListener("click", event => { const b = event.target.closest("button"); if (!b) return; const i = Number(b.dataset.cartMinus ?? b.dataset.cartPlus ?? b.dataset.cartRemove); if (!Number.isInteger(i) || !cart[i]) return; if (b.hasAttribute("data-cart-remove")) cart.splice(i, 1); else if (b.hasAttribute("data-cart-minus")) cart[i].qty = Math.max(1, cart[i].qty - 1); else cart[i].qty++; renderCart(); });
document.querySelector("#copyUpi")?.addEventListener("click", () => {
  alert("Scan the Omviro QR and confirm the payee name and exact amount in your UPI app before paying.");
});
document.querySelector("#checkoutForm").addEventListener("submit", event => {
  event.preventDefault(); if (!cart.length) { alert("Please add an item to your cart first."); return; }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const utr = document.querySelector("#paymentUtr").value.trim();
  if (total > 0 && utr.length < 6) { alert("Please enter the UPI transaction ID / UTR after paying."); return; }
  const profile = readStore(SESSION_KEY, {}); const order = { id: "OV-" + Date.now().toString().slice(-8), name: document.querySelector("#orderName").value.trim() || profile.name || "Customer", contact: document.querySelector("#orderEmail").value.trim() || profile.email || profile.phone || "Not provided", customerEmail: profile.email || "", customerPhone: profile.phone || "", company: profile.company || "", city: profile.city || "", notes: document.querySelector("#orderNotes").value.trim(), items: cart, total, paymentMethod: "UPI", paymentUtr: utr, paymentStatus: total > 0 ? "Pending admin verification" : "Quote required — payment not collected", status: total > 0 ? "Payment verification pending" : "Quote requested", createdAt: new Date().toLocaleString() };
  const orders = readStore(ORDERS_KEY, []); orders.unshift(order); writeStore(ORDERS_KEY, orders); if (profile.role === "customer" && profile.email) { const people = readStore("omviro_demo_customers_v1", []); if (!people.some(c => c.email === profile.email)) people.unshift(profile); writeStore("omviro_demo_customers_v1", people); } cart = []; renderCart(); cartDialog.close(); event.target.reset(); accountOutput.innerHTML = `<div class="notice-card"><strong>Order submitted: ${escapeHTML(order.id)}</strong><p>Payment status: ${escapeHTML(order.paymentStatus)}. Your order is NOT confirmed until the admin checks the payment against the UPI/bank statement. This is a local demo; data is saved only in this browser.</p></div>`; document.querySelector("#account").scrollIntoView({behavior:"smooth"});
});
function profileCard(profile) {
  return `<div class="notice-card profile-card"><div class="profile-heading"><div class="profile-avatar">${escapeHTML((profile.name || "U").trim().slice(0,1).toUpperCase())}</div><div><p class="eyebrow">MY ACCOUNT</p><h3>${escapeHTML(profile.name || "Customer")}</h3><p>${escapeHTML(profile.role || "customer")} profile</p></div></div><div class="profile-grid"><p><small>Email</small><strong>${escapeHTML(profile.email || "Not added")}</strong></p><p><small>Phone</small><strong>${escapeHTML(profile.phone || "Not added")}</strong></p><p><small>Company</small><strong>${escapeHTML(profile.company || "Not added")}</strong></p><p><small>City</small><strong>${escapeHTML(profile.city || "Not added")}</strong></p><p><small>Account created</small><strong>${escapeHTML(profile.createdAt || "Today")}</strong></p></div><button class="button button-quiet" id="editProfile">Edit profile</button> <button class="button button-quiet" id="logoutBtn">Logout</button></div>`;
}
function showProfileForm(profile = {}) {
  accountOutput.innerHTML = `<div class="notice-card"><h3>${profile.name ? "Edit your profile" : "Create customer profile"}</h3><form id="profileForm" class="profile-form"><label>Full name *</label><input name="name" required minlength="2" value="${escapeHTML(profile.name || "")}" placeholder="Full name"><label>Email address *</label><input name="email" type="email" required value="${escapeHTML(profile.email || "")}" placeholder="you@example.com"><label>Phone number *</label><input name="phone" required value="${escapeHTML(profile.phone || "")}" placeholder="Mobile number"><label>Company / Shop name</label><input name="company" value="${escapeHTML(profile.company || "")}" placeholder="Company, shop or institute"><label>City</label><input name="city" value="${escapeHTML(profile.city || "")}" placeholder="City"><label>Address</label><textarea name="address" rows="2" placeholder="Optional address">${escapeHTML(profile.address || "")}</textarea><button class="button button-primary" type="submit">Save profile</button><p class="form-note">Demo only: this profile is saved in this browser, not a secure online account.</p></form></div>`;
  document.querySelector("#profileForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); const updated = {...profile, name:String(fd.get("name")).trim(), email:String(fd.get("email")).trim(), phone:String(fd.get("phone")).trim(), company:String(fd.get("company")).trim(), city:String(fd.get("city")).trim(), address:String(fd.get("address")).trim(), role:"customer", createdAt:profile.createdAt || new Date().toLocaleDateString()}; writeStore(SESSION_KEY, updated); const people = readStore("omviro_demo_customers_v1", []); const existing = people.findIndex(c => c.email === updated.email); if (existing >= 0) people[existing] = updated; else people.unshift(updated); writeStore("omviro_demo_customers_v1", people); renderProfile(); });
}
function renderProfile() {
  const session = readStore(SESSION_KEY, {});
  if (!session.name || session.role !== "customer") { showProfileForm(session); return; }
  const orders = readStore(ORDERS_KEY, []).filter(o => o.customerEmail === session.email || o.customerPhone === session.phone);
  accountOutput.innerHTML = profileCard(session) + `<div class="notice-card"><h3>My orders (${orders.length})</h3>${orders.length ? orders.map(order => `<article class="order-row"><strong>${escapeHTML(order.id)} · ${escapeHTML(order.status)}</strong><p>${order.items.map(item => `${escapeHTML(item.name)} × ${item.qty}`).join(", ")}</p><p><b>${money(order.total)}</b> · ${escapeHTML(order.createdAt)}</p>${order.notes ? `<p>Details: ${escapeHTML(order.notes)}</p>` : ""}</article>`).join("") : "<p>No orders linked to this profile yet. Place an order from the products section.</p>"}</div>`;
  document.querySelector("#editProfile")?.addEventListener("click", () => showProfileForm(session));
  document.querySelector("#logoutBtn")?.addEventListener("click", () => { localStorage.removeItem(SESSION_KEY); accountOutput.innerHTML = '<div class="notice-card">You have logged out of this demo session.</div>'; });
}
function renderOrders(admin = false) {
  const orders = readStore(ORDERS_KEY, []);
  const customers = readStore("omviro_demo_customers_v1", []);
  if (!admin) { renderProfile(); return; }
  const totalValue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  accountOutput.innerHTML = `<div class="notice-card admin-summary"><p class="eyebrow">ADMIN CONSOLE · DEMO</p><h3>Company overview</h3><div class="admin-stats"><div><small>Total orders</small><strong>${orders.length}</strong></div><div><small>Customer profiles</small><strong>${customers.length}</strong></div><div><small>Quoted/estimated sales</small><strong>${money(totalValue)}</strong></div></div><button class="button button-quiet" id="adminLogout">Logout admin</button></div><div class="notice-card"><h3>All demo orders</h3>${orders.length ? orders.map(order => `<article class="order-row"><strong>${escapeHTML(order.id)} · ${escapeHTML(order.status)}</strong><p><b>Customer:</b> ${escapeHTML(order.name)} · ${escapeHTML(order.contact)}</p><p><b>Email:</b> ${escapeHTML(order.customerEmail || "Not provided")} · <b>Phone:</b> ${escapeHTML(order.customerPhone || "Not provided")}</p><p><b>Company:</b> ${escapeHTML(order.company || "Not provided")} · <b>City:</b> ${escapeHTML(order.city || "Not provided")}</p><p><b>Items:</b> ${order.items.map(item => `${escapeHTML(item.name)} × ${item.qty}`).join(", ")}</p><p><b>Total:</b> ${money(order.total)} · <b>Date:</b> ${escapeHTML(order.createdAt)}</p><p><b>Payment:</b> ${escapeHTML(order.paymentStatus || "Not recorded")} · <b>UTR:</b> ${escapeHTML(order.paymentUtr || "Not provided")}</p><label>Payment verification <select data-payment-status="${escapeHTML(order.id)}"><option ${order.paymentStatus === "Pending admin verification" ? "selected" : ""}>Pending admin verification</option><option ${order.paymentStatus === "Verified by admin" ? "selected" : ""}>Verified by admin</option><option ${order.paymentStatus === "Rejected / not found" ? "selected" : ""}>Rejected / not found</option></select></label>${order.notes ? `<p><b>Project requirements:</b> ${escapeHTML(order.notes)}</p>` : ""}<label>Update status <select data-order-status="${escapeHTML(order.id)}"><option ${order.status.startsWith("Received") ? "selected" : ""}>Received (demo)</option><option ${order.status.startsWith("In progress") ? "selected" : ""}>In progress (demo)</option><option ${order.status.startsWith("Completed") ? "selected" : ""}>Completed (demo)</option><option ${order.status.startsWith("Cancelled") ? "selected" : ""}>Cancelled (demo)</option></select></label></article>`).join("") : "<p>No orders yet in this browser.</p>"}</div><div class="notice-card"><h3>Customer profiles saved in this browser</h3>${customers.length ? customers.map(c => `<article class="order-row"><strong>${escapeHTML(c.name)}</strong><p>Email: ${escapeHTML(c.email)} · Phone: ${escapeHTML(c.phone)}</p><p>Company: ${escapeHTML(c.company || "—")} · City: ${escapeHTML(c.city || "—")}</p><p>Address: ${escapeHTML(c.address || "—")}</p></article>`).join("") : "<p>Customer profiles appear here after customers create profiles in this browser.</p>"}</div>`;
  document.querySelector("#adminLogout")?.addEventListener("click", () => { localStorage.removeItem(SESSION_KEY); accountOutput.innerHTML = '<div class="notice-card">Admin demo session ended.</div>'; document.querySelector("#adminDashboard").hidden = true; });
}
document.querySelector("#customerLogin")?.addEventListener("click", () => { const session = readStore(SESSION_KEY, {}); if (session.role === "customer" && session.name) renderProfile(); else showProfileForm({role:"customer"}); });
document.querySelector("#adminLogin")?.addEventListener("click", () => {
  const username = prompt("Demo admin username (demo-admin):"); if (username !== "demo-admin") { alert("Incorrect demo username."); return; } const password = prompt("Demo admin password (OmviroDemo2026!):"); if (password !== "OmviroDemo2026!") { alert("Incorrect demo password."); return; } writeStore(SESSION_KEY, { name: "Demo Admin", role: "admin", createdAt: new Date().toLocaleDateString() }); document.querySelector("#adminDashboard").hidden = false; renderOrders(true);
});
document.querySelector("#viewOrders")?.addEventListener("click", () => renderOrders(false));
document.querySelector("#adminDashboard")?.addEventListener("click", () => { const session = readStore(SESSION_KEY, {}); if (session.role !== "admin") { alert("Please sign in as demo admin first."); return; } renderOrders(true); });
accountOutput.addEventListener("change", event => {
  const id = event.target.dataset.orderStatus || event.target.dataset.paymentStatus; if (!id) return;
  const orders = readStore(ORDERS_KEY, []); const order = orders.find(item => item.id === id); if (!order) return;
  if (event.target.dataset.paymentStatus) {
    order.paymentStatus = event.target.value;
    if (event.target.value === "Verified by admin") order.status = "Payment verified — order confirmed";
    if (event.target.value === "Rejected / not found") order.status = "Payment not verified — order on hold";
  } else order.status = event.target.value;
  writeStore(ORDERS_KEY, orders); renderOrders(true);
});
renderCart();


// Accessible scroll-reveal animation; content remains visible if unsupported.
(function initOmviroMotion(){
  const targets = document.querySelectorAll('.section-heading, .service-card, .product-card, .store-card, .academy-panel, .about-section > *, .contact-panel, .process-card, .process-cta');
  targets.forEach(el => el.classList.add('reveal'));
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
  targets.forEach(el => observer.observe(el));
})();
