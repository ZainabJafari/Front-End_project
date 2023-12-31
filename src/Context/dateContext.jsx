import { parseISO } from 'date-fns';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const defaultState = {
  startDate: new Date(),
  endDate: new Date(),
  updateStartDate: (startDate) => { },
  updateEndDate: (endDate) => { },
  getFormattedDate: (date) => { },
  saveDatesToBackend: () => {},
}

export const DateContext = createContext(defaultState);

export const useDateContext = () => {
  return useContext(DateContext);
};

export const DateProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())

  const dateHasLoaded = useRef(false)

  // save date in local storage
  useEffect(() => {
    const _startDate = localStorage.getItem('startDate')
    const _endDate = localStorage.getItem('endDate')

    if (_startDate) {
      setStartDate(new Date(_startDate))
    }
    if (_endDate) {
      setEndDate(new Date(_endDate))
    }
    setTimeout(() => {
      dateHasLoaded.current = true
    }, 300)

  }, [])

  const updateStartDate = (newStartDate) => {
    setStartDate(newStartDate);
  };

  const updateEndDate = (newEndDate) => {
    setEndDate(newEndDate);
  };

  const getFormattedDate = (date = new Date()) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
  }

  const setLocalStorageOf = (name, value) => {
    if (dateHasLoaded.current && value) {
      console.log("SETTING LOCAL STORAGE ", name, value)
      localStorage.setItem(name, value)
    }
  }
  const saveDatesToBackend = async () => {
    try {
      const response = await axios.post('http://localhost:7777/api/order', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      console.log('Svar från backend:', response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    setLocalStorageOf("startDate", startDate?.toISOString())
  }, [startDate]);

  useEffect(() => {
    setLocalStorageOf("endDate", endDate?.toISOString())
  }, [endDate]);




    return (
      <DateContext.Provider
        value={{
          startDate,
          endDate,
          updateStartDate,
          updateEndDate,
          getFormattedDate,
          saveDatesToBackend,
        }}
      >
        {children}
      </DateContext.Provider>
    );
  };

