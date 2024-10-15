"use client";
import { Footer, geopsTheme, Header } from "@geops/geops-ui";
import {
  Container,
  StyledEngineProvider,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

import GeopsMobilityDoc from "./components/GeopsMobilityDoc";
import GeopsMobilitySearchDoc from "./components/GeopsMobilitySearchDoc";

const tabs = [
  {
    component: "a",
    href: "/",
    label: "Home",
  },
  {
    component: "a",
    href: "https://github.com/geops/mobility-web-component",
    label: "Code",
  },
];
export default function Home() {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={geopsTheme}>
        <Header tabs={tabs} title="mobility-web-component" />
        <Container className="my-10 block">
          <Typography variant="h1">Mobility Web Component</Typography>
          <br />
          <p className="my-4">
            This project contains a set of web components allowing to use easily
            the{" "}
            <a href="https://developer.geops.io/">
              <b>geOps APIs</b>
            </a>
            :
            <br />
            <ul>
              <li className="my-4">
                <p>
                  <a href="#geops-mobility-web-component">
                    <b>{`<geops-mobility>`}</b>
                  </a>
                  <span>
                    : a web component used to display a map using different{" "}
                    <a href="https://developer.geops.io/">
                      <b>geOps APIs</b>
                    </a>
                    .
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <a href="#geops-mobility-search-web-component">
                    <b>{`<geops-mobility-search>`}</b>
                  </a>
                  <span>
                    : a search input to search stops using the{" "}
                    <a href="https://developer.geops.io/apis/stops">
                      <b>geOps Stops API</b>
                    </a>
                  </span>
                </p>
              </li>
            </ul>
          </p>
          <GeopsMobilityDoc />
          <GeopsMobilitySearchDoc />
        </Container>
        <Footer />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
