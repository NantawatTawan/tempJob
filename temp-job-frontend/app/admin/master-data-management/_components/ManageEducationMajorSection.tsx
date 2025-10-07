import CreateEducationMajorForm from "@/features/education-major/components/CreateEducationMajorForm";
import EducationMajorTable from "@/features/education-major/components/EducationMajorTable";
import { useFetchAllEducationMajors } from "@/features/education-major/hooks/queries/useFetchAllEducationMajors";
import { useState } from "react";

const ManageEducationMajorSection = () => {
  const { data: educationMajors, refetch } = useFetchAllEducationMajors();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedMajors = educationMajors 
    ? educationMajors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
    
  const totalPages = educationMajors 
    ? Math.ceil(educationMajors.length / itemsPerPage)
    : 0;

  return (
    <section
      id="major-management"
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-6 text-green-800">
        จัดการสาขาวิชา
      </h2>
      <div className="flex gap-6">
        <CreateEducationMajorForm onRefresh={refetch} />
        <div id="major-list" className="w-2/3">
          <EducationMajorTable
            educationMajors={paginatedMajors}
            onRefresh={refetch}
          />
          
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

export default ManageEducationMajorSection;
