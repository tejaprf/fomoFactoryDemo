import React from 'react';
import './App.css';
import TickerDetails from './components/TickerDetails';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <TickerDetails />
      </header>
    </div>
  );
};

export default App;

