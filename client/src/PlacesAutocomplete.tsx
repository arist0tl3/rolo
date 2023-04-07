import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import styled from 'styled-components';

import { darkText, offWhite, primary } from 'colors';

import InputWrapper from 'InputWrapper';

const Input = styled.input`
  background: ${offWhite};
  color: ${darkText};
  border-radius: 8px;
  border: none;
  font-size: 16px;
  outline: 0;
  padding: 4px 8px;
`;

const SuggestionsList = styled.ul`
  width: calc(100vw - 48px);
  background: ${offWhite};
  position: absolute;
  left: 16px;
  list-style: none;
  text-align: left;
  overflow: hidden;
  padding: 0;
  border: 1px solid ${primary};
  border-radius: 8px;
  top: 60px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  max-width: 100%;
  z-index: 100;

  @media screen and (min-width: 768px) {
    max-width: calc(50vw - 48px);
  }
`;

const SuggestionItem = styled.li`
  padding: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;

  strong {
    font-weight: 500;
  }
`;

const GoogleAttribution = styled(SuggestionItem)`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 14px;
  color: ${darkText};
  cursor: initial;

  img {
    height: 20px;
    margin-left: 2px;
    transform: translateY(2px);
  }
`;

export type PlacesAutocompleteProps = {
  defaultValue?: string;
  onInput?: (value: string) => void;
  onChange?: (value: any) => void;
  placeholder?: string;
};

// TODO: Refactor this away from the onboarding specific logic inside
const PlacesAutocomplete = ({ defaultValue = '', onInput = () => {}, onChange = () => {}, placeholder = '' }: PlacesAutocompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    defaultValue,
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: any) => {
    // Update the keyword of the input element
    setValue(e.target.value);
    onInput(e.target.value);
  };

  const handleFocus = (e: any) => {
    // Clear the current value
    setValue('');
  };

  const handleSelect =
    ({ description, structured_formatting }: { description: any; structured_formatting: any }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      // setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);

        setValue(structured_formatting?.main_text, false);

        onChange({
          coordinates: {
            lat,
            lng,
          },
          formattedAddress: results[0]?.formatted_address,
          googlePlaceId: results[0]?.place_id,
          locationName: structured_formatting?.main_text,
        });
      });
    };

  const renderSuggestions = () => (
    <>
      {data.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return (
          <SuggestionItem key={place_id} onClick={handleSelect(suggestion)}>
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </SuggestionItem>
        );
      })}
      <GoogleAttribution key={'google-logo'}>
        <div>{'powered by'}</div>
        <img alt={'Google logo'} src={'https://res.cloudinary.com/dpafkspwa/image/upload/v1//assets/google_on_white?_a=AJCihWI0'} />
      </GoogleAttribution>
    </>
  );

  return (
    <InputWrapper ref={ref} style={{ width: '100%', position: 'relative' }}>
      <label>{'Restaurant/Location'}</label>
      <Input onFocus={handleFocus} value={value} onChange={handleInput} disabled={!ready} placeholder={placeholder} />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <SuggestionsList>{renderSuggestions()}</SuggestionsList>}
    </InputWrapper>
  );
};

export default PlacesAutocomplete;
