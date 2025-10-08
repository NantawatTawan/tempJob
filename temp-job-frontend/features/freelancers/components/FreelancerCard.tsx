import { Briefcase, GraduationCap, MapPin, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { getFreelancerAge } from "../helpers/freelancer.helper";
import { FreelancerInfo } from "../schemas/freelancer.schema";

interface IFreelancerCardProps {
  freelancerInfo: FreelancerInfo;
}

const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
};

const FreelancerCard: FC<IFreelancerCardProps> = ({ freelancerInfo }) => {
  const [imgError, setImgError] = useState(false);

  const hasImg = Boolean(freelancerInfo.profile_image_url) && !imgError;

  const locationText = [
    freelancerInfo.province,
    freelancerInfo.district,
    freelancerInfo.sub_district,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      id="worker-card-1"
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {/* Avatar / Image */}
        {hasImg ? (
          <Image
            src={freelancerInfo.profile_image_url as string}
            className="rounded-full object-cover shrink-0"
            alt={freelancerInfo.fullname || "Freelancer"}
            width={200}
            height={200}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="rounded-full bg-gray-100 text-gray-600 w-[200px] h-[200px] flex items-center justify-center border border-gray-200 shrink-0">
            {/* ถ้ามีชื่อ แสดงอักษรย่อ; ถ้าไม่มีก็ไอคอน */}
            {freelancerInfo.fullname ? (
              <span className="text-4xl font-semibold select-none">
                {getInitials(freelancerInfo.fullname)}
              </span>
            ) : (
              <User className="w-16 h-16" />
            )}
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between gap-3">
            <h3 className="font-semibold text-lg line-clamp-1">
              {freelancerInfo.fullname || "ไม่ระบุชื่อ"}
            </h3>
            {/* ⭐ ถ้ามีคอมโพเนนต์ดาว ให้แน่ใจว่า null-safe ด้วย */}
            {/* <FreelancerStars rating={freelancerInfo.rating_avg ?? 0} showCount count={freelancerInfo.reviews ?? 0} /> */}
          </div>

          {locationText && (
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <p className="text-gray-600">{locationText}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {getFreelancerAge(freelancerInfo)} ปี
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {(freelancerInfo.total_job_contacts ?? 0).toLocaleString()} งาน
              </span>
            </div>

            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {freelancerInfo.education_level_title ?? "ไม่ระบุ"}
              </span>
            </div>
          </div>

          {/* งานที่สนใจ */}
          {Array.isArray(freelancerInfo.interesting_job_types) &&
            freelancerInfo.interesting_job_types.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-gray-700">งานที่สนใจ</span>
                {freelancerInfo.interesting_job_types
                  .filter((jt) => jt?.job_types?.title)
                  .map((jobType) => (
                    <span
                      key={jobType.job_type_id}
                      className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full"
                    >
                      {jobType.job_types.title}
                    </span>
                  ))}
              </div>
            )}
        </div>

        <Link
          target="_blank"
          href={`/freelancers/${freelancerInfo.id}`}
          className="bg-emerald-600 text-white rounded-lg px-4 py-2 h-fit hover:bg-emerald-700 cursor-pointer self-start"
        >
          ติดต่อ
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
