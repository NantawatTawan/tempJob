import { useQuery } from "@tanstack/react-query";
import { freelancerService } from "../../service/freelancer.service";

export function useFetchFreelancer(id: string) {
  return useQuery({
    queryKey: ["freelancer", id],
    queryFn: async () => await freelancerService.getFreelancerById(id),
  });
}
