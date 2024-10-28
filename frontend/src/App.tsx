import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './components/Landing';
import Room from "./components/Room"

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing></Landing>}></Route>
        <Route path='/room' element={<Room></Room>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
