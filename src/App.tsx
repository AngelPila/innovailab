import { GobotChat } from "./chat";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GobotChat />
      </AuthProvider>
    </ErrorBoundary>
  );
}
