import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ClosetPage from "./ClosetPage";
import StylistPage from "./StylistPage";
import MixMatchPage from "./MixMatchPage";

function NavTabs() {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <Link
        to="/"
        style={location.pathname === "/" ? styles.tabActive : styles.tab}
      >
        CLOSET
      </Link>
      <Link
        to="/stylist"
        style={location.pathname === "/stylist" ? styles.tabActive : styles.tab}
      >
        STYLIST
      </Link>
      <Link
        to="/mix-match"
        style={location.pathname === "/mix-match" ? styles.tabActive : styles.tab}
      >
        MIX & MATCH
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={styles.pageBackground}>
        <div style={styles.monitor}>
          <div style={styles.titleBar}>
            <span style={styles.titleBarText}>DEE'S WARDROBE.exe</span>
          </div>

          <div style={styles.screenContent}>
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

const styles = {
  pageBackground: {
    backgroundColor: "#e9d5ff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2rem 1rem",
    fontFamily: "'Fredoka', sans-serif",
  },
  monitor: {
    backgroundColor: "#fdf2f8",
    border: "6px solid #7e22ce",
    borderRadius: "20px",
    maxWidth: "900px",
    width: "100%",
    boxShadow: "0 10px 0 #c084fc",
    overflow: "hidden",
  },
  titleBar: {
    backgroundColor: "#7e22ce",
    padding: "0.6rem 1.2rem",
  },
  titleBarText: {
    color: "white",
    fontWeight: "700",
    fontSize: "0.9rem",
    letterSpacing: "0.1em",
  },
  screenContent: {
    padding: "2rem",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  tab: {
    textDecoration: "none",
    color: "#7e22ce",
    fontWeight: "700",
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    padding: "0.6rem 1.5rem",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    border: "2px solid #7e22ce",
    boxShadow: "0 4px 0 #7e22ce",
  },
  tabActive: {
    textDecoration: "none",
    color: "white",
    fontWeight: "700",
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    padding: "0.6rem 1.5rem",
    borderRadius: "10px",
    backgroundColor: "#c084fc",
    border: "2px solid #7e22ce",
    boxShadow: "0 4px 0 #7e22ce",
  },
};

export default App;