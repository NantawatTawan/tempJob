import { useQuery } from "@tanstack/react-query";
import { freelancerService } from "../../service/freelancer.service";

export function useFetchFreelancers() {
  return useQuery({
    queryKey: ["freelancers"],
    queryFn: async () => await freelancerService.getFreelancers(),
  });
}
