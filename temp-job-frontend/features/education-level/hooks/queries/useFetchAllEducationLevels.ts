import { useQuery } from "@tanstack/react-query";
import { educationLevelService } from "../../services/education-level.service";

export function useFetchAllEducationLevels() {
  return useQuery({
    queryKey: ["education-levels"],
    queryFn: async () => {
      const response = await educationLevelService.getAllEducationLevels();
      return response;
    },
  });
}
