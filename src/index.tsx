import Hammer from "hammerjs";
import LogRocket from "logrocket";
import ReactDOM from "react-dom/client";
import ResizeObserverCompt from "resize-observer-polyfill";
import App from "./components";
import "./styles/main.scss";

if (typeof window.ResizeObserver === "undefined") {
  window.ResizeObserver = ResizeObserverCompt;
}

if (process.env.NODE_ENV === "production")
  LogRocket.init("c3j0mc/pilotaptitudetest");

const container = document.querySelector("#root");
if (!container) throw new Error("Root DOM element was not found.");

const root = ReactDOM.createRoot(container);
root.render(<App />);

disablePitchToZoom();

function disablePitchToZoom() {
  const bodyElement = document.body;
  const hammer = new Hammer(bodyElement);

  hammer.get("pinch").set({ enable: false });

  document.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
}
