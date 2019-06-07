import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReact } from '@fortawesome/free-brands-svg-icons'
import FileUpload from './components/FileUpload';
import './App.css';

const reactLogo = <FontAwesomeIcon icon={faReact} />

const App = () => (
  <div className="container mt-4">
    <h4 className="display-4 text-center mb-4">
      {reactLogo}

      React File Upload
    </h4>

    <FileUpload />
  </div>
);

export default App;
