import throttle from 'lodash/throttle';

const HISTORY_SCREEN_INDEX = 1;
const PRIZES_SCREEN_INDEX = 2;
const COVER_PAGE_DURATION_MS = 500;

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.screenBackground = document.querySelector(`.screen--background`);

    this.activeScreen = 0;
    this.previousScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: false}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    const isForwardDirection = evt.deltaY > 0;
    if (currentPosition !== this.activeScreen) {
      if (this.activeScreen === PRIZES_SCREEN_INDEX && isForwardDirection) {
        this.coverPage();
        setTimeout(() => {
          this.changePageDisplay();
        }, COVER_PAGE_DURATION_MS);
      } else {
        this.changePageDisplay();
      }
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.previousScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    if (this.activeScreen === PRIZES_SCREEN_INDEX && this.previousScreen === HISTORY_SCREEN_INDEX) {
      this.coverPage();
      setTimeout(() => {
        this.changePageDisplay();
      }, COVER_PAGE_DURATION_MS);
    } else {
      this.changePageDisplay();
    }
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    this.screenElements[this.activeScreen].classList.add(`active`);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  coverPage() {
    this.screenBackground.classList.add(`active`);
    setTimeout(() => {
      this.screenBackground.classList.remove(`active`);
    }, COVER_PAGE_DURATION_MS);
  }
}
