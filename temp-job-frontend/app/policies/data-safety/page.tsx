import React from 'react'

const DataSafetyPage = () => {
  return (
    <div className="w-full h-full px-40 pt-navbar">
      <h1 className="text-2xl font-bold mb-4 text-center">Data Safety</h1>

      <div className="space-y-6 w-[500px] mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">1. ข้อมูลที่เก็บรวบรวม</h2>
          <p className="mb-2">แอปนี้เก็บข้อมูลส่วนบุคคลต่อไปนี้จากผู้ใช้งาน:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ชื่อ</li>
            <li>อีเมล</li>
            <li>เบอร์โทรศัพท์</li>
            <li>วันเกิด</li>
            <li>เพศ</li>
            <li>สัญชาติ</li>
            <li>ศาสนา</li>
            <li>ภูมิลำเนา</li>
            <li>วุฒิการศึกษา</li>
            <li>สาขาวิชาที่เรียน</li>
            <li>ใบขับขี่</li>
            <li>ที่อยู่</li>
            <li>รูปภาพโปรไฟล์ (เข้าถึงอัลบั้มมือถือเพื่ออัปโหลดภาพ)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>เพื่อสร้างโปรไฟล์สำหรับการหางาน</li>
            <li>เพื่อให้ผู้สมัครสามารถสมัครงานผ่านแอป</li>
            <li>เพื่อให้นายจ้างสามารถค้นหาและติดต่อผู้สมัครงาน</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">3. การแชร์ข้อมูล</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>ข้อมูลของผู้ใช้งานจะไม่ถูกแชร์กับบุคคลภายนอก</li>
            <li>นายจ้างที่ลงทะเบียนกับระบบเท่านั้นที่สามารถเห็นข้อมูลผู้สมัคร</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">4. การเข้ารหัสข้อมูล</h2>
          <p className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            ข้อมูลผู้ใช้ทั้งหมดมีการเข้ารหัสระหว่างการส่งและการจัดเก็บ
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">5. การลบหรือควบคุมข้อมูล</h2>
          <p className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            ผู้ใช้สามารถดู แก้ไข หรือร้องขอลบข้อมูลของตนเองได้ผ่านฟังก์ชันภายในแอป
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">6. การเก็บข้อมูลของผู้เยาว์</h2>
          <p>แอปนี้ไม่ได้ออกแบบมาสำหรับเด็กอายุต่ำกว่า 13 ปี</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-900 mb-3">7. การใช้ SDK และ Tracking</h2>
          <p>แอปนี้ ไม่ใช้เครื่องมือติดตาม (Tracking SDKs) และ ไม่ใช้บริการวิเคราะห์ (Analytics SDKs) ใดๆ</p>
        </section>
      </div>

    </div>
  )
}

export default DataSafetyPage