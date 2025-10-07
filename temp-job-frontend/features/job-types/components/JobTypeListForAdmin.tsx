import { JobType } from "../../posted-jobs/schemas/posted-job.schema";
import JobTypeRowForAdmin from "./JobTypeRowForAdmin";

interface IJobTypeListForAdminProps {
  jobTypes: JobType[];
  onRefresh: () => void;
}

const JobTypeListForAdmin = ({
  jobTypes,
  onRefresh,
}: IJobTypeListForAdminProps) => {
  return (
    <table className="w-full">
      <TableHeaders />
      <tbody className="divide-y">
        {jobTypes.map((jobType) => (
          <JobTypeRowForAdmin
            key={jobType.id}
            jobType={jobType}
            onRefresh={onRefresh}
          />
        ))}
      </tbody>
    </table>
  );
};

const TableHeaders = () => {
  return (
    <thead className="bg-green-50">
      <tr>
        <th className="px-4 py-2 text-left">ประเภทงาน</th>
        <th className="px-4 py-2 text-left">รายละเอียด</th>
        <th className="px-4 py-2 text-center">จัดการ</th>
      </tr>
    </thead>
  );
};

export default JobTypeListForAdmin;
