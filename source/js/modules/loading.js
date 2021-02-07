export default () => document.addEventListener(`DOMContentLoaded`, () => {
  setTimeout(() => {
    document.body.classList.add(`loaded`);
  }, 0);
});
