import React, { FC } from "react";
import { FreelancerInfo } from "../schemas/freelancer.schema";
import FreelancerCard from "./FreelancerCard";

interface IFreelancerListProps {
  freelancerInfos: FreelancerInfo[];
}

const FreelancerList: FC<IFreelancerListProps> = ({ freelancerInfos }) => {
  return (
    <div className="flex flex-col gap-4">
      {freelancerInfos.map((freelancerInfo) => (
        <FreelancerCard
          key={freelancerInfo.id}
          freelancerInfo={freelancerInfo}
        />
      ))}
    </div>
  );
};

export default FreelancerList;
