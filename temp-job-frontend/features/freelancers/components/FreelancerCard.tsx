import { Briefcase, GraduationCap, MapPin, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getFreelancerAge } from "../helpers/freelancer.helper";
import { FreelancerInfo } from "../schemas/freelancer.schema";
import { FreelancerStars } from "./FreelancerStars";

interface IFreelancerCardProps {
  freelancerInfo: FreelancerInfo;
}

const FreelancerCard: FC<IFreelancerCardProps> = ({ freelancerInfo }) => {
  return (
    <div
      id="worker-card-1"
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <Image
          src={freelancerInfo.profile_image_url}
          className="rounded-full object-cover"
          alt="Worker"
          width={200}
          height={200}
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{freelancerInfo.fullname}</h3>
            <FreelancerStars
              rating={freelancerInfo.rating_avg}
              showCount
              count={freelancerInfo.reviews}
            />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <p className="text-gray-600">
              {freelancerInfo.province}, {freelancerInfo.district},{" "}
              {freelancerInfo.sub_district}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {getFreelancerAge(freelancerInfo)} ปี
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {freelancerInfo.total_job_contacts} งาน
              </span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {freelancerInfo.education_level_title ?? "ไม่ระบุ"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
           งานที่สนใจ {freelancerInfo.interesting_job_types?.map((jobType) => (
              <span
                key={jobType.job_type_id}
                className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full"
              >
                {jobType.job_types.title}
              </span>
            ))}
          </div>
        </div>
        <Link
          target="_blank"
          href={`/freelancers/${freelancerInfo.id}`}
          className="bg-emerald-600 text-white rounded-lg px-4 py-2 h-fit hover:bg-emerald-700 cursor-pointer"
        >
          ติดต่อ
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
