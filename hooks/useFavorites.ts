// favorites feature removed — lightweight shim to avoid build errors from stray imports
export function useFavorites() {
  return {
    favorites: [] as number[],
    toggleFavorite: (_id: number) => undefined,
    isFavorited: (_id: number) => false,
  };
}
