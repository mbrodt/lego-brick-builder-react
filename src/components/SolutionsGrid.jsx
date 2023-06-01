import { useEffect, useState } from "react"
import { MultipleSceneRenderer } from "../builder/MultipleSceneRenderer"
import SolutionsPagination from "./SolutionsPagination"

const SOLUTIONS_PER_PAGE = 8

function SolutionsGrid({ solutions }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSolutions, setCurrentSolutions] = useState([])

  const numberOfPages = Math.ceil(solutions.length / SOLUTIONS_PER_PAGE)

  function initSolutionScenes() {
    const globalCanvas = document.querySelector("#global-canvas")

    const start = (currentPage - 1) * SOLUTIONS_PER_PAGE
    const end = start + SOLUTIONS_PER_PAGE
    const currSolutions = solutions.slice(start, end)

    setCurrentSolutions(currSolutions)

    setTimeout(() => {
      const solutionCanvasses = document.querySelectorAll(".solution-canvas")

      new MultipleSceneRenderer({
        canvas: globalCanvas,
        solutionCanvasses,
        solutions: currSolutions,
      })
    }, 100)
  }

  function changeCurrentPage(page) {
    setCurrentPage(page)
  }

  useEffect(() => {
    initSolutionScenes()
  }, [currentPage])

  return (
    <div className="w-full h-full">
      {/* <!-- This is the overarching canvas used to render all the individual solutions into using ThreeJS Scissor Test --> */}
      <canvas
        id="global-canvas"
        className="noselect fixed left-0 top-0 w-full h-full block z-10"
      ></canvas>
      <div className="z-20 relative grid grid-cols-6 gap-8 p-16">
        {currentSolutions.map(({ id, meta, bricks }) => {
          return (
            <div className="w-full rounded-lg  aspect-square" key={id}>
              Time: {meta.time}, moves: {meta.moves}
              <div
                id={id}
                className="solution-canvas w-full aspect-square"
              ></div>
            </div>
          )
        })}
      </div>
      <SolutionsPagination
        currentPage={currentPage}
        changeCurrentPage={changeCurrentPage}
        numberOfPages={numberOfPages}
      />
    </div>
  )
}

export default SolutionsGrid
