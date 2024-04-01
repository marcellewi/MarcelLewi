import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './containers/Home';
import Chatbot from './containers/Chatbot';
import { GlobalStyle } from './GlobalStyles';

function App() {
  return (
    <>
      <Router>
        <Routes>
           <Route path="/" element={<Home/>} />
           <Route path="/chatbot" element={<Chatbot/>} />
         </Routes>
      </Router>
      <GlobalStyle />
    </>
  );
}

export default App;
