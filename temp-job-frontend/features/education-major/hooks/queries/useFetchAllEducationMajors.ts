import { useQuery } from "@tanstack/react-query";
import { educationMajorService } from "../../services/education-major.service";

export function useFetchAllEducationMajors() {
  return useQuery({
    queryKey: ["education-majors"],
    queryFn: async () => {
      return await educationMajorService.getAllEducationMajors();
    },
  });
}
