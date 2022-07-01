/* eslint-disable @next/next/no-img-element */
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import Sittee from "./Sittee";

type HeaderProps = {
  setLocation: (position: google.maps.LatLngLiteral) => void;
};

const styles = {
  container: "bg-gray-600 bg-opacity-30 w-full p-2 rounded-l-md text-white backdrop-blur text-xl items-center flex md:flex-row justify-between",
  input: "px-4 py-2 rounded-md mx-2 text-blue-60 hover:bg-opacity-10 hover:cursor-pointer border bg-transparent outline-none hover:bg-blue-50 border-blue-60 text-base",
  popover: "z-20 brightness-75 contrast-125 rounded-md"
}

const Header: React.FC<HeaderProps & JSX.IntrinsicElements["section"]> = ({
  setLocation,
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setLocation({ lat, lng });
  };

  return (
    <section className={styles.container}>
      <div>
        <Sittee loading={false} variant="small" />
      </div>
      <div className="flex">
        <Combobox onSelect={handleSelect} className="p-2">
          <ComboboxInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            className={styles.input}
            placeholder="Search an address, or Place"
          />
          <ComboboxPopover className={styles.popover}>
            <ComboboxList className="text-blue-60">
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption key={place_id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
    </section>
  );
};

export default Header;
