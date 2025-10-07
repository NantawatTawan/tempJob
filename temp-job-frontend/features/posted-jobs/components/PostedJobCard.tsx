import { Button } from '@/shared/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Briefcase,
  Calendar,
  Clock,
  Eye,
  MapPin,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { isJobExpired } from '../helpers/posted-job.helper';
import { useHandlePostedJobActions } from '../hooks/useHandlePostedJobActions';
import { PostedJobWithViewsAndApplications } from '../schemas/posted-job.schema';
import DeleteJobModal from './DeleteJobModal';
import { useFetchJobTypeById } from '../hooks/queries/useFetchJobTypeById';

interface IPostedJobCardProps {
  job: PostedJobWithViewsAndApplications;
  onRefresh: () => void;
}

const PostedJobCard = ({ job, onRefresh }: IPostedJobCardProps) => {
  const formattedDate = job.created_at
    ? formatDistanceToNow(new Date(job.created_at), {
        addSuffix: true,
        locale: th,
      })
    : '';

  const { data: jobType } = useFetchJobTypeById(job.job_type_id ?? 0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    handleDeleteConfirm,
    handleDisableJob,
    handleActivateJob,
    isDeleting,
  } = useHandlePostedJobActions({
    job,
    onRefresh,
    onFinishDelete: () => setShowDeleteModal(false),
  });

  return (
    <div className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-emerald-600 mb-1 flex items-center">
            <Briefcase size={18} className="mr-2 text-emerald-500" />
            {jobType?.title} - {job.hire_type} - {job.site}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={14} className="mr-1" />
            <p>{job.province || 'ไม่ระบุจังหวัด'}</p>
            <span className="mx-2">•</span>
            <Clock size={14} className="mr-1" />
            <p>โพสต์{formattedDate}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isJobExpired(job)
              ? 'bg-red-50 text-red-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isJobExpired(job) ? 'หมดอายุ' : 'เปิดรับสมัคร'}
        </span>
      </div>

      {job.description && (
        <div className="mt-3 mb-4">
          <p className="text-gray-600 text-sm line-clamp-2">
            {job.description}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-4 border-t pt-4 border-gray-100">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-emerald-500" />
          <span className="text-gray-700 font-medium">
            {job.applications.length}{' '}
            <span className="text-gray-500 font-normal">คนสมัคร</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-emerald-500" />
          <span className="text-gray-700 font-medium">
            {job.views.length}{' '}
            <span className="text-gray-500 font-normal">การเข้าชม</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-emerald-500" />
          <span className="text-gray-700">
            หมดอายุ:{' '}
            <span className="font-medium">
              {new Date(job.expired_at).toLocaleDateString('th-TH')}
            </span>
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <Link target='_blank' href={`/posted-jobs/${job.id}`}>
          <Button
            variant="outline"
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            ดูรายละเอียด
          </Button>
        </Link>
        {!isJobExpired(job) && (
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleDisableJob}
          >
            ปิดประกาศ
          </Button>
        )}
        {isJobExpired(job) && (
          <Button
            variant="outline"
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            onClick={handleActivateJob}
          >
            เปิดประกาศ
          </Button>
        )}
        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} className="mr-1" />
          ลบประกาศ
        </Button>
      </div>

      <DeleteJobModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        jobTitle={jobType?.title ?? ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PostedJobCard;
