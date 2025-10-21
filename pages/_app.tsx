import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // @ts-ignore
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return <Component {...pageProps} />;
}
