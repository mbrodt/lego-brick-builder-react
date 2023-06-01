import { useEffect, useState } from "react"

function FastestSolutions({ solutions, initSolutionScenes }) {
  const [fastestSolutions, setFastestSolutions] = useState([])

  useEffect(() => {
    const fastest = [...solutions]
      .sort((a, b) => a.meta.time - b.meta.time)
      .slice(0, 3)
    setFastestSolutions(fastest)
    initSolutionScenes(fastest)
  }, [])

  return (
    <div>
      <h1 className="text-center font-black  text-xl text-white z-40 relative">
        Fastest builds
      </h1>
      <div className="z-20 relative grid grid-cols-3 gap-8 max-w-7xl w-full mx-auto p-16">
        {/* NOTE: These are positioned using col-start so the order in the UI is 2 -> 1 -> 3 to resemble a podium, without changing the order of the array that might mess up the ThreeJS scenes */}
        <div className="w-full self-end aspect-[1/1.5] row-start-1 col-start-2">
          1st {fastestSolutions[0]?.meta.time}
          <div className="solution-canvas h-full w-full "></div>
        </div>
        <div className="w-full self-end aspect-[1/1.25] row-start-1 col-start-1">
          2nd {fastestSolutions[1]?.meta.time}
          <div className="solution-canvas h-full w-full "></div>
        </div>
        <div className="w-full self-end aspect-[1/1] row-start-1 col-start-3 ">
          3rd {fastestSolutions[2]?.meta.time}
          <div className="solution-canvas h-full w-full "></div>
        </div>
      </div>
    </div>
  )
}

export default FastestSolutions
