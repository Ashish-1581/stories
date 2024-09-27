import { useState } from 'react'
import Home from '../src/pages/Home'
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StoryModal from './pages/StoryModal';


function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/story/:storyId" element={<StoryModal/>}/>
    </Routes>
    
    </BrowserRouter>
 
    <ToastContainer />
    </>
  )
}

export default App
