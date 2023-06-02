import { motion } from "framer-motion"

function ToggleHighlights({ showHighlights, setShowHighlights }) {
  return (
    <div className="absolute  top-8 right-8 z-30 flex  rounded-full gap-2 border-purple-darkest border-2 h-8">
      <button
        className="font-bold text-[24px] h-full relative px-2 focus:ring-0"
        onClick={() => setShowHighlights(true)}
      >
        {showHighlights && (
          <motion.div
            layoutId="pill"
            className="absolute inset-0 bg-white "
            style={{ borderRadius: 9999 }}
          ></motion.div>
        )}
        <span className=" block relative z-10 mix-blend-exclusion text-sm uppercase font-black ">
          Highlights
        </span>
      </button>
      <button
        className="font-bold text-[24px] h-full relative px-2 focus:ring-0"
        onClick={() => setShowHighlights(false)}
      >
        {!showHighlights && (
          <motion.div
            layoutId="pill"
            className="absolute inset-0 bg-white  "
            style={{ borderRadius: 9999 }}
          ></motion.div>
        )}
        <span className=" block relative z-10 mix-blend-exclusion text-sm uppercase font-black">
          All builds
        </span>
      </button>
    </div>
  )
}

export default ToggleHighlights
