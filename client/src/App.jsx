import { BrowserRouter , Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AuthForm from "./pages/Register"
function App() {
  return (
    <div className="bg-[#F8F4EA]">

    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<AuthForm mode='login'/>} />
        <Route path="/register" element={<AuthForm mode='register' />} />
        <Route path="/chats" element={<Home />} />
        {/* <Route path="/" element={<Start />} /> */}



      </Routes>
      
    </BrowserRouter>
    </div>
  )
}

export default App