import $, { timers } from "jquery";
import App from "./main.js";

$(document).ready(function() {
  let app = new App();
});

window.onload = function (event) {
  // preloader
  // работа прелоадера проверена с помощью цикла for на 100000 итераций (небольшая задержка)
  // запущенного на событии jquery ready
  closePreloader();

  // timer
  // timer запускается здесь (onload)
  // поскольку именно здесь закрывается preloader
  timer();

  // dot-link
  dotLinks();

  camera();

  battery();

  decorFade();
};

function decorFade() {
  const DECOR = [
    ".table",
    ".focus",
    ".timer",
    ".header__line--bottom"
  ];

  let fadeDist = $(window).height();
  let fadeFinish = fadeDist;

  $(window).resize(() => {
    fadeDist = $(window).height();
    fadeFinish = fadeDist;
  });
  
  let outFade;

  if (pageYOffset + $(window).height() > $(document).height() - fadeFinish) {
    const fadeProgress = ((pageYOffset + $(window).height()) - ($(document).height() - fadeFinish)) / fadeDist;

    DECOR.forEach((item) => {
      $(item).css("opacity", 1 - fadeProgress);
    });

    outFade = false;
  } else {
    outFade = true;
  }

  $(window).scroll(() => {
    if (pageYOffset + $(window).height() > $(document).height() - fadeFinish) {
      const fadeProgress = ((pageYOffset + $(window).height()) - ($(document).height() - fadeFinish)) / fadeDist;

      DECOR.forEach((item) => {
        $(item).css("opacity", 1 - fadeProgress);
      });

      if (outFade) {
        outFade = false;
      }
    } else if (!outFade) {
      DECOR.forEach((item) => {
        $(item).css("opacity", 1);
      });

      outFade = true;
    }
  });
}

function battery() {
  $(window).scroll(() => {
    $(".battery__charge").css("transform", `scaleX(${pageYOffset / ($(document).height() - $(window).height())})`)
  });
}

function camera() {
  const headerHeight = $(".page__header").height();
  const scaleDistanceTail = 270;
  const scaleDistance = headerHeight + scaleDistanceTail;

  $(window).scroll((event) => {
    const SCALE_DISTANCE = 270;

    if (pageYOffset <= SCALE_DISTANCE) {
      const progress = pageYOffset / SCALE_DISTANCE;

      $(".camera").css("transform", `scale(${1 + progress}, ${1 + progress})`);
      $(".camera").css("opacity", 1 - 0.6 * progress);
    } else {
      const progress = (pageYOffset - SCALE_DISTANCE) / ($(document).height() - SCALE_DISTANCE - $(".page__header").height());
      $(".camera").css("transform", `scale(${2 - 0.35 * progress}, ${2 - 0.35 * progress}) translate(${-80 * progress}px, ${-80 * progress}px)`);
      $(".camera").css("opacity", 0.4 * (1 - progress));
    }
  });
}

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

    countedTime += (nextFrameTime - prevFrameTime) > 0 ? (nextFrameTime - prevFrameTime) : 0;

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

function dotLinks() {
  let windowWidth = $(window).width();

  const components = $(".dot-link");

  components.each((index, element) => {
    const
      component = $(element),
      tail = component.find(".dot-link__tail");
    
    const
      DOT_ACTIVE = "dot-link__dot--active",
      LINK_ACTIVE = "dot-link__link--active",
      LINK_MOVE_ACTIVE = "dot-link__link-move--active",
      PROPERTY_NAME = "right";

    const
      link = component.find(".dot-link__link"),
      linkMove = component.find(".dot-link__link-move"),
      dotTrack = tail.find(".dot-link__dot-track"),
      dot = dotTrack.find(".dot-link__dot");

    let componentState = {
      linkHover: false,
      dotActiveTransitionEnd: false,
      dotNoActiveTransitionEnd: true
    };

    link.on("mouseover", () => {
      if (windowWidth > 1200) {
        componentState.linkHover = true;
        
        if (
          !dot.hasClass(DOT_ACTIVE)
          && componentState.dotNoActiveTransitionEnd
        ) {
          dot.addClass(DOT_ACTIVE);
          link.addClass(LINK_ACTIVE);
          linkMove.addClass(LINK_MOVE_ACTIVE);
          
          componentState.dotNoActiveTransitionEnd = false;
        }
      }
    });

    link.on("mouseout", () => {
      if (windowWidth > 1200) {
        componentState.linkHover = false;
        
        if (
          dot.hasClass(DOT_ACTIVE)
          && componentState.dotActiveTransitionEnd
        ) {
          dot.removeClass(DOT_ACTIVE);
          link.removeClass(LINK_ACTIVE);
          linkMove.removeClass(LINK_MOVE_ACTIVE);
          
          componentState.dotActiveTransitionEnd = false;
        }
      }
    });

    dot.on("transitionend", function (event) {
      if (event.originalEvent.propertyName == PROPERTY_NAME) {
        if (dot.hasClass(DOT_ACTIVE)) {
          componentState.dotActiveTransitionEnd = true;
          
          if (!componentState.linkHover) {
            dot.removeClass(DOT_ACTIVE);
            link.removeClass(LINK_ACTIVE);
            linkMove.removeClass(LINK_MOVE_ACTIVE);
            
            componentState.dotActiveTransitionEnd = false;
          }
        } else {
          componentState.dotNoActiveTransitionEnd = true;
          
          if (componentState.linkHover) {
            dot.addClass(DOT_ACTIVE);
            link.addClass(LINK_ACTIVE);
            linkMove.addClass(LINK_MOVE_ACTIVE);
            
            componentState.dotNoActiveTransitionEnd = false;
          }
        }
      }
    });
  })

  $(window).resize(() => {
    windowWidth = $(window).width();
  });
}
