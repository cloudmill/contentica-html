import $ from "jquery";
import App from "./main.js";

$(document).ready(function() {
  let app = new App();
});

window.onload = function (event) {
  // работа прелоадера проверена с помощью цикла for на 100000 итераций (небольшая задержка)
  // запущенного на событии jquery ready
  closePreloader();
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
