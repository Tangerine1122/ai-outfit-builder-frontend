import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ClosetPage from "./ClosetPage";
import StylistPage from "./StylistPage";
import MixMatchPage from "./MixMatchPage";
import "./wardrobe-theme.css";

function NavTabs() {
  const location = useLocation();

  return (
    <nav className="nav-tabs">
      <Link
        to="/"
        className={`nav-tab${location.pathname === "/" ? " nav-tab-active" : ""}`}
      >
        CLOSET
      </Link>
      <Link
        to="/stylist"
        className={`nav-tab${location.pathname === "/stylist" ? " nav-tab-active" : ""}`}
      >
        STYLIST
      </Link>
      <Link
        to="/mix-match"
        className={`nav-tab${location.pathname === "/mix-match" ? " nav-tab-active" : ""}`}
      >
        MIX & MATCH
      </Link>
    </nav>
  );
}

function AnimatedHeader() {
  return (
    <div className="pinstripe title-bar">
      <div className="traffic-lights" aria-hidden="true">
        <span className="traffic-dot traffic-dot-red" />
        <span className="traffic-dot traffic-dot-gold" />
        <span className="traffic-dot traffic-dot-green" />
      </div>
      <span className="titleBarText">DEE'S WARDROBE.exe</span>
      <div className="title-bar-spacer" aria-hidden="true" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="page-backdrop">
        <span className="sparkle sparkle-1">✦</span>
        <span className="sparkle sparkle-2">✧</span>
        <span className="sparkle sparkle-3">✦</span>
        <span className="sparkle sparkle-4">✧</span>
        <span className="sparkle sparkle-5">✦</span>
        <div className="mac-window">
          <AnimatedHeader />

          <div className="screen-content">
            <NavTabs />

            <Routes>
              <Route path="/" element={<ClosetPage />} />
              <Route path="/stylist" element={<StylistPage />} />
              <Route path="/mix-match" element={<MixMatchPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;