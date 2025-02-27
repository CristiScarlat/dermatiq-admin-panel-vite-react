import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/dashboard.tsx";
import Login from "./pages/login.tsx";
import ProtectedRoute from "./components/protectedRoute.tsx";
import Header from "./components/header.tsx";

function App() {

  return (
    <Router>
        <Header />
      <Routes>
          <Route index element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
