import { useEffect, useState } from 'react';
import './CurrencyConverter.css';

function CurrencyConverter({ url }) {
  const [currencies, setCurrencies] = useState([])
  const [amount, setAmount] = useState(1)
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('PHP')
  const [error, setError] = useState('')
  

  useEffect(() => 
    {fetchCurrencies()}, []); 

  useEffect(() => 
    {fetchRate()}, [amount, fromCurrency, toCurrency]); 

  const sendRequest = async (endpoint) => {
    try {
    setError('');
    const response = await fetch(endpoint);
    if (!response.ok) {
      setError(`Invalid Input!`);
      return;
    }
    const data = await response.json();
    return data;
    } catch (error) {
      console.error(error);
      setError(`Service is unavailable. Try again later`);
    }
  }

  const fetchCurrencies = async () => {
    const data = await sendRequest(`${url}/currencies`)
    console.log('fetchCurrencies = ', data)
    setCurrencies(Object.keys(data));
  };

  const fetchRate = async () => {
    const data = await sendRequest(`${url}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
    setConvertedAmount(data.rates[toCurrency].toFixed(2));
    console.log('fetchRate = ', data)
  };

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  };

  return (
    <div id = 'background'>
      <div className = 'currency-converter'>
        {error && <h2 className = 'currency-error'>{error}</h2>}
      <h2>Convert Currency</h2>
      <form>
        <div id = 'amount'>
          <label>Amount:</label>
          <input 
          type = 'number' 
          value = {amount}
          onChange = {(e) => setAmount(e.target.value)}
          required
          />
        </div>
        <div id = 'flex-container'>
        <div id = 'from'>
          <label>From: </label>
          <select
            value = {fromCurrency}
            onChange = {(e) => setFromCurrency(e.target.value)}
            required
          >
            {currencies.map((currency) => (
              <option value = {currency} key = {`from_${currency}`}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type = 'button' className = 'material-symbols-outlined' onClick={swapCurrencies}>
          compare_arrows
          </button>
        </div>
        <div id = 'to'>
          <label>To: </label>
          <select
            value = {toCurrency}
            onChange = {(e) => setToCurrency(e.target.value)}
            required
          >
          {currencies.map((currency) => (
              <option value = {currency} key = {`from_${currency}`}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>
      </form>
        <div id = 'converted'>
          <div id = 'from1'>{amount} {fromCurrency}</div>
          <h3>=</h3>
          <div id = 'to1'>{convertedAmount} {toCurrency}</div>
        </div>
      </div>
    </div>
    
  )
};

export default CurrencyConverter;