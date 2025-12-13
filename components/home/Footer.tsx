'use client';

import React from 'react';
import { Facebook, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const textColor = "text-green-50/80";
  const hoverColor = "hover:text-white";

  const headerStyle = "text-sm font-bold text-white uppercase tracking-wider mb-6";

  const linkFocusStyle = "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded-sm";

  const itemStyle = `group flex items-start gap-3 text-sm ${textColor} ${hoverColor} transition-colors duration-300 leading-relaxed cursor-pointer w-full ${linkFocusStyle}`;

  const iconStyle = "w-4 h-4 text-green-400 group-hover:text-white transition-colors mt-0.5 flex-shrink-0";

  return (
    <footer className="bg-green-950 pt-16 pb-8 border-t border-green-900">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          <div className="hidden md:block lg:col-span-2">
             <h4 className={headerStyle}>Thông tin công ty</h4>
             <ul className="space-y-4">
                <li className={`flex items-start gap-3 text-sm ${textColor} leading-relaxed`}>
                   <ChevronRight className={iconStyle} aria-hidden="true" />
                   <span>Số 123, Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
                </li>
                <li>
                   <a href="tel:1900636340" className={itemStyle}>
                      <ChevronRight className={iconStyle} aria-hidden="true" />
                      <span className="font-medium tracking-wide">1900 6363 40</span>
                   </a>
                </li>
                <li>
                   <a href="mailto:contact@esat.vn" className={itemStyle}>
                      <ChevronRight className={iconStyle} aria-hidden="true" />
                      <span>contact@esat.vn</span>
                   </a>
                </li>
             </ul>
          </div>

          <div className="hidden md:block">
            <h4 className={headerStyle}>Chính sách</h4>
            <ul className="space-y-4">
              {['Chính sách & Điều khoản', 'Chính sách đổi trả', 'Chính sách vận chuyển', 'Bảo mật & Quyền riêng tư'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className={itemStyle}>
                    <ChevronRight className={iconStyle} aria-hidden="true" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className={headerStyle}>Kết nối với chúng tôi</h4>

             <div className="flex gap-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-full bg-green-900 border border-green-800 flex items-center justify-center text-green-100 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-300 group ${linkFocusStyle}`}
                  aria-label="Theo dõi chúng tôi trên Facebook"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-full bg-green-900 border border-green-800 flex items-center justify-center text-green-100 hover:bg-[#00B2FF] hover:border-[#00B2FF] hover:text-white transition-all duration-300 group ${linkFocusStyle}`}
                  aria-label="Chat với chúng tôi qua Messenger"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.03 2 11C2 13.66 3.39 16.03 5.61 17.58V22L9.41 19.92C10.24 20.09 11.11 20.18 12 20.18C17.52 20.18 22 16.15 22 11C22 6.03 17.52 2 12 2ZM13.06 14.65L10.59 11.96L5.88 14.65L10.94 6.35L13.41 9.04L18.12 6.35L13.06 14.65Z" />
                  </svg>
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-full bg-green-900 border border-green-800 flex items-center justify-center text-green-100 hover:bg-[#0068FF] hover:border-[#0068FF] hover:text-white transition-all duration-300 group ${linkFocusStyle}`}
                  aria-label="Liên hệ qua Zalo"
                >
                   <svg viewBox="0 0 40 40" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="900" style={{ fontFamily: 'Arial, sans-serif' }}>Zalo</text>
                   </svg>
                </a>
             </div>
          </div>
        </div>

        <div className="border-t border-green-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-200/50">
           <p>&copy; {new Date().getFullYear()} Công Ty TNHH ESAT. Bảo lưu mọi quyền.</p>
           <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
