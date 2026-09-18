/* ARABAMI BUL V1.2 — filters.js
   Bağımsız özellik modülü. Ortak durum/data: core.js
*/
function resetFilters() {
  document.getElementById('fQuery').value = '';
  document.getElementById('fBrand').value = '';
  document.getElementById('fBody').value = '';
  document.getElementById('fPriceMin').value = '';
  document.getElementById('fPriceMax').value = '';
  document.getElementById('fYearMin').value = '';
  document.getElementById('fYearMax').value = '';
  document.getElementById('fKmMax').value = '';
  document.getElementById('fFuel').value = '';
  document.getElementById('fTrans').value = '';
  document.getElementById('fSort').value = 'default';
  renderBrowse();
}

function toggleFilters() {
  const f = document.getElementById('filterPanel');
  f.classList.toggle('open');
  document.getElementById('filterState').textContent = f.classList.contains('open') ? '−' : '+';
}