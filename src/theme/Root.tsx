import BrowserOnly from "@docusaurus/BrowserOnly";
import React, { useEffect } from "react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
export default function Root({ children }) {
  const [colorMode, setColorMode] = React.useState(
    globalThis.document?.documentElement.dataset.theme
  );

  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      const html = document.documentElement;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "data-theme") {
            setColorMode(html.dataset.theme);
          }
        });
      });

      observer.observe(html, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <>
      {children}
      <BrowserOnly>
        {() => (
          <ToastContainer
            autoClose={3000}
            position="bottom-left"
            theme={colorMode === "light" ? "light" : "dark"}
          />
        )}
      </BrowserOnly>
    </>
  );
}
