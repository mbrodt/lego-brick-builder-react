import SvgLightBulb from "@/assets/light-bulb.svg"
import SvgClose from "@/assets/close.svg"
function TipsToggle({ isShowingTips, openTips, closeTips }) {
  console.log("rendering")
  return (
    <div className="col-end-[-1] justify-end flex absolute z-20 top-8 right-8">
      <div className="cursor-pointer z-20 rounded-full text-sm bg-purple-dark text-white py-[7px] px-[10px] w-20 overflow-hidden flex">
        <button
          onClick={openTips}
          className={`flex items-center justify-center w-full h-5 gap-[8px] focus:ring-0  transition-transform duration-700 shrink-0 ${
            isShowingTips ? "-translate-x-20" : "translate-x-0"
          }`}
        >
          <SvgLightBulb className="w-5" />
          <span>Tips</span>
        </button>
        <button
          onClick={closeTips}
          className={`flex items-center justify-center w-full h-5 gap-2 focus:ring-0 transition-transform duration-700 shrink-0 ${
            isShowingTips ? "-translate-x-16" : "translate-x-0"
          }`}
        >
          <span>Tips</span>
          <SvgClose className="w-4" />
        </button>
      </div>
    </div>
  )
}

export default TipsToggle
