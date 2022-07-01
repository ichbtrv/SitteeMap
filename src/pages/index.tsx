import Layout from "../components/Layout";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import AuthContainer from "../components/AuthContainer";

import { useLoadScript } from "@react-google-maps/api";
import { googleMapsApiKey, libraries } from "../constants/options";
import Map from "./../components/Map";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { InferGetServerSidePropsType } from "next";
import Sittee from "./../components/Sittee";
import { useEffect, useState } from "react";
import { MapData } from "../types";

export async function getServerSideProps() {
  const response = await supabaseClient.from("spots").select("*");

  return {
    props: {
      serverMapData: await response.data,
    },
  };
}

export default function Home({
  serverMapData,
}: InferGetServerSidePropsType<MapData[]>) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries,
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [setLoading]);

  return loading ? (
    <Layout>
      <Sittee loading={loading} />
    </Layout>
  ) : (
    <div>
      {!user ? (
        <Layout>
          {" "}
          <AuthContainer />{" "}
        </Layout>
      ) : (
        //@ts-ignore
        <Map user={user} serverMapData={serverMapData} />
      )}{" "}
    </div>
  );
}
