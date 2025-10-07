"use client";
import { sortEducationLevelsByPower } from "@/features/education-level/helpers/education-level.helper";
import { useFetchAllEducationLevels } from "@/features/education-level/hooks/queries/useFetchAllEducationLevels";
import { EducationLevel } from "@/features/education-level/schemas/education-level.schema";
import FreelancerList from "@/features/freelancers/components/FreelancerList";
import { filterFreelancers } from "@/features/freelancers/helpers/freelancer.helper";
import { useFetchFreelancers } from "@/features/freelancers/hooks/queries/useFetchFreelancers";
import { FreelancerContactedJobType } from "@/features/freelancers/schemas/freelancer.schema";
import { useFetchAllJobTypes } from "@/features/posted-jobs/hooks/queries/useFetchAllJobTypes";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useProvinces } from "@/shared/hooks/useProvinces";
import {
  Briefcase,
  Car,
  Filter,
  GraduationCap,
  MapPin,
  User,
} from "lucide-react";
import { useState } from "react";
import { sortByThai } from "../../lib/utils";

const FindFreelancerPage = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedContactedJobTypeId, setSelectedContactedJobTypeId] = useState<
    FreelancerContactedJobType["id"] | null
  >(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("");
  const [selectedEducation, setSelectedEducation] =
    useState<EducationLevel | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [drivingLicense, setDrivingLicense] = useState("");
  const { provinces, amphures } = useProvinces(
    selectedProvince,
    selectedDistrict
  );
  const { data: jobTypes, isFetching: isFetchingJobTypes } =
    useFetchAllJobTypes();

  const { data: freelancerInfos } = useFetchFreelancers();

  const { data: educationLevels } = useFetchAllEducationLevels();

  const sortedEducationLevels = sortEducationLevelsByPower(
    educationLevels ?? []
  );

  const filteredFreelancers = filterFreelancers(freelancerInfos, {
    province: selectedProvince,
    district: selectedDistrict,
    jobType: selectedJobType,
    contactedJobTypeId: selectedContactedJobTypeId,
    ageRange: selectedAgeRange,
    educationLevel: selectedEducation,
    gender: selectedGender,
    drivingLicense: drivingLicense,
  });

  return (
    <div className="bg-primary min-h-screen">
      <main>
        <section id="search-section" className="bg-white py-8 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                ค้นหาผู้สมัครงาน
              </h2>

              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedDistrict("");
                    }}
                  >
                    <option value="">เลือกจังหวัด</option>
                    {sortByThai(provinces ?? [], "value").map((province) => (
                      <option key={province.key} value={province.key}>
                        {province.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  {isFetchingJobTypes ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <select
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                    >
                      <option value="">เลือกตำแหน่งงานที่สนใจ</option>
                      {sortByThai(jobTypes ?? [], "title").map((jobType) => (
                        <option key={jobType.id} value={jobType.id.toString()}>
                          {jobType.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="bg-gray-100 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-200 flex items-center justify-center cursor-pointer ml-auto gap-x-3"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <p>
                      {showAdvancedFilters
                        ? "ซ่อนตัวกรองขั้นสูง"
                        : "แสดงตัวกรองขั้นสูง"}
                    </p>
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {showAdvancedFilters && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 animate-fadeIn">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        เพศ
                      </label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                      >
                        <option value="">ไม่จำกัดเพศ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        อำเภอ
                      </label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedProvince}
                      >
                        <option value="">เลือกอำเภอ</option>
                        {sortByThai(amphures ?? [], "value").map((amphure) => (
                          <option key={amphure.key} value={amphure.key}>
                            {amphure.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        ตำแหน่งงานที่เคยทำ
                      </label>
                      {isFetchingJobTypes ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <select
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                          value={
                            selectedContactedJobTypeId
                              ? String(selectedContactedJobTypeId)
                              : ""
                          }
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSelectedContactedJobTypeId(
                              selectedValue === ""
                                ? null
                                : Number(selectedValue)
                            );
                          }}
                        >
                          <option value="">เลือกตำแหน่ง</option>
                          {sortByThai(jobTypes ?? [], "title").map(
                            (jobType) => (
                              <option
                                key={jobType.id}
                                value={jobType.id.toString()}
                              >
                                {jobType.title}
                              </option>
                            )
                          )}
                        </select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        ช่วงอายุ
                      </label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                        value={selectedAgeRange}
                        onChange={(e) => setSelectedAgeRange(e.target.value)}
                      >
                        <option value="">ทุกช่วงอายุ</option>
                        <option value="18-25">18-25 ปี</option>
                        <option value="26-30">26-30 ปี</option>
                        <option value="31-35">31-35 ปี</option>
                        <option value="36-40">36-40 ปี</option>
                        <option value="41-45">41-45 ปี</option>
                        <option value="46-50">46-50 ปี</option>
                        <option value="50+">มากกว่า 50 ปี</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1">
                        <Car className="h-4 w-4 text-gray-400" />
                        ใบขับขี่
                      </label>
                      <input
                        value={drivingLicense}
                        placeholder="ระบุหมายเลขที่ขับขี่"
                        onChange={(e) => setDrivingLicense(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 flex items-center gap-1">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        วุฒิการศึกษาขั้นต่ำ
                      </label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                        value={selectedEducation?.id}
                        onChange={(e) =>
                          setSelectedEducation(
                            sortedEducationLevels?.find(
                              (education) =>
                                education.id === Number(e.target.value)
                            ) ?? null
                          )
                        }
                      >
                        {sortedEducationLevels?.map((education) => (
                          <option key={education.id} value={education.id}>
                            {education.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="results-section" className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  ผลการค้นหา{"   "}
                  <span className="text-gray-500 text-sm">
                    พบ {filteredFreelancers?.length} ใบสมัคร
                  </span>
                </h3>
              </div>

              <div className="grid gap-4">
                <FreelancerList freelancerInfos={filteredFreelancers ?? []} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FindFreelancerPage;
