import i18Obj from '../js/translate.js';

const burgerElement = document.querySelector('.nav__icon');
const navElement = document.querySelector('.navigation');
const navListElement = document.querySelector('.navigation__list');
const shadowedBoxEl = document.querySelector('.mask-layout');
const portfolioBtnsElement = document.querySelector('.portfolio-btns__wrapper');
const portfolioImgElements = document.querySelectorAll('.portfolio-img');
const langBtnEnElement = document.querySelector('.lang-link.en');
const langBtnRuElement = document.querySelector('.lang-link.ru');
const themeSwitchElement = document.querySelector('.theme-switch');

let lang, theme;

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
themeSwitchElement.addEventListener('click', () => {
  theme == 'light' ? (theme = 'dark') : (theme = 'light');
  changeTheme(theme);
});

langBtnRuElement.addEventListener('click', () => {
  lang = 'ru';
  getTranslate(lang);
  changeClassActive('.lang-link', 'active');
});

langBtnEnElement.addEventListener('click', () => {
  lang = 'en';
  getTranslate(lang);
  changeClassActive('.lang-link', 'active');
});

burgerElement.addEventListener('click', toggleMenu);
burgerElement.addEventListener('click', closeMenu);
navListElement.addEventListener('click', closeMenu);
portfolioBtnsElement.addEventListener('click', changeImage);

//Burger

function toggleMenu() {
  burgerElement.classList.toggle('active');
  navElement.classList.toggle('active');
  shadowedBoxEl.classList.toggle('active');
}
function closeMenu(event) {
  if (event.target.classList.contains('navigation__link')) {
    burgerElement.classList.remove('active');
    navElement.classList.remove('active');
    shadowedBoxEl.classList.remove('active');
  }
}

//Portfolio image changing

function changeImage(evt) {
  if (evt.target.classList.contains('portfolio-btn')) {
    const dataSeason = evt.target.dataset.season;
    portfolioImgElements.forEach(
      (img, index) => (img.src = `./assets/img/${dataSeason}/${index + 1}.jpg`)
    );
  }
}

//Active class fnc

function changeClassActive(selector, activeClass) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((elem) => {
    elem.addEventListener('click', function (evt) {
      elements.forEach((elem) => elem.classList.remove(activeClass));
      evt.target.classList.add(activeClass);
    });
  });
}

//Preload image fnc

function preloadImage() {
  const seasons = ['winter', 'spring', 'summer', 'autumn'];
  seasons.forEach((season) => {
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `./assets/img/${season}/${i}.jpg`;
    }
  });
}

//Page translation fnc

function getTranslate(lang) {
  const langEls = document.querySelectorAll('[data-i18n]');

  langEls.forEach((currentElement) => {
    const i18nData = currentElement.dataset.i18n;
    currentElement.textContent = i18Obj[lang][i18nData];
    if (currentElement.placeholder) {
      currentElement.placeholder = i18Obj[lang][i18nData];
      currentElement.textContent = '';
    }
  });

  lang === 'en'
    ? changeClassActive('.lang-link .en', 'active')
    : changeClassActive('.lang-link .ru', 'active');
}

//Theme changing fnc

function changeTheme(theme) {
  if (theme === 'light') {
    const link = document.createElement('link');
    link.id = 'light-theme';
    link.rel = 'stylesheet';
    link.href = './css/light-theme.css';
    document.head.append(link);
    themeSwitchElement.style.backgroundImage = 'url(./assets/svg/eclipse.svg)';
  } else {
    const link = document.getElementById('light-theme');
    if (link) {
      link.remove();
      themeSwitchElement.style.backgroundImage = 'url(./assets/svg/sun.svg)';
    }
  }
}

//LocalStorage

function setLocalStorage() {
  localStorage.setItem('lang', lang);
  localStorage.setItem('theme', theme);
}

function getLocalStorage() {
  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
    getTranslate(lang);
    document.querySelector(`.lang-link.${lang}`).classList.add('active');
  } else {
    lang = 'en';
    getTranslate(lang);
    localStorage.setItem('lang', lang);
    langBtnEnElement.classList.add('active');
  }

  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme');
    changeTheme(theme);
  } else {
    theme = 'dark';
    changeTheme(theme);
    localStorage.setItem('theme', theme);
  }
}

changeClassActive('.portfolio-btn', 'active');
preloadImage();

//Player controls
const playerElement = document.querySelector('.player-wrapper');
const videoElement = playerElement.querySelector('.video-player');
const progressElement = playerElement.querySelector('.progress');
const progressBarElement = playerElement.querySelector('.progress__filled');
const toggleBtnElement = playerElement.querySelector('.toggle');
const volumeBtnElement = playerElement.querySelector('.volume');
const artisticBtnElement = playerElement.querySelector('.art');
const skipBtnsEls = playerElement.querySelectorAll('[data-skip]');
const rangeElement = playerElement.querySelector('.player__slider');

