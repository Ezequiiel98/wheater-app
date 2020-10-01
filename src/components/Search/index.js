import React, { useState } from 'react';
import iconClose from 'assets/icons/close.svg';
import iconSearch from 'assets/icons/search.svg';
import iconArrowRight from 'assets/icons/arrow-right.svg';
import { fetchLocationByName } from 'services/fetchLocation';
import Button from 'components/Button';

import {
  ContainerSearch,
  ButtonClose,
  FormGroup,
  ContainerInput,
  Input,
  IconSearch,
  ContainerPlaces,
  ButtonPlace,
  IconArrowRight,
  NotResultMessage
} from './styles';

export default function Search({ setShowSearch, setDataLocation, setDataWeather }) {
  const [nameCountry, setNamecountry] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [showNotResults, setShowNotResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => setNamecountry(e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();

    setIsLoading(true);
    setShowNotResults(false);

    if (nameCountry !== '') {
      const res = await fetchLocationByName(nameCountry);
      setCountriesData(res.data);
      setShowNotResults(res.data.length <= 0);
    } else {
      setShowNotResults(true);
    }

    setIsLoading(false);
  };

  const handleClick = woeid => {
     const [locationCountry] = countriesData.filter(country => country.woeid === woeid);

    setDataLocation(locationCountry);
    // reseteo el context para que se muestren los loaders
    setDataWeather({ dataDaysWeather: {}, unitTemp: 'c' });
    setShowSearch(false);
  };

  return (
    <ContainerSearch>
      <ButtonClose onClick={() => setShowSearch(false)}>
        <img src={iconClose} alt="icon close" />
      </ButtonClose>
      <FormGroup onSubmit={handleSubmit}>
        <ContainerInput>
          <Input type="text" placeholder="Search location" onChange={handleChange} />
          <IconSearch src={iconSearch} alt="Magnifying glass" />
        </ContainerInput>
        <Button blue type="submit">Search</Button>
      </FormGroup>

      <ContainerPlaces>
        {countriesData.map(({ title, woeid }) => (
          <ButtonPlace key={woeid} onClick={() => handleClick(woeid)} type="button">
            {title}
            <IconArrowRight src={iconArrowRight} />
          </ButtonPlace>
        ))}
        {showNotResults && <NotResultMessage>There weren't results :c </NotResultMessage>}
        {/* despues remplazar esto por un loader */}
        { isLoading && <NotResultMessage>Loading</NotResultMessage>}
      </ContainerPlaces>
    </ContainerSearch>
  );
}
