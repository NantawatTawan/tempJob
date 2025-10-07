import React, { FC } from "react";
import { FreelancerContactedJobType } from "../schemas/freelancer.schema";
import { formatThaiDate } from "@/lib/helpers/date.helper";

interface IFreelancerContactedJobProps {
  contactedJobType: FreelancerContactedJobType;
  allContactedJobTypes: FreelancerContactedJobType[];
}

const FreelancerContactedJob: FC<IFreelancerContactedJobProps> = ({
  contactedJobType,
  allContactedJobTypes,
}) => {
  const sameJobTypes = allContactedJobTypes.filter(
    (jobType) =>
      jobType.job.job_types.title === contactedJobType.job.job_types.title
  );

  const firstJobDate = sameJobTypes.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )[0].created_at;

  return (
    <div className="border-l-4 border-green-500 pl-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-green-900">
            {contactedJobType.job.job_types.title}
          </h4>
          <p className="text-green-600 text-sm">
            ได้รับการว่าจ้างมาแล้ว {sameJobTypes.length} งาน
          </p>
          <p className="text-green-600 text-sm italic">
            <span className="text-gray-500">ตั้งแต่</span>{" "}
            {formatThaiDate(firstJobDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerContactedJob;
