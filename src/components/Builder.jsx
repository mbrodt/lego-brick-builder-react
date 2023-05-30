import { useEffect, useState } from "react";
import { Application } from "../builder/Application";
import TipsToggle from "./TipsToggle";

import useBricksStore from "../store/bricks";
import TipsOverlay from "./TipsOverlay";

function Builder() {
  const [isShowingTips, setIsShowingTips] = useState(true);
  const bricks = useBricksStore((state) => state.bricks);
  useEffect(() => {
    const canvasDom = document.getElementById("builder");
    console.log("canvasDom:", canvasDom);

    const application = new Application(canvasDom, false);
  }, []);

  function closeTips() {
    setIsShowingTips(false);
  }

  function openTips() {
    setIsShowingTips(true);
  }

  function submit() {
    console.log("submit build", bricks);
  }
  return (
    <div className="w-full h-full overflow-hidden relative bg-purple ">
      <canvas
        className={`w-full h-full transition-all duration-500 noselect ${
          isShowingTips
            ? "-translate-y-[20vh] scale-125"
            : "translate-y-0 scale-100 "
        }`}
        id="builder"
      ></canvas>

      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-12 z-30 mx-auto flex duration-500 transition-all ${
          isShowingTips
            ? "translate-y-24 opacity-0"
            : "translate-y-0 delay-1000 opacity-100"
        }`}
      >
        <button onClick={submit} className="btn w-64">
          Finish building
        </button>
      </div>

      <TipsToggle
        openTips={openTips}
        closeTips={closeTips}
        isShowingTips={isShowingTips}
      />
      <TipsOverlay closeTips={closeTips} isShowingTips={isShowingTips} />
    </div>
  );
}

export default Builder;
