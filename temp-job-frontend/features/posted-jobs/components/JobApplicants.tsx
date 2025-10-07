import { JobApplication } from "../schemas/posted-job.schema";
import JobApplicant from "./JobApplicant";

interface IJobApplicantsProps {
  applicants: JobApplication[];
}

const JobApplicants = ({ applicants }: IJobApplicantsProps) => {
  return (
    <div id="applicants-list" className="col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-green-100">
        <div className="p-4 border-b border-green-100 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <select className="border border-green-200 rounded-lg px-3 py-2 text-green-800 focus:ring-2 focus:ring-green-200 focus:border-green-300">
              <option>ทั้งหมด</option>
              <option>รออนุมัติ</option>
              <option>อนุมัติแล้ว</option>
              <option>ปฏิเสธ</option>
            </select>
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-3 text-green-400"></i>
              <input
                type="text"
                placeholder="ค้นหาผู้สมัคร"
                className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-64 focus:ring-2 focus:ring-green-200 focus:border-green-300"
              />
            </div>
          </div>
        </div>
        {applicants.map((applicant) => (
          <JobApplicant key={applicant.freelancer_id} applicant={applicant} />
        ))}
      </div>
    </div>
  );
};

export default JobApplicants;
