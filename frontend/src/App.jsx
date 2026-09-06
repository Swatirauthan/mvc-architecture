import { Routes, Route } from "react-router-dom";
import UserPage from "./Component/UserPage";
import CoursePage from "./Component/CoursePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />} />
      <Route path="/courses/:courseId" element={<CoursePage />} />
    </Routes>
  );
}

export default App;