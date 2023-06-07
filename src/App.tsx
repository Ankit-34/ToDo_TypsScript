import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/Login';
import Protected from './components/Protected';

const App : React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Protected Home={Home} />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
