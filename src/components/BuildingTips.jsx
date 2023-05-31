import { tips } from "../js/utils"
import SvgGestureMove from "@/assets/gesture-move.svg"
import SvgGestureZoom from "@/assets/gesture-zoom.svg"
import SvgGestureRotate from "@/assets/gesture-rotate.svg"
import SvgGestureViewpoint from "@/assets/gesture-viewpoint.svg"

const icons = {
  "gesture-move": SvgGestureMove,
  "gesture-zoom": SvgGestureZoom,
  "gesture-rotate": SvgGestureRotate,
  "gesture-viewpoint": SvgGestureViewpoint,
}

function BuildingTips() {
  return (
    <div className="w-screen relative flex justify-between max-w-[1200px] mb-8 text-white">
      {tips.map(({ title, message, icon }, idx) => {
        const TipIcon = icons[icon]
        return (
          <div key={title} className="duration-500 flex-1 flex items center">
            <div className="flex justify-center items-center box-content h-full w-full flex-col p-2">
              <div className="rounded-xl bg-purple-dark text-white p-1 h-lg:p-[10px] aspect-square w-15 h-15 h-lg:w-19 h-lg:h-19 flex justify-center items-center shrink-0">
                <TipIcon />
              </div>

              <div className="mt-[15px] leading-[19px] text-lg flex flex-col text-center max-w-[200px]">
                <span className="capitalize text-base font-medium">
                  {title}
                </span>
                <span className="text-base mt-[15px]"> {message} </span>
              </div>
            </div>
            {tips.length - 1 !== idx && (
              <div className="h-2/3 w-[1px] bg-white"></div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default BuildingTips
