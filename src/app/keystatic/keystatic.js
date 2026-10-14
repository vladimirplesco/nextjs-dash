"use client";

import { makePage } from "@keystatic/next/ui/app";
// import config from '@keystatic/config';
import config from "../../../keystatic.config.js";

// export default makePage(config);

//--------------------------------
import { useEffect } from "react";

const KeystaticPage = makePage(config);

export default function KeystaticApp() {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    body.style.overflow = "auto";
    html.style.overflow = "auto";

    window.dispatchEvent(new Event("resize"));

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
    };

}, []);

return <KeystaticPage />

}
