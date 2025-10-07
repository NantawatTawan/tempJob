"use client";
import { useFetchFreelancer } from "@/features/freelancers/hooks/queries/useFetchFreelancer";
import { freelancerService } from "@/features/freelancers/service/freelancer.service";
import { useFetchPostedJobById } from "@/features/posted-jobs/hooks/queries/useFetchPostedJobById";
import { formatThaiDate } from "@/lib/helpers/date.helper";
import { withCatch } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { Briefcase, Calendar, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ReviewPostedJobPage = () => {
  const [rating, setRating] = useState(0);

  const searchParams = useSearchParams();

  const freelancerId = searchParams.get("freelancerId");

  const [reviewContent, setReviewContent] = useState("");

  const { slug: jobId } = useParams();

  const { data: postedJob } = useFetchPostedJobById(jobId as string);

  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: freelancer } = useFetchFreelancer(freelancerId as string);

  const applicantInfo = postedJob?.applications.find(
    (a) => a.freelancer_id === freelancerId
  );

  const router = useRouter();

  async function handleSubmitReview() {
    try {
      const [, error] = await withCatch(() =>
        freelancerService.reviewFreelancer({
          freelancerId: freelancerId as string,
          rating,
          reviewContent,
          jobId: jobId as string,
        })
      );

      if (error) {
        showErrorAlert(error.message);
        return;
      }

      showSuccessAlert("รีวิวฟรีแลนซ์สำเร็จ");

      router.push(`/posted-jobs/${jobId}`);
    } catch (error: any) {
      console.error(`ล้มเหลวระหว่างการรีวิวฟรีแลนซ์ >> ${error.message}`);
      showErrorAlert("ล้มเหลวระหว่างรีวิวฟรีแลนซ์");
    }
  }

  if (!applicantInfo) {
    return <div>Applicant not found</div>;
  }

  return (
    <div id="review-job-seeker-page" className="bg-white min-h-screen p-24">
      <main className="max-w-2xl mx-auto px-4 py-6">
        <section
          id="job-details"
          className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-emerald-100"
        >
          <div className="flex items-start gap-4 mb-4">
            <Image
              src={freelancer?.profile_image_url ?? ""}
              className="w-16 h-16 rounded-full border-2 border-emerald-200"
              alt="Applicant"
              width={200}
              height={200}
            />
            <div>
              <h2 className="text-lg font-semibold text-emerald-900">
                {freelancer?.fullname}
              </h2>
              <p className="text-emerald-600 flex items-center gap-2">
                <Briefcase size={16} />
                ตำแหน่ง: {postedJob?.job_types.title}
              </p>
              <p className="text-emerald-600 flex items-center gap-2">
                <Calendar size={16} />
                วันที่ทำงาน: {formatThaiDate(applicantInfo.created_at)}
              </p>
            </div>
          </div>
        </section>
        <section
          id="review-form"
          className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-emerald-900">
              ให้คะแนนผู้สมัคร
            </h3>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  className={`cursor-pointer transition-colors ${
                    (hoveredRating || rating) >= star
                      ? "fill-emerald-400 text-emerald-400"
                      : "text-emerald-200"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-emerald-900">
                  ความคิดเห็นเพิ่มเติม
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full border border-emerald-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="เขียนรีวิวของคุณที่นี่..."
                ></textarea>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium"
                onClick={handleSubmitReview}
                disabled={rating <= 2 && !reviewContent}
              >
                ส่งรีวิว
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReviewPostedJobPage;
