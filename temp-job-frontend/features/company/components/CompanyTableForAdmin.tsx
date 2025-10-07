import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useModal } from "@/shared/hooks/useModal";
import { usePagination } from "@/shared/hooks/usePagination";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useFetchAllCompaniesForAdmin } from "../hooks/queries/useFetchAllCompaniesForAdmin";
import { CompanyInfoForAdmin } from "../schemas/company.schema";
import CompanyListTableHeader from "./CompanyListTableHeader";
import CompanyTableRowForAdmin from "./CompanyTableRowForAdmin";
import CreateCompanyAccountForm from "./CreateCompanyAccountForm";
import EditCompanyInfoForAdminModal from "./EditCompanyInfoForAdminModal";
import LoadingCompanyListSkeletons from "./LoadingCompanyListSkeletons";
import SelectPackageForCompanyModal from "./SelectPackageForCompanyModal";
import Pagination from "@/shared/components/ui/pagination";

const CompanyTableForAdmin = () => {
  const {
    data: companies,
    isFetching,
    refetch,
  } = useFetchAllCompaniesForAdmin();

  const {
    isOpen: isOpenSelectPackageForCompanyModal,
    onOpen: onOpenSelectPackageForCompanyModal,
    onClose: onCloseSelectPackageForCompanyModal,
  } = useModal();

  const {
    isOpen: isOpenEditCompanyModal,
    onOpen: onOpenEditCompanyModal,
    onClose: onCloseEditCompanyModal,
  } = useModal();

  const {
    isOpen: isOpenCreateCompanyModal,
    onOpen: onOpenCreateCompanyModal,
    onClose: onCloseCreateCompanyModal,
  } = useModal();

  const [selectedCompany, setSelectedCompany] =
    useState<CompanyInfoForAdmin | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies?.filter((company) =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginationProps = usePagination<CompanyInfoForAdmin>({
    datas: filteredCompanies ?? [],
    rowsPerPage: 50,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    paginationProps.onResetPage();
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-800">รายการบริษัท</h2>
        <Button
          onClick={onOpenCreateCompanyModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          สร้างบัญชีบริษัท
        </Button>
      </div>

      <div className="flex mb-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="ค้นหาชื่อบริษัท"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {selectedCompany && isOpenEditCompanyModal && (
        <EditCompanyInfoForAdminModal
          company={selectedCompany}
          isOpen={isOpenEditCompanyModal && Boolean(selectedCompany)}
          onClose={onCloseEditCompanyModal}
          onSuccess={() => setSelectedCompany(null)}
          onRefresh={refetch}
        />
      )}

      {isOpenSelectPackageForCompanyModal && selectedCompany && (
        <SelectPackageForCompanyModal
          isOpen={isOpenSelectPackageForCompanyModal}
          onClose={onCloseSelectPackageForCompanyModal}
          companyId={selectedCompany.id}
          onRefresh={refetch}
        />
      )}

      {isOpenCreateCompanyModal && (
        <CreateCompanyAccountForm
          isOpen={isOpenCreateCompanyModal}
          onClose={onCloseCreateCompanyModal}
          onSuccess={() => refetch()}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-emerald-50">
            <CompanyListTableHeader />
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {isFetching ? (
              <LoadingCompanyListSkeletons />
            ) : (
              paginationProps.paginatedDatas?.map((company) => (
                <CompanyTableRowForAdmin
                  key={company.id}
                  company={company}
                  onSelectCompany={setSelectedCompany}
                  onSetSelectedCompany={setSelectedCompany}
                  onOpenSelectPackageForCompanyModal={
                    onOpenSelectPackageForCompanyModal
                  }
                  onSetIsOpenEditCompanyModal={onOpenEditCompanyModal}
                  onSetIsOpenSelectPackageForCompanyModal={
                    onOpenSelectPackageForCompanyModal
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination {...paginationProps} datas={filteredCompanies ?? []} />
    </>
  );
};

export default CompanyTableForAdmin;
