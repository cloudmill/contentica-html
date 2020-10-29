import $ from "jquery";
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

  pageTitleFade();

  simpleLink();

  sectionTitle();

  scrollDown();

  scrollUp();

  features();
};

function features() {
  $(".page-title__feature-title").mouseenter(function () {
    const item = $(this).data("item");

    $(`.header__feature[data-item="${item}"]`).addClass("header__feature--active");
  });

  $(".page-title__feature-title").mouseout(() => {
    $(".header__feature").removeClass("header__feature--active");
  });
}

function scrollUp() {
  let animation = false;

  const normalize = 3500;
  let duration;

  $(".logo").click(() => {
    duration = 1000 * pageYOffset / normalize;

    if (!animation && pageYOffset >= 1) {
      animation = true;

      const startScroll = $(window).scrollTop();
      const dist = startScroll;
      
      const start = performance.now();

      let time;
      let progress;
      let scroll;

      requestAnimationFrame(function animate(now) {
        time = now - start;

        // timing function
        progress = Math.log(Math.pow((time / duration) * 10 + 1, 0.5));

        progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
        
        scroll = startScroll - dist * progress;
        
        $(window).scrollTop(scroll);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          $(window).scrollTop(0);
          animation = false;
        }
      });
    }
  });
}

function scrollDown() {
  // animation right now ?

  let animation = false;

  // start points
  
  let points;
  
  updatePoints();
  
  // start cur point
  
  let curPoint;
  
  updateCurPoint();

  // update points
  
  function updatePoints() {
    points = [];
    
    $(".main__section").each(function () {
      points.push($(this).offset().top - 100);
    });

    points.push($(".footer").offset().top);
  }
  
  // update cur point
  
  function updateCurPoint() {
    curPoint = -1;
    
    for (; curPoint + 1 < points.length && pageYOffset >= points[curPoint + 1]; curPoint++);
  }

  // resize window
  
  $(window).resize(() => {
    updatePoints();
  });

  // click scroll down
  
  $(".scroll-down__button").click(function () {
    if (!animation) {
      animation = true;
      
      updateCurPoint();
      
      scrollNext(500);
    }
  });

  // update btn

  let btnActive = true;

  updateBtn();

  setInterval(() => {
    updateBtn();
  }, 1000);

  function updateBtn() {
    const btn = $(".scroll-down__button")[0].getBoundingClientRect();
    const links = $("a");

    for (let i = 0; i < links.length; i++) {
      const link = links[i].getBoundingClientRect();

      if (
        link.x + link.width >= btn.x && link.x <= btn.x + btn.width
        &&
        link.y + link.height >= btn.y && link.y <= btn.y + btn.height
      ) {
        if (btnActive) {
          btnActive = false;

          $(".scroll-down__button").css("pointer-events", "none");
        }

        return;
      }
    }

    if (!btnActive) {
      btnActive = true;

      $(".scroll-down__button").css("pointer-events", "");
    }
  }

  // animation scroll to
  
  function scrollNext(duration) {
    if (++curPoint < points.length) {
      const startScroll = $(window).scrollTop();
      const dist = points[curPoint] - startScroll;
      
      const start = performance.now();

      let time;
      let progress;
      let scroll;

      requestAnimationFrame(function animate(now) {
        time = now - start;

        // timing function
        progress = Math.log(Math.pow((time / duration) * 10 + 1, 0.5));

        progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
        
        scroll = startScroll + dist * progress;
        
        $(window).scrollTop(scroll);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          $(window).scrollTop(Math.ceil(points[curPoint]));
          animation = false;
        }
      });
    } else {
      animation = false;
    }
  }
}

function sectionTitle() {
  let desktop;
  
  const title = $(".main__section-title");
  let visibly;
  
  init();

  function init() {
    if ($(window).width() > 1200) {
      desktop = true;
      desktopInit();
      update();
    } else {
      desktop = false;
    }
  }

  function desktopInit() {
    title.css("opacity", 0);
    title.css("position", "fixed");
    title.css("top", "50%");
    title.css("left", "0");
    title.css("transform", "translateY(-50%)");
    
    visibly = [];
    for (let i = 0; i < title.length; i++) {
      visibly.push(false);
    }
  }

  function update() {
    const
      DIST = $(window).height() / 3.5,
      section = $(".main__section"),
      titleY = [];

    section.each(function () {
      titleY.push($(this).offset().top - ($(window).height() - $(this).height()) / 2);
    });

    title.each((index, element) => {
      if (visibly[index]) {
        if (
          pageYOffset < titleY[index] - DIST
          || pageYOffset > titleY[index] + DIST
        ) {
          visibly[index] = false;
          $(element).css("opacity", 0);
        }
      } else {
        if (
          pageYOffset >= titleY[index] - DIST
          && pageYOffset <= titleY[index] + DIST
        ) {
          visibly[index] = true;
        }
      }

      if (visibly[index]) {
        const
          opacityProgress = 1 - Math.abs(titleY[index] - pageYOffset) / DIST,
          transformProgress = titleY[index] + DIST - pageYOffset;

        $(element).css("opacity", opacityProgress);
        $(element).css("transform", `translateY(calc(-75% + ${transformProgress / 10}px))`);
      }
    });
  }

  $(window).resize(() => {
    if (desktop) {
      if ($(window).width() <= 1200) {
        desktop = false;
        mobileInit();
      }
    } else {
      if ($(window).width() > 1200) {
        desktop = true;
        desktopInit();
        update();
      }
    }
  });

  function mobileInit() {
    title.css("position", "");
    title.css("top", "");
    title.css("left", "");
    title.css("transform", "");
    title.css("opacity", 1);
  }

  $(window).scroll(() => {
    if (desktop) {
      update();
    }
  });
}

