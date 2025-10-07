import { useQuery } from "@tanstack/react-query";
import { themeService } from "../../services/theme.service";

export function useFetchAllThemes() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const themes = await themeService.getAllThemes();
      return themes;
    },
  });
}
