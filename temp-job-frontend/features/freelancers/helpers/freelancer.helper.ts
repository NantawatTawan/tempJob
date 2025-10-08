import { EducationLevel } from "@/features/education-level/schemas/education-level.schema";
import {
  FreelancerContactedJobType,
  FreelancerInfo,
} from "../schemas/freelancer.schema";
import { DRIVING_LICENSE_OPTIONS } from "@/features/posted-jobs/constants/posted-jobs.constant";

function parseAgeRange(ageRange: string): [number | null, number | null] {
  if (ageRange === "") return [null, null];

  if (ageRange.includes("-")) {
    const [min, max] = ageRange.split("-").map(Number);
    return [min, max];
  }

  if (ageRange.includes("+")) {
    const min = Number(ageRange.split("+")[0]);
    return [min, null];
  }

  throw new Error("Invalid age range");
}

function isAgeMatched({
  minAge,
  maxAge,
  freelancerAge,
}: {
  minAge: number | null;
  maxAge: number | null;
  freelancerAge: number;
}) {
  if (minAge === null && maxAge === null) return true;

  if (minAge !== null && maxAge === null && minAge <= freelancerAge) {
    return true;
  }

  if (minAge === null && maxAge !== null && maxAge >= freelancerAge) {
    return true;
  }

  if (
    minAge !== null &&
    maxAge !== null &&
    freelancerAge >= minAge &&
    freelancerAge <= maxAge
  ) {
    return true;
  }

  return false;
}

export function getFreelancerAge(info: FreelancerInfo) {
  const birthDate = new Date(info.birth_date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
}

export function filterFreelancers(
  freelancers: FreelancerInfo[] | undefined,
  filters: {
    province: string;
    district: string;
    jobType: string;
    contactedJobTypeId: FreelancerContactedJobType["id"] | null;
    ageRange: string;
    educationLevel: EducationLevel | null;
    gender: string;
    drivingLicense: FreelancerInfo["driving_license"];
  }
) {
  if (!freelancers) return [];

  return freelancers.filter((freelancer) => {
    const matchedProvince =
      freelancer.province === filters.province || filters.province === "";

    const matchedDistrict =
      freelancer.district === filters.district || filters.district === "";

    const matchedJobTypes =
      freelancer.interesting_job_types?.some(
        (jobType) => jobType.job_types.id === Number(filters.jobType)
      ) || filters.jobType === "";

    const matchedContactedJobType =
      freelancer.contacted_job_types?.some(
        (contactedJobType) =>
          contactedJobType.job?.job_type_id === filters.contactedJobTypeId
      ) || filters.contactedJobTypeId === null;

    const [minAge, maxAge] = parseAgeRange(filters.ageRange);

    const matchedGender =
      filters.gender === "" || filters.gender === freelancer.gender;

    const ageMatched = isAgeMatched({
      minAge,
      maxAge,
      freelancerAge: getFreelancerAge(freelancer),
    });

    const matchedDrivingLicense = (() => {
      if (!filters.drivingLicense) {
        return true;
      }

      const selectedOption = DRIVING_LICENSE_OPTIONS.find(
        (option) => option.value === filters.drivingLicense
      );
      if (!selectedOption) {
        return false;
      }

      return (
        freelancer.driving_license?.includes(selectedOption.label) ?? false
      );
    })();

    const matchedEducationLevel =
      (filters.educationLevel?.power ?? 0) <=
        (freelancer.education_level?.power ?? 0) ||
      filters.educationLevel === null ||
      filters.educationLevel?.power === 0;

    return (
      matchedProvince &&
      matchedDistrict &&
      matchedJobTypes &&
      ageMatched &&
      matchedEducationLevel &&
      matchedContactedJobType &&
      matchedGender &&
      matchedDrivingLicense
    );
  });
}
