"use client";
import { Typography } from "@mui/material";

import GeopsAPIsLink from "./components/GeopsAPIsLink";
import GeopsStopsAPILink from "./components/GeopsStopsAPILink";

export default function Home() {
  return (
    <>
      <Typography variant="h1">Mobility Web Component</Typography>
      <br />
      <p className="my-4">
        This project contains a set of web components allowing to use easily the{" "}
        <GeopsAPIsLink />:
      </p>
      <br />
      <ul>
        <li className="m-4 list-disc">
          <p>
            <a href="/geops-mobility">
              <b>{`<geops-mobility>`}</b>
            </a>
            <span>
              : a web component used to display a map using different{" "}
              <GeopsAPIsLink />.
            </span>
          </p>
        </li>
        <li className="m-4 list-disc">
          <p>
            <a href="/geops-mobility-search">
              <b>{`<geops-mobility-search>`}</b>
            </a>
            <span>
              : a search input to search stops using the <GeopsStopsAPILink />
            </span>
          </p>
        </li>
      </ul>
    </>
  );
}
