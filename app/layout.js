import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { AppWrapper } from "@/context";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <body>
          {/* when the app is launched it goes in appwrapper and gets all the state and user session */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppWrapper>{children}</AppWrapper>
          </ThemeProvider>
        </body>
      </AppRouterCacheProvider>
    </html>
  );
}
