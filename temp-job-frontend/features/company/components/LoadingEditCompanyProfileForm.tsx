import { Skeleton } from "@/shared/components/ui/skeleton";

const LoadingEditCompanyProfileForm = () => {
  return (
    <div className="bg-emerald-50 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-emerald-800">
          ข้อมูลบริษัท
        </h1>
        
        <div className="animate-pulse space-y-8">
          {/* Company logo section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              โลโก้บริษัท
            </h2>
            <div className="flex items-center space-x-6">
              <Skeleton className="h-32 w-32 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </section>

          {/* Company info section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              ข้อมูลบริษัท
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Contact info section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              ข้อมูลการติดต่อ
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Additional info section */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-emerald-900">
              ข้อมูลเพิ่มเติม
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </section>

          {/* Button section */}
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingEditCompanyProfileForm;
