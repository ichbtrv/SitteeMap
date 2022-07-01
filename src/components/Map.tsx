/* eslint-disable @next/next/no-img-element */
import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import Header from "./Header";
import { supabaseClient, User } from "@supabase/supabase-auth-helpers/nextjs";
import Button from "./Button";
import { InferGetServerSidePropsType } from "next";
import { largeMarker, smallMarker } from "./../constants/options";
import { MapData } from "../types";
import Input from "./Input";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapProps {
  user?: User;
  serverMapData: InferGetServerSidePropsType<MapData[]>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const Map: React.FC<
  JSX.IntrinsicElements["section"] &
  MapProps &
  InferGetServerSidePropsType<MapData[]>
> = ({ user, serverMapData, setLoading }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [location, setLocation] = useState<LatLngLiteral[] | null>(null);
  const [position, setPosition] = useState<LatLngLiteral | null>(null);
  const [_errorText, setError] = useState("");
  const [title, setTitle] = useState("");
  const [visibleIndex, setVisibleIndex] = useState<number>(-1);
  const [description, setDescription] = useState("");

  const mapRef = useRef<GoogleMap | null>(null);

  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 37.765, lng: -122.43 }),
    []
  );

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "91f2bf5a4dcef7e5",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const onMapLoad = useCallback((map) => (mapRef.current = map), []);

  const onPropsLoad = useCallback(() => {
    const markers: LatLngLiteral[] | null = [];
    // @ts-ignore
    serverMapData.map((d, i: any) => {
      let marker: LatLngLiteral = {
        lat: +d.db_lat_lng!.lat,
        lng: +d.db_lat_lng!.lng,
      };
      markers.push(marker);
    });
    setLocation(markers);
  }, [serverMapData]);

  useEffect(() => {
    if (serverMapData) onPropsLoad();
  }, [serverMapData, onPropsLoad]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    setPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() });
    setFormOpen(true);
  };

  const addMarker = useCallback(async () => {
    let db_lat_lng = position;
    try {
      if (title && description && position && user) {
        location === null
          ? setLocation([position])
          : setLocation([...location!, position]);

        let { error } = await supabaseClient.from("spots").insert([
          {
            db_lat_lng: { ...db_lat_lng },
            //@ts-ignore
            user_id: user.id,
            title: title,
            description: description,
          },
        ]);
        if (error) setError(error.message);
        resetForm();
        setPosition(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [description, location, position, title, user]);

  const updateMarker = async () => {
    const { id } = serverMapData[visibleIndex];
    console.log(id);
    const { data, error } = await supabaseClient
      .from("spots")
      .update({ title: title })
      .eq("id", id);
  };

  const deleteMarker = async () => {
    const { id } = serverMapData[visibleIndex];
    const { data, error } = await supabaseClient
      .from("spots")
      .delete()
      .eq("id", id);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFormOpen(false);
  };

  const handleSignout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (_error) {
      alert("something went strong");
    }
  };
  return (
    <section className="flex flex-col">
      <div className="px-4 flex justify-between pt-2 rounded-md">
        <Header
          setLocation={(position) => {
            location === null
              ? setLocation([position])
              : setLocation([...location!, position]);
            mapRef.current?.panTo(position);
          }}
        />
        <div className="px-4 flex items-center justify-between py-2 bg-gray-600 bg-opacity-30 rounded-r-md">
          <h1 className="text-base mr-2 text-gray-500">{user["email"]}</h1>
          <Button
            className={`cursor-pointer bg-gray-600 text-blue-60 rounded-md shadow-md bg-opacity-70 hover:bg-opacity-90`}
            onClick={handleSignout}
          >
            Logout
          </Button>
        </div>
      </div>{" "}
      <div className="map relative">
        <GoogleMap
          zoom={12.85}
          center={center}
          options={options}
          onLoad={onMapLoad}
          mapContainerClassName="map-container"
          onClick={handleMapClick}
        >
          {location &&
            location.map((loc, index) => (
              <div key={`marker-${index}`} className="relative">
                <Marker
                  position={loc}
                  draggable
                  clickable
                  icon={smallMarker}
                  onMouseOver={() => setVisibleIndex(index)}
                />
              </div>
            ))}
        </GoogleMap>
      </div>
      {/* ADD MARKER FORM */}
      {formOpen && (
        <section className="px-2">
          <div
            className={`mt-1 flex flex-col p-4 bg-gray-600 bg-opacity-30  mx-2 rounded-md
            `}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="title" hidden>
                  Title
                </label>
                <Input
                  type="text"
                  name="title"
                  value={title}
                  placeholder="Title"
                  className="px-4 py-2 rounded-md text-gray-300 hover:bg-opacity-10 hover:cursor-pointer border bg-transparent outline-none hover:bg-blue-50 border-blue-60   text-base"
                  onChange={setTitle}
                />
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col">
                  <label htmlFor="description" hidden>
                    Description
                  </label>
                  <Input
                    type="text"
                    name="description"
                    value={description}
                    placeholder="Description"
                    className="px-4 py-2 rounded-md text-gray-300 hover:bg-opacity-10 hover:cursor-pointer border bg-transparent outline-none hover:bg-blue-50 border-blue-60   text-base"
                    onChange={setDescription}
                  />
                </div>
              </div>
              <div className="flex">
                <Button
                  className="hover:shadow-xl text-blue-60 shadow-md rounded-md"
                  onClick={addMarker}
                >
                  Save
                </Button>
                <Button
                  className="hover:shadow-xl text-blue-60 shadow-md rounded-md"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* HOVERED SECTION */}
      <section className="px-4">
        {" "}
        {visibleIndex !== -1 && serverMapData && (
          <div className="text-blue-60 appear z-30 py-4 backdrop-blur-sm rounded-md bg-opacity-30 bg-gray-600 px-4  flex justify-between flex-col mt-4">
            <div className="flex">
              <div className="flex justify-between items-center bg-gray-600 bg-opacity-30 shadow-sm rounded-md">
                <img src={largeMarker} alt="logo" className="w-16" />
              </div>
              <div className="ml-2 flex">
                <h1 className="text-4xl appear mb-2">
                  {/* @ts-ignore */}
                  {serverMapData && serverMapData[visibleIndex]?.title}
                </h1>
                <p className="ml-6 flex">
                  {/* @ts-ignore */}
                  {serverMapData && serverMapData[visibleIndex]?.description}
                </p>
              </div>
              <div className="flex justify-end  w-full items-center">
                <Button
                  className="hover:shadow-xl shadow-md rounded-md"
                  onClick={updateMarker}
                >
                  Edit
                </Button>
                <Button
                  className="hover:shadow-xl shadow-md rounded-md"
                  onClick={deleteMarker}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}{" "}
      </section>
    </section>
  );
};
export default Map;
