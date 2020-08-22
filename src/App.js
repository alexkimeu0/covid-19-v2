import React, {useState, useEffect} from 'react';

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';

import { sortData, prettyPrintStat } from './util';


import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import "leaflet/dist/leaflet.css";

const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

    // https://disease.sh/v3/covid-19/countries

    // useEffect -> Runs a piece of code based 
    //              on a given condition 


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
            setMapCountries(data);
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

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
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
          <InfoBox 
              isRed
              active={casesType === 'cases'}
              onClick={e => setCasesType('cases')} 
              title="Coronavirus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox 
              active={casesType === 'recovered'}
              onClick={e => setCasesType('recovered')} 
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox 
              isRed
              active={casesType === 'deaths'}
              onClick={e => setCasesType('deaths')} 
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)} />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          <h3>Worldwide {casesType} Cases</h3>  
            <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  )
}
export default App;
