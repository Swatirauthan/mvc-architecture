import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";
import { Courses } from "./pages/Courses";
import { Auth } from "./pages/Auth";
import { Architecture } from "./pages/Architecture";
import { ApiExplorer } from "./pages/ApiExplorer";

const PAGES = ["home", "users", "courses", "auth", "architecture", "api"];

function getPageFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return PAGES.includes(hash) ? hash : "home";
}

function AppShell() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function onNavigate(nextPage) {
    window.location.hash = nextPage;
    setPage(nextPage);
  }

  let content = <Home onNavigate={onNavigate} />;

  if (page === "users") content = <Users onNavigate={onNavigate} />;
  if (page === "courses") content = <Courses onNavigate={onNavigate} />;
  if (page === "auth") content = <Auth />;
  if (page === "architecture") content = <Architecture />;
  if (page === "api") content = <ApiExplorer />;

  return (
    <Layout page={page} onNavigate={onNavigate}>
      {content}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
