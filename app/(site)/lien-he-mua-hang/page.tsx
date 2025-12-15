import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { Phone, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Liên hệ mua hàng | ESAT',
  description: 'Thông tin liên hệ mua hàng - ESAT',
};

export const dynamic = 'force-dynamic';

export default async function LienHeMuaHangPage() {
  const data = await getHomePageData();
  const settings = data?.settings;
  const footer = data?.components?.footer;

  return (
    <HomeDataProvider initialData={data}>
      <Header />
      <main className="bg-slate-50 min-h-[60vh]">
        {/* Hero Section */}
        <section 
          className="bg-primary py-12 md:py-16"
          aria-labelledby="page-title"
        >
          <div className="container mx-auto px-4">
            <h1 
              id="page-title"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center"
            >
              Liên hệ mua hàng
            </h1>
            <p className="text-white/80 text-center mt-3 max-w-2xl mx-auto">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ mua hàng nhanh nhất
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section 
          className="py-12 md:py-16"
          aria-label="Thông tin liên hệ"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Card */}
                {(settings?.phone || footer?.phone || footer?.hotline) && (
                  <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">
                          Hotline hỗ trợ
                        </h2>
                        <a 
                          href={`tel:${(settings?.phone || footer?.phone || '').replace(/\s/g, '')}`}
                          className="text-xl font-bold text-primary hover:text-primary/80 transition-colors block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {settings?.phone || footer?.phone}
                        </a>
                        {footer?.hotline && footer.hotline !== footer.phone && (
                          <a 
                            href={`tel:${footer.hotline.replace(/\s/g, '')}`}
                            className="text-lg text-slate-600 hover:text-primary transition-colors block mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                          >
                            {footer.hotline}
                          </a>
                        )}
                        <p className="text-sm text-slate-500 mt-2">
                          Hỗ trợ 24/7 - Gọi ngay để được tư vấn
                        </p>
                      </div>
                    </div>
                  </article>
                )}

                {/* Email Card */}
                {(settings?.email || footer?.email) && (
                  <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Mail className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">
                          Email liên hệ
                        </h2>
                        <a 
                          href={`mailto:${settings?.email || footer?.email}`}
                          className="text-lg font-medium text-secondary hover:text-secondary/80 transition-colors block break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded"
                        >
                          {settings?.email || footer?.email}
                        </a>
                        <p className="text-sm text-slate-500 mt-2">
                          Gửi email để nhận báo giá chi tiết
                        </p>
                      </div>
                    </div>
                  </article>
                )}

                {/* Address Card */}
                {(settings?.address || footer?.address) && (
                  <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">
                          Địa chỉ
                        </h2>
                        <address className="text-base text-slate-600 not-italic leading-relaxed">
                          {settings?.address || footer?.address}
                        </address>
                        <p className="text-sm text-slate-500 mt-2">
                          Quý khách có thể đến trực tiếp để xem sản phẩm
                        </p>
                      </div>
                    </div>
                  </article>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeDataProvider>
  );
}
