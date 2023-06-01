import { useState } from "react"
import SolutionsGrid from "../components/SolutionsGrid"
import { useQuery } from "react-query"
import SolutionsHighlight from "../components/SolutionsHighlight"

function Solutions() {
  const [showHighlights, setShowHighlights] = useState(false)
  const { isLoading, data } = useQuery("solutions", () => {
    return fetch("http://localhost:3000/solutions").then((res) => res.json())
  })

  if (isLoading) return

  // Sort the data by createdAt, which is a unix timestamp, to get the newest solutions first
  data.sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="w-full h-full bg-purple-light">
      <button
        className="absolute btn top-8 right-8 z-30"
        onClick={() => setShowHighlights(!showHighlights)}
      >
        Toggle highlights
      </button>
      {showHighlights ? (
        <SolutionsHighlight solutions={data} />
      ) : (
        <SolutionsGrid solutions={data} />
      )}
      {/* <SolutionsHighlight solutions={data} /> */}
    </div>
  )
}

export default Solutions
