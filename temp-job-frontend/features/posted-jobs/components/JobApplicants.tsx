"use client";
import { JobApplication } from "../schemas/posted-job.schema";
import JobApplicant from "./JobApplicant";
import React, { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface IJobApplicantsProps {
  applicants: JobApplication[];
}

type ReviewFilter = "ทั้งหมด" | "รีวิวแล้ว" | "ยังไม่รีวิว";

const JobApplicants = ({ applicants }: IJobApplicantsProps) => {
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("ทั้งหมด");
  const [sortDirection, setSortDirection] = useState<
    "descending" | "ascending"
  >("descending");

  const processedApplicants = useMemo(() => {
    let processableApplicants = [...applicants];

    if (reviewFilter === "รีวิวแล้ว") {
      processableApplicants = processableApplicants.filter(
        (applicant) => applicant.is_reviewed
      );
    } else if (reviewFilter === "ยังไม่รีวิว") {
      processableApplicants = processableApplicants.filter(
        (applicant) => !applicant.is_reviewed
      );
    }

    processableApplicants.sort((a, b) => {
      const aValue = a.freelancer.rating_avg;
      const bValue = b.freelancer.rating_avg;
      if (aValue < bValue) return sortDirection === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "ascending" ? 1 : -1;
      return 0;
    });

    return processableApplicants;
  }, [applicants, reviewFilter, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection((prev) =>
      prev === "ascending" ? "descending" : "ascending"
    );
  };

  return (
    <div id="applicants-list" className="col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-green-100">
        <div className="p-4 border-b border-green-100 flex items-center justify-between gap-4">
          {/* --- UI Dropdown สำหรับ Filter --- */}
          <div>
            <label
              htmlFor="review-filter"
              className="text-sm font-medium text-gray-700 mr-2"
            >
              ตัวกรอง:
            </label>
            <select
              id="review-filter"
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value as ReviewFilter)}
              className="border border-green-200 rounded-lg px-3 py-2 text-green-800 focus:ring-2 focus:ring-green-200 focus:border-green-300"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="รีวิวแล้ว">รีวิวแล้ว</option>
              <option value="ยังไม่รีวิว">ยังไม่รีวิว</option>
            </select>
          </div>

          {/* --- UI สำหรับกดเรียงลำดับ --- */}
          <Button
            variant="outline"
            onClick={toggleSortDirection}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>
              ระดับดาว:{" "}
              {sortDirection === "descending" ? "มากไปน้อย" : "น้อยไปมาก"}
            </span>
          </Button>
        </div>

        {processedApplicants.length > 0 ? (
          processedApplicants.map((applicant) => (
            <JobApplicant key={applicant.freelancer_id} applicant={applicant} />
          ))
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p>ไม่พบผู้สมัครที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
