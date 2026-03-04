const toast = document.getElementById("giveToast");
const toastText = document.getElementById("giveToastText");

function showToast(msg){
  if(!toast || !toastText) return;
  toastText.textContent = msg;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 1700);
}

async function copyText(text, successMsg){
  try{
    await navigator.clipboard.writeText(text);
    showToast(successMsg || "Copied");
  }catch(e){
    // fallback
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    showToast(successMsg || "Copied");
  }
}

const bankText =
`Name: STREAMS OF JOY SOUTH LONDON LTD
Bank: VIRGIN Bank
Account type: Business
Sort Code: 82-12-08
Account Number: 20278981`;

document.getElementById("copyBankBtn")?.addEventListener("click", () => {
  copyText(bankText, "Bank details copied");
});

const paypalUrl = "https://paypal.me/SOJSouthLondon";
document.getElementById("copyPaypalBtn")?.addEventListener("click", () => {
  copyText(paypalUrl, "PayPal link copied");
});