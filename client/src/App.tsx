import { Route, Switch, useLocation } from "wouter";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ideas from "./pages/Ideas";
import IdeaCreation from "./pages/IdeaCreation";
import Rover from "./pages/Rover";
import Developers from "./pages/Developers";
import DeveloperProfile from "./pages/DeveloperProfile";
import Workspace from "./pages/Workspace";
import Agreements from "./pages/Agreements";
import Notifications from "./pages/Notifications";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

export default function App() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/ideas" component={Ideas} />
    <Route path="/ideas/new" component={IdeaCreation} />
    <Route path="/discover"><Placeholder title="Discovery" /></Route>
    <Route path="/developers" component={Developers} />
    <Route path="/developers/:id" component={DeveloperProfile} />
    <Route path="/workspaces" component={Workspace} />
    <Route path="/agreements" component={Agreements} />
    <Route path="/notifications" component={Notifications} />
    <Route path="/rover" component={Rover} />
    <Route path="/profile"><Placeholder title="Profile" /></Route>
    <Route path="/settings"><Placeholder title="Settings" /></Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export function useRequireAuth() {
  const [, navigate] = useLocation(); const [ready, setReady] = useState(false);
  useEffect(() => { if (!localStorage.getItem("noidea-session")) navigate("/login"); else setReady(true); }, [navigate]);
  return ready;
}
