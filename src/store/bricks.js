import { create } from "zustand"

const useBricksStore = create((set) => ({
  bricks: [],
  time: 0,
  moves: 0,
}))

export default useBricksStore
