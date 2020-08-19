import React, {useState, useEffect} from 'react';

import { MenuItem, FormControl, Select } from '@material-ui/core';
import './App.css';

const App = () => {

  const [countries, setCountries] = useState([]);


    // https://disease.sh/v3/covid-19/countries

    // useEffect -> Runs a piece of code based 
    //              on a given consition 


    useEffect(() => {
      // This code will run once the component  
      // loads and never again(if no variable) & whenever
      // the variable countries changes.

      const getCountries = async () => {
        await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {

          const countries = data.map((country) => 

            ({
              name: country.country,
              value: country.countryInfo.iso2,
            }));

          setCountries(countries);
        })
      }

      getCountries();
    }, [countries]);


  return(
    <div className="app">
      <div className="app__header">
      <h1>COVID19 TRACKER</h1>

      <FormControl className="app__dropdown">
        <Select 
          variant="outlined"
          value="Worldwide"
          >           
           <MenuItem value="Worldwide">Worldwide</MenuItem> 
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
      </FormControl>
      </div>
      {/* Header */}
      {/* Title + select input dropdown */}

      {/* InfoBox */}
      {/* InfoBox */}
      {/* InfoBox */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  )
}
export default App;
