const TIME_SLOTS = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30"
];

let selectedSlot = null;
let bookings = JSON.parse(localStorage.getItem("bookings") || "{}");

const slotsDiv = document.getElementById("slots");
const dateInput = document.getElementById("date");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpSection = document.getElementById("otpSection");
const message = document.getElementById("message");
const adminList = document.getElementById("adminList");


sendOtpBtn.addEventListener("click", sendOTP);
document.getElementById("confirmBtn").addEventListener("click", confirmBooking);
document.getElementById("refreshAdmin").addEventListener("click", loadAdmin);

function renderSlots() {
  slotsDiv.innerHTML = "";
  sendOtpBtn.disabled = true;
  selectedSlot = null;

  const date = dateInput.value;
  if (!date) return;

  TIME_SLOTS.forEach(slot => {
    const div = document.createElement("div");
    div.className = "slot";
    div.innerText = slot;

    if (bookings[date]?.[slot]) {
      div.classList.add("booked");
    } else {
      div.onclick = () => selectSlot(div, slot);
    }

    slotsDiv.appendChild(div);
  });
}

function selectSlot(div, slot) {
  document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
  div.classList.add("selected");
  selectedSlot = slot;
  sendOtpBtn.disabled = false;
}

function sendOTP() {
  otpSection.classList.remove("hidden");
  message.innerText = "OTP sent (demo mode)";
}

function confirmBooking() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const date = dateInput.value;

  if (!bookings[date]) bookings[date] = {};
  bookings[date][selectedSlot] = { name, phone };

  localStorage.setItem("bookings", JSON.stringify(bookings));

  message.innerText = "Appointment Confirmed!";
  otpSection.classList.add("hidden");
  renderSlots();
  loadAdmin();
}

function loadAdmin() {
  adminList.innerHTML = "";
  for (const date in bookings) {
    for (const slot in bookings[date]) {
      const p = document.createElement("p");
      p.innerText = `${date} | ${slot} | ${bookings[date][slot].name}`;
      adminList.appendChild(p);
    }
  }
}

loadAdmin();

let confirmationResult;

// Initialize reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
  'recaptcha-container',
  { size: 'invisible' },
  auth
);

function sendOTP() {
  const phone = document.getElementById("phone").value;

  if (!phone.startsWith("+")) {
    alert("Phone number must include country code (e.g. +94)");
    return;
  }

  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      otpSection.classList.remove("hidden");
      message.innerText = "OTP sent to your phone";
    })
    .catch(error => {
      alert(error.message);
    });
}

function confirmBooking() {
  const otp = document.getElementById("otp").value;

  confirmationResult.confirm(otp)
    .then(() => {
      saveBooking();
    })
    .catch(() => {
      alert("Invalid OTP");
    });
}

// 🔒 Save booking only AFTER OTP success
function saveBooking() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const date = dateInput.value;

  if (!bookings[date]) bookings[date] = {};
  bookings[date][selectedSlot] = { name, phone };

  localStorage.setItem("bookings", JSON.stringify(bookings));

  message.innerText = "Appointment Confirmed!";
  otpSection.classList.add("hidden");
  renderSlots();
  loadAdmin();
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.log('Service Worker Registration Failed:', err));
}

