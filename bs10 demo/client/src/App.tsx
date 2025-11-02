import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import RoleSelection from "./pages/RoleSelection";
import Home from "./pages/Home";
import Bostani from "./pages/Bostani";
import BostaniSessions from "./pages/BostaniSessions";
import BostaniInteractiveDemo from "./pages/BostaniInteractiveDemo";
import Sessions from "./pages/Sessions";
import InteractiveDemo from "./pages/InteractiveDemo";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={RoleSelection} />
      <Route path={"/badher"} component={Home} />
      <Route path={"/bostani"} component={Bostani} />
      <Route path={"/bostani/sessions"} component={BostaniSessions} />
      <Route path={"/bostani/demo"} component={BostaniInteractiveDemo} />
      <Route path={"/sessions"} component={Sessions} />
      <Route path={"/demo"} component={InteractiveDemo} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
