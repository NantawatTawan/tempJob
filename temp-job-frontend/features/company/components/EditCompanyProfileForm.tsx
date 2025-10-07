'use client';
import { useFetchAllCompanyTypes } from '@/features/company/hooks/queries/useFetchAllCompanyTypes';
import {
  Company,
  CompanySchema,
} from '@/features/company/schemas/company.schema';
import { companyService } from '@/features/company/services/company.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useProvinces } from '@/shared/hooks/useProvinces';
import { useSyncForm } from '@/shared/hooks/useSyncForm';
import { showErrorAlert, showSuccessAlert } from '@/shared/utils/swal.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSyncCompanyProfileImage } from '../hooks/useSyncCompanyProfileImage';
import { useSyncCompanyType } from '../hooks/useSyncCompanyType';
import { sortByThai } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const FormSchema = CompanySchema.omit({
  id: true,
  user_id: true,
  package_id: true,
  subscription_id: true,
  profile_image_url: true,
  packages: true,
});

type FormFields = z.infer<typeof FormSchema>;

interface IEditCompanyProfileFormProps {
  companyInfo: Company;
}

const EditCompanyProfileForm = ({
  companyInfo,
}: IEditCompanyProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: companyInfo,
  });

  const router = useRouter();

  const { province, district, sub_district } = watch();

  const { provinces, amphures, tambons } = useProvinces(province, district);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [themeFile, setThemeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: companyTypes } = useFetchAllCompanyTypes();

  useSyncForm(companyInfo, setValue);

  useSyncCompanyType(setValue, companyTypes ?? [], companyInfo);

  useSyncCompanyProfileImage(setCurrentImageUrl, setPreviewUrl, companyInfo);

  useEffect(() => {
    if (!companyInfo) return;

    setValue('province', companyInfo.province);

    setValue('district', companyInfo.district);

    setValue('sub_district', companyInfo.sub_district);
  }, [companyInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showErrorAlert('ไฟล์มีขนาดใหญ่เกินไป กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 5MB');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setThemeFile(file);
    setPreviewUrl(newPreviewUrl);
    setCurrentImageUrl(null);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setThemeFile(null);
    setPreviewUrl(null);
    setCurrentImageUrl(null);

    setFileInputKey(Date.now());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormFields) => {
    try {
      if (!companyInfo) return;

      setIsSubmitting(true);

      let companyImageUrl: string | null = null;

      if (themeFile) {
        companyImageUrl = await companyService.updateCompanyLogo(
          companyInfo.id,
          themeFile,
          companyInfo.profile_image_url ?? ''
        );
      }

      await companyService.updateCompanyInfoByCompanyId(companyInfo.id, {
        ...data,
        profile_image_url: companyImageUrl ?? undefined,
      });

      showSuccessAlert('บันทึกข้อมูลเรียบร้อย');

      window.location.reload();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-emerald-50 h-full pt-24 px-24">
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-6 lg:px-8">
        <div id="company-settings" className="max-w-4xl mx-auto py-8">
          <section
            id="company-profile-section"
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              ข้อมูลบริษัท
            </h2>
            <div className="space-y-6">
              <div className="mb-6">
                {previewUrl || currentImageUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="โลโก้บริษัท"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority
                          key={`preview-${previewUrl}`}
                        />
                      ) : currentImageUrl ? (
                        <Image
                          src={currentImageUrl}
                          alt="โลโก้บริษัท"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority
                          key={`current-${currentImageUrl}`}
                        />
                      ) : null}
                      <Button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 h-auto w-auto rounded-full shadow-md transition-colors duration-200"
                        aria-label="ลบรูปภาพ"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {previewUrl && (
                      <p className="text-xs text-gray-500 text-center">
                        {themeFile?.name} (
                        {Math.round((themeFile?.size || 0) / 1024)} KB)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200">
                    <ImageIcon className="h-12 w-12 text-emerald-500 mb-4" />
                    <p className="text-gray-700 mb-4 text-center font-medium">
                      อัพโหลดโลโก้บริษัท
                    </p>
                    <label className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer flex items-center gap-2 transition-colors shadow-sm">
                      <Upload className="h-4 w-4" />
                      <span>เลือกไฟล์</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isSubmitting}
                        key={fileInputKey}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      รองรับไฟล์: JPG, PNG, WEBP (ไม่เกิน 5MB)
                    </p>
                  </div>
                )}
              </div>
              <Input
                label="ชื่อบริษัท"
                {...register('company_name')}
                placeholder="ชื่อบริษัท"
                error={errors.company_name?.message}
              />
              <Select
                label="ลักษณะธุรกิจ"
                {...register('company_type_id', {
                  setValueAs: (value) => (value ? parseInt(value, 10) : null),
                })}
                placeholder="เลือกประเภทธุรกิจ"
                options={
                  companyTypes?.map((companyType) => ({
                    value: companyType.id?.toString(),
                    label: companyType.title,
                  })) ?? []
                }
                error={errors.company_type_id?.message}
              />
              <Textarea
                label="รายละเอียดเพิ่มเติมเกี่ยวกับบริษัท"
                {...register('additional_info')}
                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับบริษัท"
                error={errors.additional_info?.message}
              />
            </div>
          </section>
          <section
            id="contact-info-section"
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              ข้อมูลการติดต่อ
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  ที่อยู่บริษัท
                </label>
                <Textarea
                  {...register('address')}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  error={errors.address?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">
                    จังหวัด
                  </label>
                  <Select
                    {...register('province')}
                    value={province}
                    className="w-full"
                    placeholder="เลือกจังหวัด"
                    options={
                      sortByThai(provinces ?? [], 'value').map((province) => ({
                        label: province.value,
                        value: province.key,
                      })) ?? []
                    }
                    error={errors.province?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">
                    เขต/อำเภอ
                  </label>
                  <Select
                    {...register('district')}
                    value={district}
                    className="w-full"
                    placeholder="เลือกเขต/อำเภอ"
                    options={
                      sortByThai(amphures ?? [], 'value').map((amphure) => ({
                        label: amphure.value,
                        value: amphure.key,
                      })) ?? []
                    }
                    error={errors.district?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">
                    แขวง/ตำบล
                  </label>
                  <Select
                    {...register('sub_district')}
                    value={sub_district}
                    className="w-full"
                    placeholder="เลือกแขวง/ตำบล"
                    options={
                      tambons?.map((tambon) => ({
                        label: tambon.value,
                        value: tambon.key,
                      })) ?? []
                    }
                    error={errors.sub_district?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">
                    รหัสไปรษณีย์
                  </label>
                  <Input
                    {...register('zip_code')}
                    className="w-full"
                    error={errors.zip_code?.message}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="ชื่อผู้ติดต่อ"
                  {...register('company_contact_person_name')}
                  placeholder="ชื่อผู้ติดต่อ"
                  error={errors.company_contact_person_name?.message}
                />
                <Input
                  label="เลขประจำตัวผู้เสียภาษี"
                  {...register('tax_no')}
                  placeholder="เลขประจำตัวผู้เสียภาษี"
                  error={errors.tax_no?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <Input
                    type="tel"
                    {...register('company_phone_number')}
                    className="w-full"
                    error={errors.company_phone_number?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">
                    อีเมลติดต่อ
                  </label>
                  <Input
                    type="email"
                    {...register('company_email')}
                    className="w-full"
                    error={errors.company_email?.message}
                  />
                </div>
              </div>
            </div>
          </section>
          <section
            id="additional-info-section"
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              ข้อมูลเพิ่มเติม
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  การเดินทางมายังบริษัท
                </label>
                <div className="space-y-4">
                  <Textarea
                    {...register('transportation_guide')}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="รายละเอียดการเดินทาง"
                    error={errors.transportation_guide?.message}
                  />
                  <Input
                    label="LOCATION GPS ที่ตั้งบริษัท"
                    placeholder="ใช้วิธีการ copy link จาก google map"
                    {...register('company_location_map_url')}
                    className="w-full"
                    error={errors.company_location_map_url?.message}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  สวัสดิการ
                </label>
                <Textarea
                  {...register('welfare')}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={4}
                  error={errors.welfare?.message}
                />
              </div>
            </div>
          </section>
          <div id="save-section" className="flex justify-end space-x-4">
            <button
              onClick={() => {
                router.push('/posted-jobs');
              }}
              className="px-6 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-emerald-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyProfileForm;
