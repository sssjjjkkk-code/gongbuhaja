/* -----------------------------
   POMODORO TIMER
------------------------------ */

const alarmSound = new Audio("sounds/alarm.mp3");

let audio = new Audio();
audio.volume = 1;

let currentBtn = null;

let timer = null;

let workSec = 25 * 60;
let breakSec = 5 * 60;

let sec = workSec;

let isWork = true;

const timerText = document.getElementById("timer");
const statusText = document.getElementById("status");


/* -----------------------------
   DISPLAY
------------------------------ */

function updateDisplay(){

    const m = Math.floor(sec / 60);
    const s = sec % 60;

    timerText.textContent =
        `${m}:${s < 10 ? "0" : ""}${s}`;

    statusText.textContent =
        isWork ? "Focus Time" : "Break Time";

    document.title =
        isWork
        ? `🍅 ${timerText.textContent}`
        : `☕ ${timerText.textContent}`;

}


/* -----------------------------
   TIMER
------------------------------ */

function tick(){

    if(sec > 0){

        sec--;

        updateDisplay();

        return;

    }

    finishSession();

}


/* -----------------------------
   START
------------------------------ */

function start(){

    requestNotificationPermission();

    if(timer) return;

    timer = setInterval(tick,1000);

}


/* -----------------------------
   PAUSE
------------------------------ */

function pause(){

    clearInterval(timer);

    timer = null;

}


/* -----------------------------
   RESET
------------------------------ */

function reset(){

    pause();

    isWork = true;

    sec = workSec;

    updateDisplay();

}


/* -----------------------------
   MODE
------------------------------ */

function mode(workMin,breakMin){

    pause();

    workSec = workMin * 60;

    breakSec = breakMin * 60;

    isWork = true;

    sec = workSec;

    updateDisplay();

}

/* -----------------------------
   SESSION COMPLETE
------------------------------ */

function finishSession(){

    // 알림음
    alarmSound.currentTime = 0;
    alarmSound.play();

    // Notification
    if(isWork){

        sendNotification(
            "🔔 Focus complete!",
            "Time for a break ☕"
        );

    }else{

        sendNotification(
            "🔔 Break complete!",
            "Back to work 📚"
        );

    }

    // Focus ↔ Break 전환
    isWork = !isWork;

    sec = isWork ? workSec : breakSec;

    updateDisplay();

}


/* -----------------------------
   NOTIFICATION
------------------------------ */

function requestNotificationPermission(){

    if(
        "Notification" in window &&
        Notification.permission === "default"
    ){

        Notification.requestPermission();

    }

}

function sendNotification(title,body){

    if(
        "Notification" in window &&
        Notification.permission === "granted"
    ){

        new Notification(title,{
            body:body
        });

    }

}


/* -----------------------------
   AMBIENT SOUND
------------------------------ */

function sound(name,btn){

    if(currentBtn === btn){

        audio.pause();

        currentBtn.classList.remove("active");

        currentBtn = null;

        return;

    }

    if(currentBtn){

        currentBtn.classList.remove("active");

    }

    currentBtn = btn;

    btn.classList.add("active");

    audio.src = `sounds/${name}.mp3`;

    audio.loop = true;

    audio.play();

}


/* -----------------------------
   INITIALIZE
------------------------------ */

updateDisplay();