import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5m
      gcTime: 1000 * 60 * 30, // 30m
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
    },
  },
});

interface CustomQueryClientProviderProps {
  children: React.ReactNode;
}

// 앱에 필요한 프로바이더들을 제공하는 컴포넌트
const CustomQueryClientProvider: React.FC<CustomQueryClientProviderProps> = ({
  children,
}: CustomQueryClientProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default CustomQueryClientProvider;
