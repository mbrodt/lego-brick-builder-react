import { create } from "zustand";

const useBricksStore = create((set) => ({
  bricks: [],
}));

export default useBricksStore;
