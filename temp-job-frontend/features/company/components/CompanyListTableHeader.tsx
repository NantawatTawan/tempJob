import React from "react";

const CompanyListTableHeader = () => {
  return (
    <tr>
      <th className="px-6 py-3 text-left text-sm font-medium text-green-700">
        ชื่อบริษัท
      </th>
      <th className="px-6 py-3 text-left text-sm font-medium text-green-700">
        อีเมล
      </th>
      <th className="px-6 py-3 text-left text-sm font-medium text-green-700">
        ชื่อแพ็คเก็จ
      </th>
      <th className="px-6 py-3 text-left text-sm font-medium text-green-700">
        หมดอายุ
      </th>
      <th className="px-6 py-3 text-left text-sm font-medium text-green-700">
        สถานะ
      </th>
      <th className="px-6 py-3 text-left text-sm font-medium text-green-700">
        การจัดการ
      </th>
    </tr>
  );
};

export default CompanyListTableHeader;
