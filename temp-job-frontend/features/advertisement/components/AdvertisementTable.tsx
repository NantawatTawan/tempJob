import { Skeleton } from "@/shared/components/ui/skeleton";
import { useFetchAllAdvertisements } from "../hooks/queries/useFetchAllAdvertisements";
import AdvertisementRow from "./AdvertisementRow";
import { usePagination } from "@/shared/hooks/usePagination";
import { Advertisement } from "../schemas/advertisement.schema";
import Pagination from "@/shared/components/ui/pagination";
const TABLE_HEADER_TITLES = ["รูปภาพ", "แสดงหน้าไหน", "วันที่สร้าง", "จัดการ"];

const AdvertisementTable = () => {
  const {
    data: advertisements,
    isFetching,
    refetch,
  } = useFetchAllAdvertisements();

  const paginationProps = usePagination<Advertisement>({
    datas: advertisements ?? [],
    rowsPerPage: 10,
  });

  return (
    <>
      <table className="w-full border-collapse">
        <thead className="bg-green-50">
          <TableHeader />
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isFetching ? (
            <AdsSkeleton />
          ) : advertisements && advertisements.length > 0 ? (
            paginationProps.paginatedDatas?.map((ad) => (
              <AdvertisementRow key={ad.id} ad={ad} onRefresh={refetch} />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                ไม่พบข้อมูลโฆษณา
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination {...paginationProps} datas={advertisements ?? []} />
    </>
  );
};

const TableHeader = () => {
  return (
    <tr>
      {TABLE_HEADER_TITLES.map((title) => (
        <th className="py-3 text-left pl-4" key={title}>
          {title}
        </th>
      ))}
    </tr>
  );
};

const AdsSkeleton = () => {
  return Array(3)
    .fill(0)
    .map((_, index) => (
      <tr key={index}>
        <td className="px-4 py-3">
          <Skeleton className="h-12 w-20" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-6 w-32" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-6 w-24" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-6 w-24" />
        </td>
      </tr>
    ));
};

export default AdvertisementTable;
