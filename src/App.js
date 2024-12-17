// App.js
import React, { useState } from 'react';
import Calculator from './components/Calculator';
import ScientificCalculator from './components/ScientificCalculator';
import ConversionCalculator from './components/ConversionCalculator';
import './App.css';

function App() {
  const [calculatorType, setCalculatorType] = useState('simple');

  return (
    <div className="app">
      <h1>Windows Calculator</h1>
      <select 
        className="calculator-select"
        value={calculatorType}
        onChange={(e) => setCalculatorType(e.target.value)}
      >
        <option value="simple">Simple Calculator</option>
        <option value="scientific">Scientific Calculator</option>
        <option value="unit">Unit Converter</option>
      </select>
      
      <div className="calculator-wrapper">
        {calculatorType === 'simple' && <Calculator />}
        {calculatorType === 'scientific' && <ScientificCalculator />}
        {calculatorType === 'unit' && <ConversionCalculator />}
      </div>
    </div>
  );
}

export default App;