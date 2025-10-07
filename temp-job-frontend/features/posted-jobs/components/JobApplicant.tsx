import { FreelancerStars } from "@/features/freelancers/components/FreelancerStars";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { JobApplication } from "../schemas/posted-job.schema";
import { EyeIcon, StarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface IJobApplicantProps {
  applicant: JobApplication;
}

const JobApplicant = ({ applicant }: IJobApplicantProps) => {
  return (
    <div
      key={applicant.freelancer_id}
      id={`applicant-${applicant.freelancer_id}`}
      className="p-4 border-b border-green-100 hover:bg-green-50"
    >
      <div className="flex items-center gap-4">
        <Image
          src={applicant.freelancer.profile_image_url}
          className="w-12 h-12 rounded-full"
          alt={applicant.freelancer.fullname}
          width={200}
          height={200}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-green-900">
                  {applicant.freelancer.fullname}
                </h3>
                <FreelancerStars
                  rating={applicant.freelancer.rating_avg}
                  count={applicant.freelancer.reviews}
                  showCount
                />
              </div>
              <p className="text-sm text-green-600">
                สมัครเมื่อ{" "}
                {formatDistanceToNow(new Date(applicant.created_at), {
                  addSuffix: true,
                  locale: th,
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                className="cursor-pointer"
                target="_blank"
                href={`/freelancers/${applicant.freelancer_id}`}
              >
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                  ดูโปรไฟล์
                </Button>
              </Link>
              <Link
                target="_blank"
                href={`/posted-jobs/${applicant.job_id}/review?freelancerId=${applicant.freelancer_id}`}
              >
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 transition-colors"
                >
                  <StarIcon className="w-4 h-4" />
                  รีวิว
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicant;
