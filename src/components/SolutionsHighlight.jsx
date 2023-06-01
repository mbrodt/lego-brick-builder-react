import { useEffect, useState } from "react"
import { MultipleSceneRenderer } from "../builder/MultipleSceneRenderer"
import FastestSolutions from "./FastestSolutions"
import FewestMovesSolutions from "./FewestMovesSolutions"

function SolutionsHighlight({ solutions }) {
  const [activeCategory, setActiveCategory] = useState("fastest")

  function initSolutionScenes(highlightSolutions) {
    const globalCanvas = document.querySelector("#global-canvas")
    const solutionCanvasses = document.querySelectorAll(".solution-canvas")

    new MultipleSceneRenderer({
      canvas: globalCanvas,
      solutionCanvasses,
      solutions: highlightSolutions,
    })
  }

  return (
    <div className="w-full h-full ">
      <div className="pt-16">
        {activeCategory === "fewest" && (
          <button
            className="absolute top-1/2 left-8 z-40 w-8 h-8 rounded-full bg-white"
            onClick={() => setActiveCategory("fastest")}
          >
            {/* html right arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 rotate-180 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="#000"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        {activeCategory === "fastest" && (
          <button
            className="absolute top-1/2 right-8 z-40 w-8 h-8 rounded-full bg-white"
            onClick={() => setActiveCategory("fewest")}
          >
            {/* html right arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="#000"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        <canvas
          id="global-canvas"
          className="noselect fixed left-0 top-0 w-full h-full block z-10"
        ></canvas>
        {activeCategory === "fastest" && (
          <FastestSolutions
            solutions={solutions}
            initSolutionScenes={initSolutionScenes}
          />
        )}
        {activeCategory === "fewest" && (
          <FewestMovesSolutions
            solutions={solutions}
            initSolutionScenes={initSolutionScenes}
          />
        )}
      </div>
    </div>
  )
}

export default SolutionsHighlight
