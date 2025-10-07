interface ILoadingPlaceholderProps {
  title: string;
}

const LoadingPlaceholder = ({ title }: ILoadingPlaceholderProps) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-green-800">{title}</h2>
      <div className="flex gap-6">
        <div id="job-type-form" className="w-1/3">
          <div className="space-y-4">
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 w-full bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
        <div id="job-type-list" className="w-2/3">
          <div className="overflow-x-auto">
            <div className="h-40 w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingPlaceholder;
