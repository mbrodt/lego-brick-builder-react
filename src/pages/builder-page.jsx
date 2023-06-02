import Builder from "../components/Builder"
import { motion } from "framer-motion"
function BuilderPage() {
  return (
    <div className="w-full h-full bg-green">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full h-full"
      >
        <Builder />
      </motion.div>
    </div>
  )
}

export default BuilderPage
