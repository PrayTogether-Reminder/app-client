import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      // UX 이슈로 캐싱 일시 비활성화
      // staleTime: 1000 * 60 * 5, // 5m
      // gcTime: 1000 * 60 * 30, // 30m
      staleTime: 0,
      gcTime: 0,
      // UX 이슈로 캐싱 일시 비활성화 (앱 복귀/재연결 시에도 refetch)
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
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
