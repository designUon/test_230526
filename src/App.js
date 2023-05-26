import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Books from './page/Books';
import Home from './page/Home';
// import Books2 from './page/Books2';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/books' element={<Books/>}/>
        {/* <Route path='/books' element={<Books2/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
