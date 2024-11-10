import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './components/Landing';


function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing></Landing>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
