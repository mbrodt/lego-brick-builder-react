import { useState } from "react"
import SolutionsGrid from "../components/SolutionsGrid"
import { useQuery } from "react-query"
import SolutionsHighlight from "../components/SolutionsHighlight"
import { motion } from "framer-motion"
import ToggleHighlights from "../components/ToggleHighlights"

function Solutions() {
  const [showHighlights, setShowHighlights] = useState(false)
  const { isLoading, data } = useQuery("solutions", () => {
    return fetch("https://solution-store.onrender.com/solutions").then((res) =>
      res.json()
    )
  })

  if (isLoading) return

  // Sort the data by createdAt, which is a unix timestamp, to get the newest solutions first
  data.sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="w-full h-full bg-purple-light text-white">
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ToggleHighlights
          showHighlights={showHighlights}
          setShowHighlights={setShowHighlights}
        />

        {showHighlights ? (
          <SolutionsHighlight solutions={data} />
        ) : (
          <SolutionsGrid solutions={data} />
        )}
      </motion.div>

      <a
        href="/"
        className="btn w-64 absolute z-50 bottom-8 left-1/2 -translate-x-1/2"
      >
        Go again!
      </a>
    </div>
  )
}

export default Solutions