function simpleLink() {
  $(".simple-link").each(function () {
    const simpleLink = $(this);

    let hover = false;

    simpleLink.mouseover(() => {
      hover = true;

      if (simpleLink.hasClass("simple-link--closed")) {
        simpleLink.removeClass("simple-link--closed");
        
        simpleLink.addClass("simple-link--openning");
      }
    });

    simpleLink.mouseout(() => {
      hover = false;

      if (simpleLink.hasClass("simple-link--opened")) {
        simpleLink.removeClass("simple-link--opened");

        simpleLink.addClass("simple-link--closing");
      }
    });

    simpleLink.on("transitionend", () => {
      if (simpleLink.hasClass("simple-link--openning")) {
        simpleLink.removeClass("simple-link--openning");

        if (hover) {
          simpleLink.addClass("simple-link--opened");
        } else {
          simpleLink.addClass("simple-link--closing");
        }
      } else {
        simpleLink.removeClass("simple-link--closing");

        if (hover) {
          simpleLink.addClass("simple-link--openning");
        } else {
          simpleLink.addClass("simple-link--closed");
        }
      }
    });
  });
}

function pageTitleFade() {
  let fadeStart = $(".page__main")[0].offsetTop + $(window).height() / 2;
  let fadeDist = $(window).height() / 4;

  let beforeFade = true;
  let afterFade = false;

  let windowBottomY = pageYOffset + $(window).height();

  if ($(window).width() > 1200) {
    if (windowBottomY > fadeStart + fadeDist) {
      $(".page-title").css("opacity", 0);
      $(".page-title").css("pointer-events", "none");

      afterFade = true;
      beforeFade = false;
    } else if (windowBottomY < fadeStart) {
      $(".page-title").css("opacity", 1);
      $(".page-title").css("pointer-events", "all");

      beforeFade = true;
      afterFade = false;
    } else {
      const fadeProgress = (windowBottomY - fadeStart) / fadeDist;
      
      $(".page-title").css("opacity", 1 - fadeProgress);
      $(".page-title").css("pointer-events", "all");
    }
  }

  $(window).resize(() => {
    if ($(window).width() > 1200) {
      windowBottomY = pageYOffset + $(window).height();

      if (windowBottomY > fadeStart + fadeDist) {
        $(".page-title").css("opacity", 0);
        $(".page-title").css("pointer-events", "none");

        afterFade = true;
        beforeFade = false;
      } else if (windowBottomY < fadeStart) {
        $(".page-title").css("opacity", 1);
        $(".page-title").css("pointer-events", "all");

        beforeFade = true;
        afterFade = false;
      } else {
        const fadeProgress = (windowBottomY - fadeStart) / fadeDist;
        
        $(".page-title").css("opacity", 1 - fadeProgress);
        $(".page-title").css("pointer-events", "all");
      }
    } else {
      $(".page-title").css("opacity", 1);
    }
  });

  $(window).scroll(() => {
    if ($(window).width() > 1200) {
      windowBottomY = pageYOffset + $(window).height();

      if (windowBottomY > fadeStart + fadeDist) {
        if (!afterFade) {
          $(".page-title").css("opacity", "0");
          $(".page-title").css("pointer-events", "none");
          
          afterFade = true;
        }
      } else if (windowBottomY < fadeStart) {
        if (!beforeFade) {
          $(".page-title").css("opacity", 1);
          $(".page-title").css("pointer-events", "all");
    
          beforeFade = true;
        }
      } else {
        const fadeProgress = (windowBottomY - fadeStart) / fadeDist;
        
        $(".page-title").css("opacity", 1 - fadeProgress);
        $(".page-title").css("pointer-events", "all");
    
        if (beforeFade) {
          beforeFade = false;
        }
    
        if (afterFade) {
          afterFade = false;
        }
      }
    }
  });
}

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
  const SCALE_DISTANCE = 270;
  const START_OPACITY = getComputedStyle($(".camera")[0]).opacity;

  const headerHeight = $(".page__header").height();
  const scaleDistanceTail = 270;
  const scaleDistance = headerHeight + scaleDistanceTail;

  if (pageYOffset <= SCALE_DISTANCE) {
    const progress = pageYOffset / SCALE_DISTANCE;

    $(".camera").css("transform", `scale(${1 + progress}, ${1 + progress})`);
    $(".camera").css("opacity", (1 - 0.6 * progress) * START_OPACITY);
  } else {
    const progress = (pageYOffset - SCALE_DISTANCE) / ($(document).height() - SCALE_DISTANCE - $(".page__header").height());
    $(".camera").css("transform", `scale(${2 - 0.35 * progress}, ${2 - 0.35 * progress}) translate(${-80 * progress}px, ${-80 * progress}px)`);
    $(".camera").css("opacity", (0.4 * (1 - progress)) * START_OPACITY);
  }

  $(window).scroll((event) => {
    const SCALE_DISTANCE = 270;

    if (pageYOffset <= SCALE_DISTANCE) {
      const progress = pageYOffset / SCALE_DISTANCE;

      $(".camera").css("transform", `scale(${1 + progress}, ${1 + progress})`);
      $(".camera").css("opacity", (1 - 0.6 * progress) * START_OPACITY);
    } else {
      const progress = (pageYOffset - SCALE_DISTANCE) / ($(document).height() - SCALE_DISTANCE - $(".page__header").height());
      $(".camera").css("transform", `scale(${2 - 0.35 * progress}, ${2 - 0.35 * progress}) translate(${-80 * progress}px, ${-80 * progress}px)`);
      $(".camera").css("opacity", (0.4 * (1 - progress)) * START_OPACITY);
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
