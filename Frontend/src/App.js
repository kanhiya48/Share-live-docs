import logo from './logo.svg';
import './App.css';
import './output.css'
import { v4 as uuidV4 } from "uuid"
import { CookiesProvider } from 'react-cookie';
import TextEditor from "./TextEditor"
import {
  BrowserRouter as Router,
  Routes,
  Route,

  
} from "react-router-dom"
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import VisDocs from './VisDocs';
function App() {
 
  return (
   <Router>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Routes>
        <Route path="/" exact element={<Home/>}/>
    
        <Route path="documents/:id" element={  <TextEditor />}/>
         <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/visdocs" element={<VisDocs/>} />
       
      </Routes>
      </CookiesProvider>
    </Router>
  );
}

export default App;
