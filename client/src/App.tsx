import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Resources from "@/pages/Resources";
import EventDetail from "@/pages/EventDetail";
import NotFound from "@/pages/not-found";
import PixelCardExample from "./components/PixelCardExample";
import { ThemeProvider } from "./contexts/theme-context";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // If navigating to a page without a specific anchor hash, always reset scroll to the top
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resources" component={Resources} />
        <Route path="/events/:eventId" component={EventDetail} />
        <Route path="/pixel-cards" component={PixelCardExample} />
        <Route component={NotFound} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
