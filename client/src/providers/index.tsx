import { ThemeProvider } from "@/context/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false
        }
    }
});

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <BrowserRouter>
        <QueryClientProvider client={client}>
            <ThemeProvider defaultTheme="dark" >
            {children}
            </ThemeProvider>
        </QueryClientProvider>
    </BrowserRouter>
  )
}
