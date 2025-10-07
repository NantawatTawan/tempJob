import { useQuery } from "@tanstack/react-query";
import { educationLevelService } from "../../services/education-level.service";
import { EducationLevel } from "../../schemas/education-level.schema";

export function useFetchEducationLevelById(id: EducationLevel["id"]) {
  return useQuery({
    queryKey: ["education-level", id],
    queryFn: async () => {
      return await educationLevelService.getEducationLevelById(id);
    },
  });
}
