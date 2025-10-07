import { EducationLevel } from "@/features/education-level/schemas/education-level.schema";
import { JobType } from "../schemas/posted-job.schema";

interface IJobInfoProps {
  jobTypeTitle: JobType["title"];
  minWage: number;
  maxWage: number;
  site: string;
  province: string;
  district: string;
  hireType: string;
  educationLevel: EducationLevel["title"];
  description: JobType["description"];
  drivingLicenseRequirement?: string | null;
  siteMapUrl?: string;
  guideline?: string;
}

const JobInfo = ({
  jobTypeTitle,
  minWage,
  maxWage,
  site,
  province,
  district,
  hireType,
  educationLevel,
  // --- 2. รับ Prop ใหม่เข้ามาใช้งาน ---
  drivingLicenseRequirement,
  siteMapUrl,
  guideline,
  description,
}: IJobInfoProps) => {
  return (
    <section id="job-info" className="col-span-1">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-green-100">
        <h2 className="text-lg font-semibold mb-4 text-green-800">
          รายละเอียดงาน
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-green-600 mb-1">
              ตำแหน่งงาน - สถานที่ปฏิบัติงาน
            </p>
            <p className="text-green-900">
              {jobTypeTitle} - {site}
            </p>
          </div>
          <div>
            <p className="text-green-600 mb-1">ค่าจ้าง</p>
            <p className="text-green-900">
              {minWage ?? 0} ฿ - {maxWage ?? 0} ฿ {hireType}
            </p>
          </div>
          <div>
            <p className="text-green-600 mb-1">สถานที่ปฏิบัติงาน</p>
            <p className="text-green-900">
              {site} {province} {district}
            </p>
          </div>

          <div>
            <p className="text-green-600 mb-1">ระดับการศึกษา</p>
            <p className="text-green-900">{educationLevel}</p>
          </div>

          <div>
            <p className="text-green-600 mb-1">ใบขับขี่</p>
            <p className="text-green-900">
              {drivingLicenseRequirement || "ไม่ระบุ"}
            </p>
          </div>

          <div>
            <p className="text-green-600 mb-1">
              รายละเอียดงานและคุณสมบัติประจำตำแหน่ง
            </p>
            <p className="text-green-900 break-words">{description}</p>
          </div>

          <div>
            <p className="text-green-600 mb-1">
              Location GPS สถานที่ปฏิบัติงาน
            </p>
            <p className="text-green-900 break-words">{siteMapUrl ?? "-"}</p>
          </div>

          <div>
            <p className="text-green-600 mb-1">
              วิธีการเดินทางไปสถานที่ปฏิบัติงาน
            </p>
            <p className="text-green-900 break-words">{guideline ?? "-"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobInfo;
