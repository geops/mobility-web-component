import { Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Typography variant="h1">Mobility Web Component</Typography>
      <br />
      <p className="my-4">
        This project contains a set of web components allowing to use easily the{" "}
        <a href="https://developer.geops.io/">
          <b>geOps APIs</b>
        </a>
        :
      </p>
      <br />
      <ul>
        <li className="my-4">
          <p>
            <a href="/geops-mobility">
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
            <a href="/geops-mobility-search">
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
    </>
  );
}
