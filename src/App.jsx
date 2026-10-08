import { ConfigProvider, theme, App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./app/theme/themeProvider";
import { useTheme } from "./app/theme/useTheme";
import AppInitializer from "./app/initializer/AppInitializer";

const queryClient = new QueryClient();
function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: [
          isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          theme.compactAlgorithm,
        ],
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AppInitializer />
          </Provider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
