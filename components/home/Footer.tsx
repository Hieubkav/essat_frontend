'use client';

import React, { useState, useEffect } from 'react';
import { Facebook, ChevronRight } from 'lucide-react';
import { getFooterData, FooterConfig, SocialLink } from '@/lib/homeApi';

// Helper function để lấy URL từ social_links array
const getSocialUrl = (socialLinks: SocialLink[] | undefined, platform: string): string => {
  const found = socialLinks?.find(s => s.platform === platform);
  return found?.url || '#';
};

export const Footer: React.FC = () => {
  const [footer, setFooter] = useState<FooterConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFooterData();
        if (data) {
          setFooter(data);
        }
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const textColor = "text-green-50/80";
  const hoverColor = "hover:text-white";

  const headerStyle = "text-sm font-bold text-white uppercase tracking-wider mb-6";

  const linkFocusStyle = "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded-sm";

  const itemStyle = `group flex items-start gap-3 text-sm ${textColor} ${hoverColor} transition-colors duration-300 leading-relaxed cursor-pointer w-full ${linkFocusStyle}`;

  const iconStyle = "w-4 h-4 text-green-400 group-hover:text-white transition-colors mt-0.5 flex-shrink-0";

  if (isLoading) {
    return (
      <footer className="bg-green-950 py-10 border-t border-green-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="hidden md:block lg:col-span-2">
              <div className="h-5 w-32 bg-green-900 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-green-900/50 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-green-900/50 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-green-900/50 rounded animate-pulse" />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="h-5 w-24 bg-green-900 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="h-4 w-full bg-green-900/50 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-5 w-40 bg-green-900 rounded animate-pulse mb-6" />
              <div className="flex gap-4">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="w-11 h-11 rounded-full bg-green-900 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (!footer) {
    return null;
  }

  return (
    <footer className="bg-green-950 py-10 border-t border-green-900">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">

          <div className="hidden md:block lg:col-span-2">
             <h4 className={headerStyle}>Thông tin công ty</h4>
             <ul className="space-y-4">
                <li className={`flex items-start gap-3 text-sm ${textColor} leading-relaxed`}>
                   <ChevronRight className={iconStyle} aria-hidden="true" />
                   <span>{footer.address}</span>
                </li>
                <li>
                   <a href={`tel:${footer.phone.replace(/\s/g, '')}`} className={itemStyle}>
                      <ChevronRight className={iconStyle} aria-hidden="true" />
                      <span className="font-medium tracking-wide">{footer.phone}</span>
                   </a>
                </li>
                <li>
                   <a href={`mailto:${footer.email}`} className={itemStyle}>
                      <ChevronRight className={iconStyle} aria-hidden="true" />
                      <span>{footer.email}</span>
                   </a>
                </li>
             </ul>
          </div>

          <div className="hidden md:block">
            <h4 className={headerStyle}>Chính sách</h4>
            <ul className="space-y-4">
              {(footer.policies || []).map((policy, idx) => (
                <li key={idx}>
                  <a href={policy.link || '#'} className={itemStyle}>
                    <ChevronRight className={iconStyle} aria-hidden="true" />
                    {policy.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className={headerStyle}>Kết nối với chúng tôi</h4>

             <div className="flex gap-4">
                <a
                  href={getSocialUrl(footer.social_links, 'facebook')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-full bg-green-900 border border-green-800 flex items-center justify-center text-green-100 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-300 group ${linkFocusStyle}`}
                  aria-label="Theo dõi chúng tôi trên Facebook"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href={getSocialUrl(footer.social_links, 'messenger')}
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
                  href={getSocialUrl(footer.social_links, 'zalo')}
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


      </div>
    </footer>
  );
};
