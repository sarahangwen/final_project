function validateForm() {
  const name = document.getElementById('produceName').value.trim();
  const type = document.getElementById('produceType').value.trim();
  const date = document.getElementById('procureDate').value;
  const time = document.getElementById('procureTime').value;
  const tonnage = document.getElementById('tonnage').value;
  const cost = document.getElementById('cost').value;
  const dealer = document.getElementById('dealerName').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const sellPrice = document.getElementById('sellPrice').value;
  const branch = document.getElementById('branchName').value;

  const typeRegex = /^[A-Za-z]{2,}$/;
  const phoneRegex = /^0\d{9}$/;

  if (!name) {
    alert('Produce Name is required.');
    return false;
  }

  if (!typeRegex.test(type)) {
    alert('Produce Type must be alphabetic and at least 2 characters.');
    return false;
  }

  if (!date || !time) {
    alert('Both Date and Time are required.');
    return false;
  }

  if (!tonnage || tonnage.length < 3 || Number(tonnage) < 100) {
    alert('Tonnage must be at least 3 digits (min 100kg).');
    return false;
  }

  if (!cost || cost.length < 5 || Number(cost) <= 0) {
    alert('Cost must be a numeric value with at least 5 digits.');
    return false;
  }

  if (!dealer || dealer.length < 2) {
    alert('Dealer Name must be at least 2 characters.');
    return false;
  }

  if (!phoneRegex.test(contact)) {
    alert('Contact must be a valid Ugandan phone number (e.g. 07XXXXXXXX).');
    return false;
  }

  if (!branch) {
    alert('Please select a branch.');
    return false;
  }

  if (!sellPrice || sellPrice.length < 5 || Number(sellPrice) <= 0) {
    alert('Selling Price must be a numeric value with at least 5 digits.');
    return false;
  }

  return true;
}