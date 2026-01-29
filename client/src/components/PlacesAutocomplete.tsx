import React, { useEffect } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

type Place = {
  coordinates: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
  googlePlaceId: string;
  locationName: string;
};

type PlacesAutocompleteProps = {
  value: string;
  onInput: (value: string) => void;
  onSelect: (place: Place) => void;
  placeholder?: string;
};

export default function PlacesAutocomplete({ value, onInput, onSelect, placeholder }: PlacesAutocompleteProps) {
  const {
    ready,
    value: internalValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    defaultValue: value,
    debounce: 300,
  });

  useEffect(() => {
    if (value !== internalValue) {
      setValue(value, false);
    }
  }, [value, internalValue, setValue]);

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onInput(event.target.value);
  };

  const handleSelect =
    ({ description, structured_formatting }: { description: string; structured_formatting: { main_text: string } }) =>
    async () => {
      clearSuggestions();
      const results = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(results[0]);
      const place: Place = {
        coordinates: { lat, lng },
        formattedAddress: results[0]?.formatted_address,
        googlePlaceId: results[0]?.place_id,
        locationName: structured_formatting?.main_text,
      };
      setValue(structured_formatting?.main_text, false);
      onSelect(place);
    };

  return (
    <div ref={ref} className="relative w-full">
      <label className="form-label" htmlFor="restaurant">
        Restaurant / Location
      </label>
      <input
        id="restaurant"
        className="rolo-input"
        type="text"
        value={internalValue}
        onChange={handleInput}
        placeholder={placeholder}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={!ready && !value}
      />
      {status === 'OK' ? (
        <ul className="absolute left-0 top-[68px] z-20 w-full overflow-hidden rounded-[8px] border border-[#5b7c99] bg-[#fffef8] text-left shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;
            return (
              <li
                key={place_id}
                className="cursor-pointer border-b border-[#e2ded4] px-3 py-2 text-[14px] text-[#333]"
                onClick={handleSelect(suggestion)}
              >
                <strong className="font-medium">{main_text}</strong> <small className="text-[#666]">{secondary_text}</small>
              </li>
            );
          })}
          <li className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#444]">
            <span>powered by</span>
            <img
              alt="Google"
              src="https://res.cloudinary.com/dpafkspwa/image/upload/v1//assets/google_on_white?_a=AJCihWI0"
              className="h-4"
            />
          </li>
        </ul>
      ) : null}
    </div>
  );
}
