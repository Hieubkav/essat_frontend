'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Phone, ChevronDown, Home, Search, Mail } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { useHomeData } from './HomeDataProvider';
import { MenuItem } from '@/lib/homeApi';
import Image from 'next/image';

// Menu tĩnh Trang chủ luôn hiển thị đầu tiên
const HOME_MENU: MenuItem = { label: 'Trang chủ', href: '/' };

// Skeleton logo component
const LogoSkeleton: React.FC = () => (
  <div className="h-12 w-[150px] bg-slate-200 rounded animate-pulse" />
);

export const Header: React.FC = () => {
  const { settings, menus, isLoading } = useHomeData();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Tính toán navLinks từ context data
  const navLinks = useMemo(() => {
    const filteredMenus = menus.filter(
      (menu) => menu.label.toLowerCase() !== 'trang chủ'
    );
    return [HOME_MENU, ...filteredMenus];
  }, [menus]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === label ? null : label);
  };

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <div className="bg-white border-b border-slate-100 py-3 hidden lg:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            {isLoading ? (
              <LogoSkeleton />
            ) : settings?.logo ? (
              <Image
                src={settings.logo}
                alt={settings.site_name || 'Logo'}
                width={150}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            ) : null}
          </a>

          <div className="flex items-center gap-8 text-sm">
            {settings?.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Hotline hỗ trợ</p>
                  <p className="font-bold text-slate-800">{settings.phone}</p>
                </div>
              </div>
            )}
            {settings?.email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Email liên hệ</p>
                  <p className="font-bold text-slate-800">{settings.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 w-full transition-all duration-300 shadow-lg ${isScrolled ? 'py-0' : 'py-0'} bg-primary`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <a href="/" className="lg:hidden flex-shrink-0">
              {isLoading ? (
                <div className="h-8 w-[100px] bg-white/20 rounded animate-pulse" />
              ) : settings?.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.site_name || 'Logo'}
                  width={120}
                  height={48}
                  className="h-8 w-auto object-contain "
                />
              ) : null}
            </a>

            <nav className="hidden lg:flex items-center h-full">
              <ul className="flex items-center h-full">
                {navLinks.map((link) => (
                  <li key={link.label} className="relative group h-full flex items-center">
                    <a
                      href={link.href}
                      className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors uppercase tracking-wide h-10"
                    >
                      {link.label === 'Trang chủ' && <Home size={16} className="mb-0.5 mr-1" />}
                      {link.label}
                      {link.children && <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />}
                    </a>

                    {link.children && (
                      <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-lg overflow-hidden transform opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 border-t-2 border-secondary">
                        <ul className="py-2">
                          {link.children.map((child) => (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors border-b border-slate-50 last:border-0"
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center text-white">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Tìm kiếm"
              >
                <Search size={20} />
              </button>
              <button
                className="lg:hidden p-2 ml-2 hover:bg-white/10 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}></div>

        <div className={`lg:hidden fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            {isLoading ? (
              <div className="h-8 w-[100px] bg-white/20 rounded animate-pulse" />
            ) : settings?.logo ? (
              <Image
                src={settings.logo}
                alt={settings.site_name || 'Logo'}
                width={100}
                height={40}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="font-bold text-lg">MENU</span>
            )}
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-slate-100 last:border-0">
                  {link.children ? (
                    <div>
                      <button
                        onClick={() => toggleMobileSubmenu(link.label)}
                        className="w-full flex items-center justify-between px-5 py-4 text-slate-700 font-medium hover:bg-slate-50"
                      >
                        {link.label}
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${mobileSubmenuOpen === link.label ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`bg-slate-50 overflow-hidden transition-all duration-300 ${mobileSubmenuOpen === link.label ? 'max-h-96' : 'max-h-0'}`}>
                        <ul className="px-5 pb-4 space-y-3">
                          {link.children.map(child => (
                            <li key={child.label}>
                              <a href={child.href} className="block text-sm text-slate-600 hover:text-primary pl-4 border-l-2 border-slate-200 hover:border-primary transition-colors">
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <a href={link.href} className="block px-5 py-4 text-slate-700 font-medium hover:bg-slate-50 hover:text-primary">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {(settings?.phone || settings?.email) && (
              <div className="p-5 mt-4 bg-slate-50 mx-4 rounded-lg">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Thông tin liên hệ</p>
                <div className="space-y-3">
                  {settings?.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-primary" /> {settings.phone}
                    </div>
                  )}
                  {settings?.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail size={16} className="text-secondary" /> {settings.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
