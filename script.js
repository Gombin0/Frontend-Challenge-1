let minutesInput = document.querySelector('.minutes input');
let secondsInput = document.querySelector('.seconds input');
let ringDiv = document.getElementsByClassName('ring')[0];
let startBtn = document.getElementsByClassName('start')[0];
let settingsBtn = document.getElementsByClassName('settings')[0];
let circle = document.querySelector('.ring svg circle');
let audio = new Audio('./sounds/timer.wav');
let interval = null;
let strokePropertiesObj = { _time: 0, _strokeIncrement: 0, _traveledDistance: 0, _strokeLength: 0 }

startBtn.addEventListener("click", startPauseCountDown);
settingsBtn.addEventListener("click", editTimer);

function startPauseCountDown() {
    if (interval === null) {
        startBtn.innerHTML = 'pause';
        strokePropertiesObj = calcStrokeStuff();
        interval = setInterval(countDown, 1000);
        editTimer();
    }
    else {
        startBtn.innerHTML = 'start';
        clearInterval(interval);
        interval = null;
    }
}

function countDown() {
    drawStroke();
    minutesInput.value = minutesInput.value.toString().padStart(2, '0');
    secondsInput.value = secondsInput.value.toString().padStart(2, '0');

    let seconds = parseInt(secondsInput.value);
    let minutes = parseInt(minutesInput.value);

    --seconds;

    if (minutes === 0 && seconds === 0) {
        audio.play();
        resetTimerAfterFinish();
    }

    if (seconds < 0) {
        --minutes;
        seconds = 59;
        minutesInput.value = minutes.toString().padStart(2, '0');
    }
    secondsInput.value = seconds.toString().padStart(2, '0');
}

function editTimer() {
    if (interval === null) {
        minutesInput.removeAttribute('disabled');
        secondsInput.removeAttribute('disabled');
    } else {
        minutesInput.setAttribute('disabled', '');
        secondsInput.setAttribute('disabled', '');
    }

}

function resetTimerAfterFinish() {
    startPauseCountDown();
    setTimeout(() => {
        alert("Time's up!")
        ringDiv.classList.remove('ending');
        minutesInput.value = '15';
        secondsInput.value = '00';
    }, 500)

}
// calc stroke
function calcStrokeStuff() {
    let time = ((parseInt(minutesInput.value) * 60) + parseInt(secondsInput.value)) - 1;
    let strokeLength = circle.getTotalLength();

    circle.style.setProperty('--strokeLength', strokeLength);
    let strokeIncrement = strokeLength / time;
    circle.style.setProperty('--strokeIncrement', strokeIncrement);

    return { _time: time, _strokeIncrement: strokeIncrement, _traveledDistance: strokeIncrement, _strokeLength: strokeLength }
}

function drawStroke() {
    if (strokePropertiesObj._time > 0) {
        circle.style.setProperty('--strokeCalc', strokePropertiesObj._traveledDistance);
        strokePropertiesObj._traveledDistance += strokePropertiesObj._strokeIncrement;
        --strokePropertiesObj._time;
    } else {
        circle.style.setProperty('--strokeCalc', 0);
        circle.style.transitionDuration = '200ms';
        ringDiv.classList.add('ending')
    }
}