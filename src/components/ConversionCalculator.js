import React, { useState, useCallback , useEffect} from 'react';
import '../styles/Calculator.scss';

// Move conversions outside component to avoid dependency issues
const CONVERSIONS = {
  length: {
    units: ['meter', 'kilometer', 'centimeter', 'inch', 'foot', 'mile'],
    meter: {
      kilometer: (val) => val / 1000,
      centimeter: (val) => val * 100,
      inch: (val) => val * 39.3701,
      foot: (val) => val * 3.28084,
      mile: (val) => val * 0.000621371
    }
  }
};

const ConversionCalculator = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [result, setResult] = useState('0.0000');

  const convert = useCallback(() => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setResult('0.0000');
      return;
    }
  
    if (fromUnit === toUnit) {
      setResult(value.toFixed(4));
      return;
    }
  
    let meters;
    switch (fromUnit) {
      case 'meter':
        meters = value;
        break;
      case 'kilometer':
        meters = value * 1000;
        break;
      case 'centimeter':
        meters = value / 100;
        break;
      case 'inch':
        meters = value * 0.0254;
        break;
      case 'foot':
        meters = value * 0.3048;
        break;
      case 'mile':
        meters = value * 1609.34;
        break;
      default:
        setResult('0.0000');
        return;
    }
  
    // Ensure conversion function exists before calling
    if (toUnit !== 'meter' && CONVERSIONS.length.meter[toUnit]) {
      const result = CONVERSIONS.length.meter[toUnit](meters);
      setResult(result.toFixed(4));
    } else if (toUnit === 'meter') {
      setResult(meters.toFixed(4));
    } else {
      setResult('0.0000');
    }
  }, [fromValue, fromUnit, toUnit]);
  
  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, convert]);

  // Rest of your component code remains the same, just use CONVERSIONS instead of conversions
  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="converter-content">
          <div className="input-group">
            <input
              type="text"
              value={fromValue}
              onChange={(e) => {
                setFromValue(e.target.value);
                convert();
              }}
              placeholder="Enter value"
              className="value-input"
            />
            <select 
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value);
                convert();
              }}
              className="unit-select"
            >
              {CONVERSIONS.length.units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div className="result-display">
            {result}
          </div>

          <div className="output-group">
            <select 
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                convert();
              }}
              className="unit-select"
            >
              {CONVERSIONS.length.units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <button className="convert-button" onClick={convert}>
            Convert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionCalculator;