/* ARABAMI BUL V1.2 — favorites.js
   Bağımsız özellik modülü. Ortak durum/data: core.js
*/
function renderFavorites() {
  const grid = document.getElementById('favGrid');
  if (!grid) return;
  const favCars = dummyCars.filter(c => favorites.includes(c.id));
  grid.innerHTML = favCars.length > 0 ? favCars.map(c => createCarCard(c)).join('') : '<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--muted);">Henüz favori araç eklemediniz.</div>';
}