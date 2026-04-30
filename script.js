// js/script.js | XYRONYX OS Phase 3 Stable

/* =====================
ELEMENTS
===================== */
const bootScreen = document.getElementById("boot-screen");
const lockScreen = document.getElementById("lock-screen");
const desktop = document.getElementById("desktop");

const startupSound = document.getElementById("startup-sound");

const unlockBtn = document.getElementById("unlock-btn");

const dateTime = document.getElementById("datetime");
const lockTime = document.getElementById("lock-time");
const lockDate = document.getElementById("lock-date");

const cursorGlow = document.getElementById("cursor-glow");
const notifStack = document.getElementById("notification-stack");

const dockIcons = document.querySelectorAll(".dock-icon");
const windowsAll = document.querySelectorAll(".window");

const orb = document.getElementById("aether-orb");
const panel = document.getElementById("aether-panel");
const expandBtn = document.getElementById("expand-aether");

const aetherWindow = document.getElementById("aether-window");
const quickBtns = document.querySelectorAll(".quick-btn");

const notesArea = document.getElementById("notes-area");

const calcScreen = document.getElementById("calc-screen");
const calcBtns = document.querySelectorAll(".calc-grid button");

const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const sendChat = document.getElementById("send-chat");

let topZ = 20;
let openOffset = 0;

/* =====================
BOOT FLOW
===================== */
window.addEventListener("load", () => {
  setTimeout(() => {
    try{
      startupSound.volume = 0.45;
      startupSound.play().catch(()=>{});
    }catch(e){}

    bootScreen.classList.add("hidden");
    lockScreen.classList.remove("hidden");

    showToast("System online. Awaiting unlock.");
  }, 2400);
});

/* =====================
TIME
===================== */
function updateTime(){
  const now = new Date();

  const time = now.toLocaleTimeString([],{
    hour:"2-digit",
    minute:"2-digit"
  });

  const date = now.toLocaleDateString([],{
    weekday:"long",
    day:"numeric",
    month:"long"
  });

  if(dateTime) dateTime.textContent = `${time} • ${date}`;
  if(lockTime) lockTime.textContent = time;
  if(lockDate) lockDate.textContent = date;
}

setInterval(updateTime,1000);
updateTime();

/* =====================
UNLOCK
===================== */
function unlockSystem(){
  lockScreen.classList.add("hidden");
  desktop.classList.remove("hidden");

  showToast("Welcome back, Prince.");
  setTimeout(()=>showToast("AETHER ready."),600);
}

unlockBtn.addEventListener("click", unlockSystem);

document.addEventListener("keydown",(e)=>{
  if(!lockScreen.classList.contains("hidden") && e.key === "Enter"){
    unlockSystem();
  }
});

/* =====================
CURSOR GLOW
===================== */
document.addEventListener("mousemove",(e)=>{
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});

/* =====================
TOAST
===================== */
function showToast(text){
  const div = document.createElement("div");
  div.className = "toast glass";
  div.textContent = text;

  notifStack.appendChild(div);

  setTimeout(()=>{
    div.style.opacity = "0";
    div.style.transform = "translateY(-8px)";
  },2500);

  setTimeout(()=>{
    div.remove();
  },3200);
}

/* =====================
OPEN WINDOW
===================== */
function openWindow(id){
  const win = document.getElementById(id);
  if(!win) return;

  win.style.display = "block";
  win.classList.remove("hidden-window");

  win.style.zIndex = ++topZ;

  openOffset += 22;
  if(openOffset > 120) openOffset = 0;

  win.style.left = (100 + openOffset) + "px";
  win.style.top = (120 + openOffset) + "px";
}

/* =====================
DOCK APPS
===================== */
dockIcons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const id = btn.dataset.open;
    openWindow(id);
  });
});

/* =====================
CLOSE BUTTONS
===================== */
document.querySelectorAll(".close-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const target = btn.dataset.close;
    const el = document.getElementById(target);

    if(el) el.style.display = "none";
  });
});

/* =====================
WINDOW FRONT
===================== */
windowsAll.forEach(win=>{
  win.addEventListener("mousedown",()=>{
    win.style.zIndex = ++topZ;
  });
});

/* =====================
DRAG WINDOWS
===================== */
windowsAll.forEach(win=>{
  const handle = win.querySelector(".drag-handle");

  let isDown = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener("mousedown",(e)=>{
    isDown = true;

    win.style.zIndex = ++topZ;

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  document.addEventListener("mouseup",()=>{
    isDown = false;
  });

  document.addEventListener("mousemove",(e)=>{
    if(!isDown) return;

    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top = (e.clientY - offsetY) + "px";
  });
});

/* =====================
NOTES AUTOSAVE
===================== */
if(notesArea){
  notesArea.value = localStorage.getItem("xy_notes") || "";

  notesArea.addEventListener("input",()=>{
    localStorage.setItem("xy_notes",notesArea.value);
  });
}

/* =====================
CALCULATOR
===================== */
calcBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const val = btn.textContent;

    if(val === "C"){
      calcScreen.value = "";
      return;
    }

    if(val === "="){
      try{
        calcScreen.value = eval(calcScreen.value);
      }catch{
        calcScreen.value = "Error";
      }
      return;
    }

    calcScreen.value += val;
  });
});

/* =====================
AETHER PANEL
===================== */
orb.addEventListener("click",()=>{
  panel.classList.toggle("hidden-panel");
});

expandBtn.addEventListener("click",()=>{
  openWindow("aether-window");
  panel.classList.add("hidden-panel");
});

/* =====================
QUICK ACTIONS
===================== */
quickBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const txt = btn.textContent;

    if(txt === "Notes") openWindow("notes-window");
    else if(txt === "GitHub") showToast("Build consistently. Push tonight.");
    else if(txt === "Focus") showToast("90 minutes deep work recommended.");
    else if(txt === "Weather") showToast("Weather module arrives Phase 4.");
  });
});

/* =====================
AETHER CHAT
===================== */
function addMsg(text,type="bot"){
  const div = document.createElement("div");
  div.className = type === "user" ? "user-msg" : "bot-msg";
  div.textContent = text;

  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function reply(msg){
  const m = msg.toLowerCase();

  if(m.includes("hello") || m.includes("hi")){
    return "Greetings, Prince. Systems stable and operational.";
  }

  if(m.includes("github")){
    return "Consistency builds reputation. Ship projects weekly.";
  }

  if(m.includes("code")){
    return "Break features into small modules, then execute cleanly.";
  }

  if(m.includes("future")){
    return "You are already building it.";
  }

  if(m.includes("who are you")){
    return "I am AETHER, your futuristic companion.";
  }

  return "Understood. Continue with precision and momentum.";
}

function sendMessage(){
  const text = chatInput.value.trim();
  if(!text) return;

  addMsg(text,"user");
  chatInput.value = "";

  setTimeout(()=>{
    addMsg(reply(text),"bot");
  },500);
}

sendChat.addEventListener("click",sendMessage);

chatInput.addEventListener("keydown",(e)=>{
  if(e.key === "Enter") sendMessage();
});

/* =====================
START HINT
===================== */
setTimeout(()=>{
  showToast("Tip: Press Enter to unlock.");
},800);