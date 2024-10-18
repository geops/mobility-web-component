import type { Metadata } from "next";

import { Container } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Script from "next/script";
import { Suspense } from "react";

import { Footer, geopsTheme, Header } from "../geops-ui";
import "./globals.css";

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

export const metadata: Metadata = {
  description: "A set of we component for geOps Mobility APIs",
  title: "geOps Mobility Web Component",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={geopsTheme}>
            <Header tabs={tabs} title="mobility-web-component" />
            <Container className="my-12" maxWidth="md">
              <Suspense fallback={null}>{children}</Suspense>
            </Container>
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
        <Script src="index.js" />
      </body>
    </html>
  );
}
