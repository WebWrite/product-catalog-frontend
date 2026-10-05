import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/route";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <ConfigProvider
        theme={{ algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] }}
      >
        <AntdApp>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <RouterProvider router={router}></RouterProvider>
            </Provider>
          </QueryClientProvider>
        </AntdApp>
      </ConfigProvider>
    </>
  );
}

export default App;
