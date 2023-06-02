import { Link } from "react-router-dom"
import { motion } from "framer-motion"
function StartBuilding() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
      >
        <Link
          to="/builder-page"
          className="w-64 h-64 rounded-full bg-yellow text-lg text-black flex items-center justify-center font-black"
        >
          Start building
        </Link>
      </motion.div>
    </div>
  )
}

export default StartBuilding
