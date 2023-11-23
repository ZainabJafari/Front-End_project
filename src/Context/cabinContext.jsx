import {createContext, useContext, useState, useEffect} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css';

const defaultState = {
    cabins: [],
    cabinDetail: null,
    getAllCabins: () => new Promise,
    getCabinById: (id) => new Promise
  }

export const CabinsContext = createContext(defaultState)

export const useCabinContext = () => useContext(CabinsContext)

export const CabinsContextProvider = (props) => {

    const [cabins, setCabins] = useState([])
    const [cabinDetail, setCabinDetail] = useState()
    const [selectedCategory, setSelectedCategory] = useState('All'); 
    const [filteredCabins, setFilteredCabins] = useState([]);
    
    const getAllCabins = async () => {
        const result = await axios.get('http://localhost:7777/api/cabin')
        setCabins(result.data)
    }

    const getCabinById = async (id) => {
      try {
          const result = await axios.get('http://localhost:7777/api/cabin/' + id);
          if (result.data) {
              setCabinDetail(result.data);
              console.log(result.data);
          }
      } catch (error) {
          console.error(error);
      }
  }
  
  
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredCabins(cabins);
    } else {
      setFilteredCabins(cabins.filter((cabin) => cabin.category === selectedCategory));
    }
  }, [selectedCategory, cabins]);

   

  const cabinContextValue = {getAllCabins, cabins, getCabinById, cabinDetail, filteredCabins, setSelectedCategory}
    return <CabinsContext.Provider value={cabinContextValue}>{props.children}</CabinsContext.Provider>
}


