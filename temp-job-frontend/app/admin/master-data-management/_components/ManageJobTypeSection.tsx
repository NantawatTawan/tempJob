import { useFetchAllJobTypes } from "@/features/posted-jobs/hooks/queries/useFetchAllJobTypes";
import CreateNewJobTypeForm from "./CreateNewJobTypeForm";
import LoadingPlaceholder from "./LoadingPlaceholder";
import JobTypeListForAdmin from "@/features/job-types/components/JobTypeListForAdmin";
import { useState } from "react";

const ManageJobTypeSection = () => {
  const {
    data: jobTypes,
    isFetching: isFetchingJobTypes,
    refetch,
  } = useFetchAllJobTypes();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedJobTypes = jobTypes 
    ? jobTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
    
  const totalPages = jobTypes 
    ? Math.ceil(jobTypes.length / itemsPerPage)
    : 0;

  if (isFetchingJobTypes) {
    return <LoadingPlaceholder title="จัดการประเภทงาน" />;
  }

  return (
    <section
      id="job-type-management"
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold mb-6 text-green-800">
        จัดการประเภทงาน
      </h2>
      <div className="flex gap-6">
        <CreateNewJobTypeForm onRefresh={refetch} />
        <div id="job-type-list" className="w-2/3">
          <JobTypeListForAdmin jobTypes={paginatedJobTypes} onRefresh={refetch} />
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`text-sm text-green-600 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← ก่อนหน้า
              </button>
              
              <div className="text-sm text-gray-500">
                หน้า {currentPage} จาก {totalPages}
              </div>
              
              <button
                className={`text-sm text-green-600 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ถัดไป →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageJobTypeSection;
