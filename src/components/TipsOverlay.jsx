import BuildingTips from "./BuildingTips"

function TipsOverlay({ isShowingTips, closeTips }) {
  return (
    <div
      className={`absolute z-10 opacity-0 origin-bottom translate-y-[50%] w-full tips-bg h-screen transition-all duration-500 ${
        isShowingTips ? "!translate-y-0 !opacity-100" : "pointer-events-none"
      }`}
    >
      <div className="absolute inset-x-0 flex flex-col items-center mx-auto bottom-12 ">
        <span className="text-[32px] mb-[30px] text-white font-black">
          Tips
        </span>
        <BuildingTips />
        <button className="btn w-64" onClick={closeTips}>
          Got it!
        </button>
      </div>
    </div>
  )
}

export default TipsOverlay
