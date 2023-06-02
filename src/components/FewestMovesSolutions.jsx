import { useEffect, useState } from "react"
import HighlightBadge from "./HighlightBadge"
function FewestMovesSolutions({ solutions, initSolutionScenes }) {
  const [fewestMoves, setFewestMoves] = useState([])

  useEffect(() => {
    const fewest = [...solutions]
      .sort((a, b) => a.meta.moves - b.meta.moves)
      .slice(0, 2)
    setFewestMoves(fewest)
    initSolutionScenes(fewest)
  }, [])

  return (
    <div>
      <h1 className="text-center font-black  text-xl text-white z-40 relative">
        Fewest moves
      </h1>
      <div className="z-20 relative grid grid-cols-2 gap-8 max-w-5xl w-full mx-auto p-16">
        <div className="w-full self-end aspect-[1/1.5] row-start-1 relative col-start-1">
          <HighlightBadge
            position="1st"
            value={fewestMoves[0]?.meta.moves + " moves"}
          />
          <div className="solution-canvas h-full w-full "></div>
        </div>
        <div
          className="w-full  relative
 self-end aspect-[1/1.1] row-start-1 col-start-2"
        >
          <HighlightBadge
            position="2nd"
            value={fewestMoves[1]?.meta.moves + " moves"}
          />
          <div className="solution-canvas h-full w-full "></div>
        </div>
      </div>
    </div>
  )
}

export default FewestMovesSolutions