function playPauseHandler() {
  if (videoElement.paused) {
    videoElement.play();
    artisticBtnElement.style.display = 'none';
  } else {
    videoElement.pause();
    artisticBtnElement.style.display = 'block';
  }
}
function updateBtnHandler() {
  const icon = this.paused
    ? 'url(./assets/svg/play.svg)'
    : 'url(./assets/svg/pause.svg)';
  toggleBtnElement.style.backgroundImage = icon;
}

function skipTimeHandler() {
  videoElement.currentTime += parseFloat(this.dataset.skip);
}
function volumeChangeHandler() {
  const volume = this.value;
  videoElement.volume = volume;
  volumeStyleMute();
}
function muteVolumeHandler() {
  let volume = videoElement.volume;
  if (videoElement.volume !== 0) {
    videoElement.volume = 0;
    volumeStyleMute();
  } else {
    videoElement.volume = 0.3;
    volumeStyleMute();
  }
  
}
function rangeStyleChange() {
  const value = this.value * 100;
  this.style.background = `linear-gradient(
    to right,
    #bdae82 0%,
    #bdae82 ${value}%,
    #c8c8c8 ${value}%,
    #c8c8c8 100%
  )`;
}

function progressHandler() {
  const progress = videoElement.currentTime / videoElement.duration;
  progressBarElement.style.flexBasis = Math.floor(progress * 1000) / 10 + '%';
}

function volumeStyleMute() {
  const volume = videoElement.volume;
  if (volume > 0) {
    volumeBtnElement.style.backgroundImage = 'url(./assets/svg/volume.svg)';
  } else {
    volumeBtnElement.style.backgroundImage = 'url(./assets/svg/muted.svg)';
  }
}
function scrubHandler(e) {
  const scrubTime =
    (e.offsetX / progressElement.offsetWidth) * videoElement.duration;
  videoElement.currentTime = scrubTime;
}

videoElement.addEventListener('click', playPauseHandler);
toggleBtnElement.addEventListener('click', playPauseHandler);
artisticBtnElement.addEventListener('click', playPauseHandler);
videoElement.addEventListener('play', updateBtnHandler);
videoElement.addEventListener('pause', updateBtnHandler);
videoElement.addEventListener('timeupdate', progressHandler);
skipBtnsEls.forEach((btn) => {
  btn.addEventListener('click', skipTimeHandler);
});
rangeElement.addEventListener('change', volumeChangeHandler);
rangeElement.addEventListener('mousemove', volumeChangeHandler);
rangeElement.addEventListener('input', rangeStyleChange);
progressElement.addEventListener('click', scrubHandler);
volumeBtnElement.addEventListener('click', muteVolumeHandler);

let mousedown = false;
progressElement.addEventListener(
  'mousemove',
  (e) => mousedown && scrubHandler(e)
);
progressElement.addEventListener('mousedown', () => (mousedown = true));
progressElement.addEventListener('mouseup', () => (mousedown = false));

console.log(' 1.Вёрстка +10\n вёрстка видеоплеера: есть само видео, в панели управления есть кнопка Play/Pause, прогресс-бар, кнопка Volume/Mute, регулятор громкости звука +5\n в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\n 2.Кнопка Play/Pause на панели управления +10\n при клике по кнопке Play/Pause запускается или останавливается проигрывание видео +5\n внешний вид и функционал кнопки изменяется в зависимости от того, проигрывается ли видео в данный момент +5\n 3.Прогресс-бар отображает прогресс проигрывания видео. При перемещении ползунка прогресс-бара вручную меняется текущее время проигрывания видео. Разный цвет прогресс-бара до и после ползунка +10\n 4.При перемещении ползунка регулятора громкости звука можно сделать звук громче или тише. Разный цвет регулятора громкости звука до и после ползунка +10\n 5.При клике по кнопке Volume/Mute можно включить или отключить звук. Одновременно с включением/выключением звука меняется внешний вид кнопки. Также внешний вид кнопки меняется, если звук включают или выключают перетягиванием регулятора громкости звука от нуля или до нуля +10\n 5.Кнопка Play/Pause в центре видео +10\n есть кнопка Play/Pause в центре видео при клике по которой запускается видео и отображается панель управления +5\n когда видео проигрывается, кнопка Play/Pause в центре видео скрывается, когда видео останавливается, кнопка снова отображается +5\n Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения: перемотка видео.\n Total: 60');