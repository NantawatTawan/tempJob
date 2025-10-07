'use client';
import AdvertisementCarousel from '@/features/advertisement/components/AdvertisementCarousel';

const CAROUSEL_DELAY_IN_MS = 4000;

const ContactPage = () => {
  return (
    <div className="bg-primary h-full pt-24">
      <main className="container mx-auto px-4 py-8">
        <AdvertisementCarousel carouselDelayInMs={CAROUSEL_DELAY_IN_MS} />

        <section
          id="contact-header"
          className="my-8 flex flex-col items-center w-full"
        >
          <h1 className="text-2xl font-bold mb-2">ติดต่อทีมงาน TempJob</h1>
          <p className="text-gray-600">
            จันทร์-ศุกทร์ 08.30น. - 17.30น. ยกเว้นวันหยุดราชการ
          </p>
        </section>

        <div className="flex gap-6 w-full">
          <section id="contact-options" className="space-y-6 mb-6 w-1/2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="fa-solid fa-headset text-green-600 text-xl"></i>
                </div>
                <h2 className="text-lg font-semibold">
                  ติดต่อฝ่ายบริการลูกค้า
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-envelope text-green-400"></i>
                  <span>LINE OA ID: @tempjob</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-brands fa-line text-green-400"></i>
                  <span>Email: tempjob.cs@gmail.com</span>
                </div>
              </div>
            </div>
          </section>

          <section
            id="contact-form"
            className="bg-white rounded-xl p-6 shadow-sm w-1/2"
          >
            <h2 className="text-lg font-semibold mb-6">ส่งข้อความถึงเรา</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หัวข้อ
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="กรุณาระบุหัวข้อ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ข้อความ
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-32"
                  placeholder="กรุณาพิมพ์ข้อความของคุณ"
                ></textarea>
              </div>
              <button
                onClick={(e) => {
                  const form = (e.target as HTMLButtonElement).form;
                  if (form) {
                    e.preventDefault();
                    const title = (form[0] as HTMLInputElement).value;
                    const detail = (form[1] as HTMLTextAreaElement).value;
                    const subject = encodeURIComponent(title);
                    const body = encodeURIComponent(detail);
                    window.location.href = `mailto:tempjob.cs@gmail.com?subject=${subject}&body=${body}`;
                  }
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
              >
                ส่งข้อความ
              </button>
            </form>
          </section>

          {/* <section
            id="map-section"
            className="bg-white rounded-xl shadow-sm overflow-hidden h-[600px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5438539685274!2d100.56324611531906!3d13.756717690344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzI0LjIiTiAxMDDCsDMzJzUyLjgiRQ!5e0!3m2!1sen!2sth!4v1625647952544!5m2!1sen!2sth"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </section> */}
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
