import { AuthProvider } from "./context/AuthContext";
import AppContent from "./pages/AppContent.jsx"; 

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;