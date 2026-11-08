/** Estado mínimo compartilhado entre a intro (JS puro) e o app React. */
type Listener = () => void

let opened = false
const listeners = new Set<Listener>()

export const appState = {
  isOpened: () => opened,
  open() {
    if (opened) return
    opened = true
    listeners.forEach((l) => l())
  },
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}
