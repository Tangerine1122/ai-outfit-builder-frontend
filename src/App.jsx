import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ClosetPage from "./ClosetPage";
import StylistPage from "./StylistPage";

function NavTabs() {
  // useLocation tells us the current URL path, so we can highlight
  // whichever tab is currently active.
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <Link
        to="/"
        style={location.pathname === "/" ? styles.tabActive : styles.tab}
      >
        Closet
      </Link>
      <Link
        to="/stylist"
        style={location.pathname === "/stylist" ? styles.tabActive : styles.tab}
      >
        Stylist
      </Link>
    </nav>
  );
}

function App() {
  return (
    // BrowserRouter enables URL-based navigation for everything inside it.
    <BrowserRouter>
      <div style={styles.page}>
        <h1 style={styles.header}>DEE'S WARDROBE</h1>
        <NavTabs />

        {/* Routes decides which page component to show based on the
            current URL. Only one of these renders at a time. */}
        <Routes>
          <Route path="/" element={<ClosetPage />} />
          <Route path="/stylist" element={<StylistPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  page: {
    backgroundColor: "#fdf2f8",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "900",
    letterSpacing: "0.05em",
    color: "#a855f7",
    textAlign: "center",
    marginBottom: "1rem",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  tab: {
    textDecoration: "none",
    color: "#a855f7",
    fontWeight: "700",
    padding: "0.5rem 1.5rem",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 3px 0 #f0abfc",
  },
  tabActive: {
    textDecoration: "none",
    color: "white",
    fontWeight: "700",
    padding: "0.5rem 1.5rem",
    borderRadius: "12px",
    backgroundColor: "#c084fc",
    boxShadow: "0 3px 0 #7e22ce",
  },
};

export default App;