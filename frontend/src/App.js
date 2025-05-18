// App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { useAuth } from './features/auth/contexts/AuthContext';
import AuthModal from './features/auth/components/AuthModal';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Landing from './pages/Landing';
import Methodology from './pages/Methodology';
import ExplainableAI from './pages/ExplainableAI';
import APIDocumentation from './pages/APIDocumentation';
import Contact from './pages/Contact';
import GDPR from './pages/GDPR';
import Login from './features/auth/LoginPage';
import Signup from './features/auth/SignupPage';
import Diagnosis from './features/diagnosis/Diagnosis';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ResultsScreen from './features/results/ResultsScreen'; 
import './styles/global.css';

function AppContent() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Create ProtectedRoute component with useEffect
  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (!user) {
        setShowAuthModal(true);
        navigate('/login');
      }
    }, [user]);

    if (!user) return null;
    return children;
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/explainable-ai" element={<ExplainableAI />} />
          <Route path="/api-docs" element={<APIDocumentation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route 
            path="/diagnosis" 
            element={
              <ProtectedRoute>
                <Diagnosis />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ResultsScreen />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;