import { Button } from "./components/Button";
import { Signin } from "./pages/Signin";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Route, BrowserRouter as Router,Routes,useNavigate } from "react-router-dom";



function App() {
  return (
    <>
    <div className="">
<Router>
  <Routes>
  <Route path="/" element={<Signin/>} />
  <Route path="/login" element={<Login/>} />
  <Route path="/dashboard" element={<Dashboard/>}/>
  </Routes>
</Router>
      </div>
    </>
  );
}

export default App;
