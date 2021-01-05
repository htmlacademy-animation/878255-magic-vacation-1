export class AccentTypographyBuilder {
  constructor({
    elementSelector,
    timer = 330,
    classForActivate = `active`,
    property = `transform`
  }) {
    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;

    this._property = property;
    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = Math.floor(Math.random() * (this._timer * 0.8));
    this._wordDelay = 0;
    this.prepareText();

  }

  createElement(letter, wordDelay) {
    const span = document.createElement(`span`);
    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer}ms ease-out ${this._timeOffset + wordDelay}ms`;
    this._timeOffset = Math.floor(Math.random() * (this._timer * 0.8));
    return span;
  }

  prepareText() {
    if (!this._element) {
      return;
    }

    const text = this._element.textContent.trim().split(` `);
    const content = text.reduce((fragmentParent, word) => {
      const wordElement = Array.from(word).reduce((fragment, letter) => {
        fragment.appendChild(this.createElement(letter, this._wordDelay));
        return fragment;
      }, document.createDocumentFragment());
      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(`text__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);
      this._wordDelay += this._timer * 0.4;
      return fragmentParent;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }

    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}

const introTitle = new AccentTypographyBuilder({elementSelector: `.intro__title`});
const introDate = new AccentTypographyBuilder({elementSelector: `.intro__date`, timer: 200});
const historyTitle = new AccentTypographyBuilder({elementSelector: `.slider__item-title`});
const prizesTitle = new AccentTypographyBuilder({elementSelector: `.prizes__title`});
const rulesTitle = new AccentTypographyBuilder({elementSelector: `.rules__title`});
const gameTitle = new AccentTypographyBuilder({elementSelector: `.game__title`});

export function animateTypography (screenIndex) {
  if (screenIndex === 0) {
    introTitle.destroyAnimation();
    introDate.destroyAnimation();

    setTimeout(() => {
      introTitle.runAnimation();
    }, 700);
    setTimeout(() => {
      introDate.runAnimation();
    }, 1100);
  }
  if (screenIndex === 1) {
    historyTitle.destroyAnimation();
    setTimeout(() => {
      historyTitle.runAnimation();
    }, 50);
  }

  if (screenIndex === 2) {
    prizesTitle.destroyAnimation();
    setTimeout(() => {
    prizesTitle.runAnimation();
    }, 50);
  }
  if (screenIndex === 3) {
    rulesTitle.destroyAnimation();
    setTimeout(() => {
    rulesTitle.runAnimation();
    }, 50);
  }
  if (screenIndex === 4) {
    gameTitle.destroyAnimation();
    setTimeout(() => {
    gameTitle.runAnimation();
    }, 50);
  }
}
