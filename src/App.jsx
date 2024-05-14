import './App.css'
import{Routes,Route} from 'react-router-dom'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Dashboard from './components/dashboard/Dashboard'

function App() {

  return (
    <>
    <Routes>
      <Route path="/register" element={<Register />}/>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
    </>

  )
}

export default App
