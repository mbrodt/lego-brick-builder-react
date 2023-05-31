// NOT CURRENTLY USED
// Lazy loading the component causes flickering issues, if not this would be the ideal way to handle icons...

import { lazy, Suspense } from "react"
const SvgIcon = ({ name, className }) => {
  const IconComponent = lazy(() => import(`@/assets/${name}.svg`))
  console.log("IconComponent:", IconComponent)
  return (
    <Suspense>
      <IconComponent className={className} />
    </Suspense>
  )
}

export default SvgIcon
