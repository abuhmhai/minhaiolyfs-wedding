'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-10">
      <div className="container mx-auto px-4">
        {/* Social links */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">GET CONNECTED</h3>
          <div className="flex items-center space-x-4">
            <Link href="https://www.facebook.com/NhungTrangWeddingHouse/" className="text-gray-600 hover:text-gray-900">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="mailto:nhungtrangweddingvn@gmail.com" className="text-gray-600 hover:text-gray-900">
              <Mail className="h-5 w-5" />
            </Link>
            <Link href="https://www.instagram.com/nhungtrangweddingvn/" className="text-gray-600 hover:text-gray-900">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 italic">
              the BLOG
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">NHUNGTRANG WEDDING</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900">CÔNG TY TNHH NHUNGTRANG STUDIO</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">Giấy phép kinh doanh số: 0313365584</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">do sở kế hoạch đầu tư cấp ngày: 23/07/2015</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">EMAIL: info@nhungtrangwedding.com</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">ĐỊA CHỈ: 24 Hoa Cúc, P7, Phú Nhuận, HCM</Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">DỊCH VỤ KHÁCH HÀNG</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/pages/nhung-cau-hoi-thuong-gap" className="hover:text-gray-900">Những câu hỏi thường gặp</Link>
              </li>
              <li>
                <Link href="/pages/size-infomation" className="hover:text-gray-900">Hướng dẫn chọn size</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">Hotline 0938330448</Link>
              </li>
              <li>
                <Link href="/pages/chinh-sach-bao-hanh" className="hover:text-gray-900">Chính sách bảo hành</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="https://giaycuoi.com.vn/account" className="hover:text-gray-900">Tình trạng đơn hàng</Link>
              </li>
              <li>
                <Link href="/pages/shipping-timing" className="hover:text-gray-900">Chính sách vận chuyển</Link>
              </li>
              <li>
                <Link href="/pages/returns-exchanges" className="hover:text-gray-900">Quy định đổi trả</Link>
              </li>
              <li>
                <Link href="/pages/chinh-sach-thanh-toan" className="hover:text-gray-900">Chính sách thanh toán</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">ĐIỀU KHOẢN - CHÍNH SÁCH</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/pages/dieu-khoan-su-dung" className="hover:text-gray-900">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link href="/pages/chinh-sach-bao-mat" className="hover:text-gray-900">Chính sách bảo mật</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-zinc-600 text-white py-4">
        <div className="container mx-auto px-4 text-center text-xs">
          <p className="flex items-center justify-center space-x-2">
            <span>Copyright 2011 NHUNGTRANG WEDDING. All rights reserved |</span>
            <Link href="/pages/about-us" className="hover:underline">Tầm nhìn của NHUNGTRANG</Link>
            <span>|</span>
            <Link href="/pages/nhung-cau-hoi-thuong-gap" className="hover:underline">FAQ</Link>
            <span>|</span>
            <Link href="https://www.facebook.com/NhungTrangWeddingHouse/" className="hover:underline">Liên hệ qua Fanpage</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
