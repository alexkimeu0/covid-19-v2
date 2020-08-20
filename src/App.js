import React, {useState, useEffect} from 'react';

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';

import { sortData } from './util';


import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import './App.css';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);


    // https://disease.sh/v3/covid-19/countries

    // useEffect -> Runs a piece of code based 
    //              on a given consition 


    useEffect(() => {
      fetch('https://disease.sh/v3/covid-19/all')
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        })
    })

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

            const sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);
        })
      }

      getCountries();
    }, []);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    setCountry(countryCode);

    // 'https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]'

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      })  
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
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        <Map />
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>  
            {/* Graph */}
        </CardContent>
      </Card>
    </div>
  )
}
export default App;
