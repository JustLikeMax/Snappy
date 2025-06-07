import { useCallback, useState } from 'react';

export interface LocationSuggestion {
    display_name: string;
    place_id: string;
    lat: string;
    lon: string;
    type: string;
    importance: number;
}

export function useLocationAutocomplete() {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchLocations = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Using Nominatim API from OpenStreetMap (free and no API key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(query)}&` +
                `format=json&` +
                `addressdetails=1&` +
                `limit=5&` +
                `countrycodes=&` +
                `accept-language=en`,
                {
                    headers: {
                        'User-Agent': 'SnappyDatingApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location suggestions');
            }

            const data = await response.json();
            
            // Filter and format the results
            const formattedSuggestions: LocationSuggestion[] = data
                .filter((item: any) => 
                    item.display_name && 
                    (item.type === 'city' || 
                     item.type === 'town' || 
                     item.type === 'village' ||
                     item.class === 'place' ||
                     item.class === 'boundary')
                )
                .map((item: any) => ({
                    display_name: item.display_name,
                    place_id: item.place_id,
                    lat: item.lat,
                    lon: item.lon,
                    type: item.type || item.class,
                    importance: item.importance || 0
                }))
                .sort((a: LocationSuggestion, b: LocationSuggestion) => b.importance - a.importance)
                .slice(0, 5);

            setSuggestions(formattedSuggestions);
        } catch (err) {
            console.error('Location search error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setError(null);
    }, []);

    return {
        suggestions,
        isLoading,
        error,
        searchLocations,
        clearSuggestions
    };
}
