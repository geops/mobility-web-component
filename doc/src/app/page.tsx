"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";

import GeopsAPIsLink from "./components/GeopsAPIsLink";
import GeopsMobility from "./components/GeopsMobility";
import GeopsMobilitySearch from "./components/GeopsMobilitySearch";
import GeopsStopsAPILink from "./components/GeopsStopsAPILink";
import usePublicKey from "./hooks/usePublicKey";

export default function Home() {
  const apiKey = usePublicKey();
  return (
    <>
      <Typography variant="h1">Mobility Web Component</Typography>
      <br />
      <p className="my-4">
        This project contains a set of web components allowing to use easily the{" "}
        <GeopsAPIsLink />:
      </p>
      <div className="my-8 flex flex-wrap gap-4">
        <Card className="w-[345px] min-w-[320px] shrink-0">
          <CardMedia sx={{ height: 160, padding: 0, pointerEvents: "none" }}>
            <GeopsMobility
              apikey={apiKey}
              class="size-full"
              geolocation="false"
              search="false"
            />
          </CardMedia>
          <CardContent>
            <Link href={`/geops-mobility`}>
              <Typography variant="h3">{"<geops-mobility />"}</Typography>
            </Link>
            <Typography>
              A web component used to display a map using different{" "}
              <GeopsAPIsLink />.
            </Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              href={`/geops-mobility`}
              sx={{ borderRadius: 0, borderTopLeftRadius: 4 }}
            >
              More
            </Button>
          </CardActions>
        </Card>

        <Card className="w-[345px] min-w-[320px] shrink-0">
          <CardMedia sx={{ height: 160, padding: 2, pointerEvents: "none" }}>
            <GeopsMobilitySearch
              apikey={apiKey}
              class="m-4 size-full border-0 border-b"
            />
          </CardMedia>
          <CardContent>
            <Link href={`/geops-mobility-search`}>
              <Typography variant="h3">
                {"<geops-mobility-search />"}
              </Typography>
            </Link>
            <Typography>
              A search input to search stops using the <GeopsStopsAPILink />.
            </Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              href={`/geops-mobility-search`}
              sx={{ borderRadius: 0, borderTopLeftRadius: 4 }}
            >
              More
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
}
