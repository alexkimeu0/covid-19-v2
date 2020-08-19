import React, {useState, useEffect} from 'react';

import InfoBox from './components/InfoBox';
import Map from './components/Map';


import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import './App.css';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');


    // https://disease.sh/v3/covid-19/countries

    // useEffect -> Runs a piece of code based 
    //              on a given consition 


    useEffect(() => {
      // This code will run once the component  
      // loads and never again(if no variable) & whenever
      // the variable changes (if given a variable).

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
    }, []);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    setCountry(countryCode);
  } 

  return(
    <div className="app">
      <div className="app__left">
        <div className="app__header">
        <h1>COVID19 TRACKER</h1>

        <FormControl className="app__dropdown">
          <Select 
            variant="outlined"
            value={country}
            onChange={onCountryChange}
            >           
            <MenuItem value="worldwide">Worldwide</MenuItem> 
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
        </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={23} total={2300} />
          <InfoBox title="Recovered" cases={23} total={2300} />
          <InfoBox title="Deaths" cases={23} total={2300} />
        </div>
        <Map />
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            {/* Table */}
          <h3>Worldwide New Cases</h3>  
            {/* Graph */}
        </CardContent>
      </Card>
    </div>
  )
}
export default App;
