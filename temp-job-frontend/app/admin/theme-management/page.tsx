"use client";
import { useState } from "react";
import CreateThemeForm from "@/features/theme/components/CreateThemeForm";
import ThemeListForAdmin from "@/features/theme/components/ThemeListForAdmin";
import { useFetchAllThemes } from "@/features/theme/hooks/queries/useFetchAllThemes";
import { Select } from "@/shared/components/ui/select";
import { ChevronDown } from "lucide-react";
import { usePagination } from "@/shared/hooks/usePagination";
import Pagination from "@/shared/components/ui/pagination";
import { Theme } from "@/features/theme/schemas/theme.schema";

const AdminThemeManagementPage = () => {
  const [activationFilter, setActivationFilter] = useState("all");

  const {
    data: themes,
    isFetching: isFetchingThemes,
    refetch,
  } = useFetchAllThemes();

  const filteredThemes = themes
    ? activationFilter === "active"
      ? themes.filter((theme) => theme.is_active)
      : activationFilter === "inactive"
      ? themes.filter((theme) => !theme.is_active)
      : themes
    : [];

  const paginationProps = usePagination<Theme>({
    datas: filteredThemes ?? [],
    rowsPerPage: 5,
  });

  function handleChangeActivationFilter(value: string) {
    setActivationFilter(value);
    paginationProps.onResetPage();
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div id="main-content" className="p-8">
          <CreateThemeForm onRefresh={refetch} />
          <section
            id="theme-list"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">
                รายการธีม
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  สถานะการใช้งาน:
                </span>
                <div className="relative">
                  <Select
                    value={activationFilter}
                    onChange={(e) => handleChangeActivationFilter(e.target.value)}
                    options={[
                      { value: "all", label: "ทั้งหมด" },
                      { value: "active", label: "เปิดใช้งาน" },
                      { value: "inactive", label: "ปิดใช้งาน" },
                    ]}
                    className="w-44 appearance-none rounded-md border border-gray-300 bg-white pl-4 pr-10 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            {isFetchingThemes ? (
              <div className="flex justify-center items-center h-full">
                <div className="grid grid-cols-3 gap-6 w-full">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="border rounded-lg overflow-hidden animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ThemeListForAdmin
                themes={paginationProps.paginatedDatas}
                onRefresh={refetch}
              />
            )}
            <Pagination {...paginationProps} datas={filteredThemes ?? []} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeManagementPage;
