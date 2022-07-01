import { NextPage } from "next";
import { ReactNode } from "react";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import ToastProvider from "../components/ToastProvider";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <UserProvider supabaseClient={supabaseClient}>
      <ToastProvider variant={"top_right"}>
        <Component {...pageProps} />
      </ToastProvider>
    </UserProvider>
  );
}
