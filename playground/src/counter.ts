import AnotherIcon from "../src/assets/icon/module.svg";
export function setupCounter(element: HTMLButtonElement) {
  let _ = AnotherIcon
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
