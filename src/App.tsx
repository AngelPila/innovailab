import { GobotChat } from "./chat";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

export default function App() {
  return (
    <ErrorBoundary>
      <GobotChat />
    </ErrorBoundary>
  );
}
