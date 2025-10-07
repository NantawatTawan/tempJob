"use client";
import AdvertisementCarousel from "@/features/advertisement/components/AdvertisementCarousel";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CAROUSEL_DELAY_IN_MS = 4000;

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !subject || !message) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
      setIsLoading(false);
      return;
    }

    try {
      // **สำคัญ:** แก้ไข URL ตรงนี้ให้เป็น URL ของ Backend API จริงของคุณ
      // โดยปกติจะใช้ process.env.NEXT_PUBLIC_API_URL
      await axios.post(`http://localhost:8000/api/contact/send`, {
        from: email,
        subject: subject,
        text: message,
      });

      Swal.fire({
        icon: "success",
        title: "ส่งข้อความสำเร็จ!",
        text: "ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
      });

      // ล้างฟอร์มหลังส่งสำเร็จ
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Failed to send email:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary h-full pt-24">
      <main className="container mx-auto px-4 py-8">
        <AdvertisementCarousel carouselDelayInMs={CAROUSEL_DELAY_IN_MS} />

        <section
          id="contact-header"
          className="my-8 flex flex-col items-center w-full"
        >
          <h1 className="text-2xl font-bold mb-2">ติดต่อทีมงาน tempjob</h1>
          <p className="text-gray-600">
            จันทร์-ศุกร์ 08.30น. - 17.30น. ยกเว้นวันหยุดราชการ
          </p>
        </section>

        <div className="flex gap-6 w-full">
          <section id="contact-options" className="space-y-6 mb-6 w-1/2">
            {/* ... ส่วนข้อมูลติดต่อ (เหมือนเดิม) ... */}
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
            {/* ฟอร์มจะเรียกใช้ handleSubmit เมื่อกดส่ง */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* ===> นี่คือช่องกรอกอีเมลสำหรับตอบกลับที่เพิ่มเข้ามา <=== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมลของคุณ (สำหรับติดต่อกลับ)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              {/* ======================================================= */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หัวข้อ
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="กรุณาระบุหัวข้อ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ข้อความ
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-32"
                  placeholder="กรุณาพิมพ์ข้อความของคุณ"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
              >
                {isLoading ? "กำลังส่ง..." : "ส่งข้อความ"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
