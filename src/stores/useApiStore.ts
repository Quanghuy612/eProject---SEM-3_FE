import { create } from "zustand";
import type { Method, AxiosRequestHeaders, AxiosError } from "axios";
import API from "../api/api";

interface ApiRequestOptions<TData = unknown, TParams = unknown, THeaders extends AxiosRequestHeaders | undefined = AxiosRequestHeaders | undefined> {
    method: Method;
    url: string;
    data?: TData; // request body
    params?: TParams; // query params
    headers?: THeaders; // extra headers if needed
}

interface ApiState<T = unknown> {
    data: T | null;
    loading: boolean;
    error: string | null;

    // request method generic for response type R
    request: <R = T, D = unknown, P = unknown, H extends AxiosRequestHeaders | undefined = AxiosRequestHeaders | undefined>(
        options: ApiRequestOptions<D, P, H>
    ) => Promise<R>;

    reset: () => void;
}

function isAxiosError(error: unknown): error is AxiosError {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
}

const useApiStore = create<ApiState>((set) => ({
    data: null,
    loading: false,
    error: null,

    request: async <R = unknown, D = unknown, P = unknown, H extends AxiosRequestHeaders | undefined = AxiosRequestHeaders | undefined>({
        method,
        url,
        data,
        params,
        headers,
    }: ApiRequestOptions<D, P, H>): Promise<R> => {
        set({ loading: true, error: null });

        try {
            const response = await API.request<R>({
                method,
                url,
                data,
                params,
                headers,
            });

            set({ data: response.data, loading: false });
            return response.data;
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const maybeMessage =
                    err.response?.data && typeof err.response.data === "object" && "message" in err.response.data
                        ? (err.response.data as { message?: string }).message
                        : undefined;
                const message = maybeMessage || err.message || "Unknown error";
                set({ error: message, loading: false });
                throw err;
            }

            // Safely check if err has message property by checking instanceof Error
            const message = err instanceof Error ? err.message : "Unknown error";
            set({ error: message, loading: false });
            throw err;
        }
    },

    reset: () => set({ data: null, loading: false, error: null }),
}));

export default useApiStore;
