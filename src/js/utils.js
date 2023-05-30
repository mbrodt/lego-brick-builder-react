import clickSoundFile from "/click-sound.mp3";
import { Howl } from "howler";
export const ROOM_STATES = {
  NEW: "new",
  READY: "ready",
  STARTED: "started",
  FINISHED: "finished",
  REFLECTING: "reflecting",
  CLOSED: "closed",
};

export const mainBuilderColor = "rgb(93, 59, 178)";

export const tips = [
  {
    title: "Move Brick",
    message: "Click and drag to move brick in building space",
    icon: "gesture-move",
  },
  {
    title: "Zoom",
    message: "Pinch or scroll anywhere to zoom in and out",
    icon: "gesture-zoom",
  },
  {
    title: "Rotate",
    message: "Click or tap on brick to adjust rotation",
    icon: "gesture-rotate",
  },
  {
    title: "Viewpoint",
    message: "Click and drag to adjust viewpoint of building space",
    icon: "gesture-viewpoint",
  },
];
// format the duration in minutes and seconds like 05:00
export const formatDurationInMinutes = (duration) => {
  let minutes = Math.floor(duration / 60);

  minutes < 10 ? (minutes = `0${minutes}`) : "";

  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

export function mapConstrain(n, start1, stop1, start2, stop2) {
  const start = start2 !== undefined ? start2 : start1;
  const stop = stop2 !== undefined ? stop2 : stop1;
  const min = Math.min(start, stop);
  const max = Math.max(start, stop);
  return constrain(map(n, start1, stop1, start, stop), min, max);
}

export const setThemeColor = (color) => {
  const globalColors = {
    green: "#02A947",
    purple: "#4C2E92",
    lightPurple: "#7249D9",
  };

  const themeColor = document.querySelector("meta[name=theme-color]");
  themeColor.setAttribute("content", globalColors[color]);
};

const clickySound = new Howl({
  src: [clickSoundFile],
});

export const playClickSound = () => {
  clickySound?.play();
};

export const lightenDarkenColor = (col, amt) => {
  var usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

export const findLowestScore = (words) => {
  const lowestScore = Math.min(...words.map((word) => word.score));
  return lowestScore;
};
export const findHighestScore = (words) => {
  const highestScore = Math.max(...words.map((word) => word.score));
  return highestScore;
};
