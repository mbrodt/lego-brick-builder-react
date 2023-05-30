import { tips } from "../js/utils";
import SvgIcon from "./SvgIcon";

function BuildingTips() {
  return (
    <div className="w-screen relative flex justify-between max-w-[1200px] mb-8 text-white">
      {tips.map(({ title, message, icon }, idx) => (
        <div key={title} className="duration-500 flex-1 flex items center">
          <div className="flex justify-center items-center box-content h-full w-full flex-col p-2">
            <div className="rounded-xl bg-purple-dark text-white p-1 h-lg:p-[10px] aspect-square w-15 h-15 h-lg:w-19 h-lg:h-19 flex justify-center items-center shrink-0">
              <SvgIcon name={icon} />
            </div>

            <div className="mt-[15px] leading-[19px] text-lg flex flex-col text-center max-w-[200px]">
              <span className="capitalize text-base font-medium">{title}</span>
              <span className="text-base mt-[15px]"> {message} </span>
            </div>
          </div>
          {tips.length - 1 !== idx && (
            <div className="h-2/3 w-[1px] bg-white"></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BuildingTips;
