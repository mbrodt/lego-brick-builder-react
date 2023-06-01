import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Application } from "../builder/Application"

import TipsToggle from "./TipsToggle"

import useBricksStore from "../store/bricks"
import TipsOverlay from "./TipsOverlay"

function Builder() {
  const [isShowingTips, setIsShowingTips] = useState(false)
  const navigate = useNavigate("/solutions")

  useEffect(() => {
    const canvasDom = document.getElementById("builder")

    new Application(canvasDom, false)
  }, [])

  function closeTips() {
    setIsShowingTips(false)
  }

  function openTips() {
    setIsShowingTips(true)
  }

  async function submit() {
    const bricks = useBricksStore.getState().bricks
    const data = {
      id: uuidv4(),
      createdAt: Date.now(),
      meta: {
        // Random number between 40 and 180
        time: Math.floor(Math.random() * (180 - 40 + 1) + 40),
        // Random number between 8 and 32
        moves: Math.floor(Math.random() * (32 - 8 + 1) + 8),
      },
      bricks,
    }
    console.log("data:", data)
    await fetch("http://localhost:3000/solutions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    navigate("/solutions")
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
  )
}

export default Builder
