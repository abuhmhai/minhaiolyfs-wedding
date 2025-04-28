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
            <Link href="https://www.facebook.com/nhung.trang.5855594" className="text-gray-600 hover:text-gray-900">
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
                <Link href="/" className="hover:text-gray-900">NHUNGTRANG STUDIO COMPANY LIMITED</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">Business License No: 0313365584</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">Issued by: Department of Planning and Investment on: 23/07/2024</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">EMAIL: info@nhungtrangwedding.com</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">ADDRESS: HANOI</Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/pages/frequently-asked-questions" className="hover:text-gray-900">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/pages/size-information" className="hover:text-gray-900">Size Guide</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900">Hotline 0938330448</Link>
              </li>
              <li>
                <Link href="/pages/warranty-policy" className="hover:text-gray-900">Warranty Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">CUSTOMER SUPPORT</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="https://giaycuoi.com.vn/account" className="hover:text-gray-900">Order Status</Link>
              </li>
              <li>
                <Link href="/pages/shipping-policy" className="hover:text-gray-900">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/pages/return-policy" className="hover:text-gray-900">Return Policy</Link>
              </li>
              <li>
                <Link href="/pages/payment-policy" className="hover:text-gray-900">Payment Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-sm font-medium uppercase text-gray-700 mb-4">TERMS & POLICIES</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/pages/terms-of-use" className="hover:text-gray-900">Terms of Use</Link>
              </li>
              <li>
                <Link href="/pages/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-zinc-600 text-white py-4">
        <div className="container mx-auto px-4 text-center text-xs">
          <p className="flex items-center justify-center space-x-2">
            <span>Copyright 2025 NHUNGTRANG WEDDING. All rights reserved |</span>
            <Link href="/pages/about-us" className="hover:underline">NHUNGTRANG's Vision</Link>
            <span>|</span>
            <Link href="/pages/nhung-cau-hoi-thuong-gap" className="hover:underline">FAQ</Link>
            <span>|</span>
            <Link href="https://www.facebook.com/nhung.trang.5855594" className="hover:underline">Contact via Fanpage</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
