import React, {
  ChangeEvent, FormEvent, ReactElement, useEffect, useState,
} from 'react';
import { FormGroup, Label } from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormField } from '../../models/FormModel';
import { City, CityGeo } from '../../models/GeoModel';
import { fetchExternalData } from '../../helpers/ApiHelper';
import { CITIES_URL } from '../../config/api';
import { LOCAL_STORAGE_DEPARTMENT } from '../../config/map';
import ROUTES from '../../config/routes';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import './Autocomplete.scss';
import Tag from '../Tag';
import { setCustomFieldData } from '../../actions/formAction';
import { cityGeoToCity } from '../../helpers/CityHelper';

type Props = {
  field: FormField;
}

const AutocompleteCities: React.FC<Props> = (props: Props) => {
  const { field } = props;
  const [suggestions, setSuggestions] = useState<CityGeo[]>([]);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [departmentCode, setDeparmentCode] = useState<string>();
  const [isTyping, setTyping] = useState<NodeJS.Timeout>();
  const dispatch = useDispatch();

  /**
   * Get department code.
   */
  useEffect(() => {
    const department = localStorage.getItem(LOCAL_STORAGE_DEPARTMENT);

    if (!department) window.location.href = ROUTES.REGION;

    if (typeof department === 'string') {
      const departmentObject = JSON.parse(department);

      if ('code' in departmentObject && departmentObject.code) {
        setDeparmentCode(departmentObject.code);
      } else {
        dispatch(setFlashMessage('Une erreur est survenue, veuillez re-choisir votre départment.', FlashMessageType.WARNING));
        window.location.href = ROUTES.REGION;
      }
    }
  }, []);

  /**
   * Fetch cities on external API.
   */
  const searchCities = async (search: string): Promise<void> => {
    const matchingCities = await fetchExternalData(`${CITIES_URL}?nom=${search}`);

    const departmentCities = matchingCities.filter((city: CityGeo) => (
      city.codeDepartement === departmentCode));
    setSuggestions(departmentCities);
  };

  /**
   * When user is typing, wait he stops before launching search.
   */
  const onSuggestionFetchRequested = (search: string): void => {
    if (search.trim() !== '') {
      if (isTyping) {
        clearTimeout(isTyping);
      }

      setTyping(setTimeout(() => searchCities(search), 250));
    } else {
      if (isTyping) {
        clearTimeout(isTyping);
      }
      setTimeout(() => setSuggestions([]), 200);
    }
  };

  const onSuggestionSelected = (event: FormEvent, suggestion: CityGeo): void => {
    const newCity = cityGeoToCity(suggestion);
    const newCities = [...cities, newCity];

    setCities(newCities);
    dispatch(setCustomFieldData(field.key, newCities));

    setCurrentValue('');
  };

  const removeCity = (cityCode: number): void => {
    const newCities = cities.filter((city) => city.id !== cityCode);
    setCities(newCities);
    dispatch(setCustomFieldData(field.key, newCities));
  };

  return (
    <FormGroup>
      {
        field.label
          ? <Label for={`${field.key}-field`} className={field.required ? 'required' : ''}>{field.label}</Label>
          : null
      }

      <div className="mb-2">
        {
          cities.map((city: City) => (
            <Tag title={city.name} onDelete={(): void => removeCity(city.id)} key={city.id} />
          ))
        }
      </div>

      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={({ value }): void => onSuggestionFetchRequested(value)}
        onSuggestionSelected={(e, { suggestion }): void => onSuggestionSelected(e, suggestion)}
        onSuggestionsClearRequested={(): void => setSuggestions([])}
        getSuggestionValue={(suggestion): string => suggestion.nom}
        renderSuggestion={(suggestion): ReactElement => <div>{suggestion.nom}</div>}
        inputProps={{
          placeholder: 'Commencez à taper le nom d\'une ville',
          value: currentValue,
          onChange: (e: ChangeEvent, { newValue }: { newValue: string }): void => (
            setCurrentValue(newValue)),
        }}
      />

      <small className="text-muted">
        Si vous ne trouvez pas la ville de votre choix, essayez de
        <Link to={ROUTES.REGION}> changer de département </Link>
        ;)
      </small>
    </FormGroup>
  );
};

export default AutocompleteCities;
