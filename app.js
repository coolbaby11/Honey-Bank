// بارگذاری لیست کاربران از localStorage
function loadUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// تولید شماره کارت تصادفی
function genCard() {
  return '4000-' +
    Math.floor(1000 + Math.random() * 9000) + '-' +
    Math.floor(1000 + Math.random() * 9000) + '-' +
    Math.floor(1000 + Math.random() * 9000);
}

// ثبت‌نام
function signup() {
  const u = document.getElementById('su_user').value.trim();
  const p = document.getElementById('su_pass').value;
  const e = document.getElementById('su_error');
  let users = loadUsers();
  e.textContent = '';
  if (!u || !p) { e.textContent = 'نام کاربری و رمز را وارد کنید'; return; }
  if (users.find(x => x.user === u)) { e.textContent = 'این نام کاربری قبلاً ثبت شده'; return; }
  users.push({ user: u, pass: p, card: genCard(), balance: 10000 });
  saveUsers(users);
  e.className = 'success';
  e.textContent = 'ثبت‌نام موفق! اکنون وارد شوید.';
}

// ورود
function login() {
  const u = document.getElementById('li_user').value.trim();
  const p = document.getElementById('li_pass').value;
  const e = document.getElementById('li_error');
  let users = loadUsers();
  e.textContent = '';
  const me = users.find(x => x.user === u && x.pass === p);
  if (!me) { e.textContent = 'نام کاربری یا رمز اشتباه است'; return; }
  localStorage.setItem('current', JSON.stringify(me));
  window.location = 'dashboard.html';
}

// آماده‌سازی داشبورد
if (location.pathname.endsWith('dashboard.html')) {
  const cur = JSON.parse(localStorage.getItem('current') || 'null');
  if (!cur) { window.location = 'index.html'; }
  document.getElementById('welcome').textContent = 'سلام، ' + cur.user;
  document.getElementById('card').textContent = cur.card;
  document.getElementById('balance').textContent = cur.balance;
}

// انتقال پول
function transfer() {
  const to = document.getElementById('to_user').value.trim();
  const amt = Number(document.getElementById('amount').value);
  const e = document.getElementById('tr_error');
  e.textContent = '';
  let users = loadUsers();
  let cur = JSON.parse(localStorage.getItem('current'));
  if (!to || !amt) { e.textContent = 'مشخصات مقصد و مبلغ را وارد کنید'; return; }
  let dest = users.find(x => x.user === to);
  if (!dest) { e.textContent = 'کاربر مقصد یافت نشد'; return; }
  if (amt > cur.balance) { e.textContent = 'موجودی کافی نیست'; return; }
  cur.balance -= amt; dest.balance += amt;
  saveUsers(users.map(x =>
    x.user === cur.user ? cur :
    x.user === dest.user ? dest : x
  ));
  localStorage.setItem('current', JSON.stringify(cur));
  document.getElementById('balance').textContent = cur.balance;
  e.className = 'success';
  e.textContent = 'انتقال با موفقیت انجام شد';
}

// خروج
function logout() {
  localStorage.removeItem('current');
  window.location = 'index.html';
}
