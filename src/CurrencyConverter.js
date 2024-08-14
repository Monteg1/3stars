import React, { useState, useEffect } from 'react';
import './App.css';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('RUB');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState(null);

  const API_KEY = '091848d318b9f3c5bdb95e5ee057d6ab';
  const API_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

  useEffect(() => {
    // Получаем список валют и устанавливаем курсы при первом рендере
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
          const currencyKeys = Object.keys(data.rates);
          setCurrencies([data.base, ...currencyKeys]);
          setConvertedAmount(data.rates[toCurrency]);
        } else {
          setError(data.error.type);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCurrencies();
  }, [toCurrency]);

  const convertCurrency = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        const rate = data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      } else {
        setError(data.error.type);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="converter-container">
      <h2>Currency Converter</h2>
      {error && <p className="error">Error: {error}</p>}
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <span>to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="result">
        {amount} {fromCurrency} = {convertedAmount} {toCurrency}
      </div>
    </div>
  );
};

export default CurrencyConverter;
