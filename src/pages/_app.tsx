import { type AppType } from "next/app";
import { type Session } from "next-auth";
import Head from "next/head.js";
import { SessionProvider } from "next-auth/react";

import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import PlausibleAnalytics from "../components/plausibleAnalytics";
import KofiDonateButton from "../components/kofiDonateButton";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        {/* Analytics (if configured) */}
        {env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
          && env.NEXT_PUBLIC_PLAUSIBLE_HOST
          && <PlausibleAnalytics domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} host={env.NEXT_PUBLIC_PLAUSIBLE_HOST} />}
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </SessionProvider>
      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="colored" />
      {env.NEXT_PUBLIC_KOFI_LINK_ID && <KofiDonateButton linkId={env.NEXT_PUBLIC_KOFI_LINK_ID} />}
    </>
  );
};

export default trpc.withTRPC(MyApp);
