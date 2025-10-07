"use client"
import React from 'react'

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">เกิดข้อผิดพลาด</h1>
        <p className="text-xl text-gray-600 mb-4">ขออภัย ระบบเกิดข้อผิดพลาด</p>
        <p className="text-gray-500 mb-8">
          กรุณาติดต่อผู้ดูแลระบบผ่านช่องทางด้านล่าง
          <br/>
          <a href="mailto:tempjob.cs@gmail.com" className="text-[#00BF63] hover:underline"><span className='text-gray-500'>Email :</span> tempjob.cs@gmail.com</a>
          <br/>
          LINE OA: <a href="https://lin.ee/jM1a1h0" className="text-[#00BF63] hover:underline"> @tempjob</a>
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#00BF63] text-white rounded-lg hover:bg-[#00A857] transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-[#00BF63] text-[#00BF63] rounded-lg hover:bg-gray-50 transition-colors inline-block"
          >
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage