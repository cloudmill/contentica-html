import $, { timers } from "jquery";
import App from "./main.js";

$(document).ready(function() {
  let app = new App();
});

window.onload = function (event) {
  // работа прелоадера проверена с помощью цикла for на 100000 итераций (небольшая задержка)
  // запущенного на событии jquery ready
  closePreloader();

  // timer
  timer();
};

function closePreloader() {
  const preloader = $(".preloader");

  // если preloader изначально не закрыт
  if (!preloader.hasClass(".preloader--closed")) {
    // добавляем к нему класс с transition'ом закрытия
    preloader.addClass("preloader--closing");

    // т.к. duration одинакова для всех preloader item'ов
    // то обработчик конца анимации закрытия достаточно "повесить" на любой из них
    const preloaderItems = preloader.find(".preloader__item");
    preloaderItems.eq(0).on("transitionend", function (event) {
      preloader.removeClass("preloader--closing");
      preloader.addClass("preloader--closed");
    });
  }
}

function timer() {
  const timer = $(".timer");

  const timerMsec = timer.find(".timer__item--msec");
  const timerSec = timer.find(".timer__item--sec");
  const timerMin = timer.find(".timer__item--min");
  const timerHr = timer.find(".timer__item--hr");

  let countedTime = 0;
  let prevFrameTime;
  let nextFrameTime = (new Date()).getTime();

  requestAnimationFrame(updateTimer);

  function updateTimer() {
    prevFrameTime = nextFrameTime;
    nextFrameTime = (new Date()).getTime();

    countedTime += nextFrameTime - prevFrameTime;

    updateTime(countedTime);

    requestAnimationFrame(updateTimer);
  }

  // аргумент - посчитанное время в мсек
  function updateTime(time) {
    const timeInMsec = time % 1000;
    
    time = Math.floor(time / 1000);
    const timeInSec = time % 60;
    
    time = Math.floor(time / 60);
    const timeInMin = time % 60;
    
    time = Math.floor(time / 60);
    const timeInHr = time;

    timerMsec.text(formatTime(timeInMsec));
    timerSec.text(formatTime(timeInSec));
    timerMin.text(formatTime(timeInMin));
    timerHr.text(formatTime(timeInHr));
  }

  function formatTime(time) {
    if (time >= 100) {
      time = Math.ceil(time / 10);
    }

    time = time.toString();
    const timeLength = time.length;
    time = timeLength >= 3 ? time.substr(0, 2) : timeLength == 2 ? time : timeLength == 1 ? "0" + time : "00";

    return time;
  }
}
