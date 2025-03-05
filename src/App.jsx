import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GoalList from "./pages/GoalList";
import GoalDetail from "./pages/GoalDetail";
import Navbar from "./components/Navbar";
import ParticipationPage from "./pages/ParticipationPage";
import ParticipationDetailPage from "./pages/ParticipationDetailPage";
import GoalCreatePage from "./pages/GoalCreatePage";
import CommentPage from "./pages/CommentPage";
import GoalEditPage from "./pages/GoalEditPage";
import "./styles/App.css";

// 인증 상태 체크 및 보호된 라우트 컴포넌트
function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("access_token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <HashRouter basename={"/"}>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <div className="content-with-navbar">
                  <Routes>
                    <Route path="/goals" element={<GoalList />} />
                    <Route path="/goals/create" element={<GoalCreatePage />} />
                    <Route path="/goals/:id" element={<GoalDetail />} />
                    <Route path="/goals/:id/edit" element={<GoalEditPage />} />
                    <Route path="/comments" element={<CommentPage />} />
                    <Route
                      path="/participations"
                      element={<ParticipationPage />}
                    />
                    <Route
                      path="/participations/:id"
                      element={<ParticipationDetailPage />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/goals" replace />}
                    />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
