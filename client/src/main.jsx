import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home.jsx'
import Video from './components/Video.jsx'
import Results from './components/Results.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home /> }/>
      <Route path='/Video' element={<Video />}/>   
      <Route path='Results' element={<Results />}/>
    </Routes>
    <ToastContainer />
    </BrowserRouter>
  </StrictMode>,
)
