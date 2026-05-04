
//generic reusable function for all fetching API Data
export const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const fetchData = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(endpoint, options);

    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    return response.json() as Promise<T>;
}