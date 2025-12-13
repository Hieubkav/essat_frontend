import { Product, NewsItem, Partner } from './types';

export const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '#' },
  {
    label: 'Sản phẩm',
    href: '#',
    children: [
      { label: 'Thiết bị hội nghị truyền hình', href: '#' },
      { label: 'Thiết bị âm thanh', href: '#' },
      { label: 'Thiết bị tường lửa', href: '#' },
      { label: 'Thiết bị máy chủ', href: '#' },
    ]
  },
  { label: 'Tin tức', href: '#' },
  {
    label: 'Chính sách',
    href: '#',
    children: [
      { label: 'Chính sách bảo hành', href: '#' },
      { label: 'Chính sách đổi trả', href: '#' },
      { label: 'Chính sách vận chuyển', href: '#' },
      { label: 'Chính sách bảo mật', href: '#' },
    ]
  },
  { label: 'Liên hệ', href: '#' },
];

export const FEATURES = [
  {
    title: 'Phân Phối Chính Hãng',
    description: 'Thiết bị hội nghị, âm thanh, máy chiếu top đầu thị trường.',
  },
  {
    title: 'Hỗ Trợ Kỹ Thuật 24/7',
    description: 'Đội ngũ chuyên môn cao, bảo hành và hỗ trợ trọn đời.',
  },
  {
    title: 'Giải Pháp Toàn Diện',
    description: 'Tư vấn tích hợp hệ thống tối ưu, không chỉ bán thiết bị.',
  },
  {
    title: 'Tiên Phong Công Nghệ',
    description: 'Luôn cập nhật thiết bị và xu hướng mới nhất thế giới.',
  },
];

export const STATS = [
  { value: '1,500+', label: 'Khách hàng tin dùng' },
  { value: '25+', label: 'Đối tác chiến lược' },
  { value: '100+', label: 'Sản phẩm chính hãng' },
  { value: '20', label: 'Tỉnh thành phân phối' },
];

export const CATEGORIES = [
  {
    id: 1,
    label: 'Hội nghị truyền hình',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    label: 'Thiết bị âm thanh',
    image: 'https://images.unsplash.com/photo-1590660046028-edc1010d84d4?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    label: 'Thiết bị tường lửa',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 4,
    label: 'Thiết bị trình chiếu',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 5,
    label: 'Thiết bị mạng',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 6,
    label: 'Thiết bị máy chủ',
    image: 'https://images.unsplash.com/photo-1558494949-ef010dbacc31?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 7,
    label: 'Thiết bị lưu điện',
    image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 8,
    label: 'Màn hình chuyên dụng',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de8db98?auto=format&fit=crop&w=300&q=80'
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Máy chủ Dell PowerEdge R260',
    category: 'Máy chủ Server',
    price: 25000000,
    originalPrice: 28000000,
    discount: 10,
    image: 'https://picsum.photos/400/400?random=1',
    isNew: true
  },
  {
    id: 2,
    name: 'Bàn xoay kiếng 30cm (HV)',
    category: 'Dụng cụ',
    price: 298000,
    image: 'https://picsum.photos/400/400?random=2',
  },
  {
    id: 3,
    name: 'Bàn Xoay Gang - Xi bóng',
    category: 'Thiết bị',
    price: 356000,
    originalPrice: 400000,
    discount: 12,
    image: 'https://picsum.photos/400/400?random=3',
  },
  {
    id: 4,
    name: 'Thùng Xốp Cách Nhiệt 5cm',
    category: 'Vật tư',
    price: 0,
    image: 'https://picsum.photos/400/400?random=4',
  },
];

export const NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Triển lãm Food & Hotel Việt Nam 2025 – Cơ hội kết nối ngành',
    excerpt: 'ESAT tham gia triển lãm với gian hàng trưng bày các giải pháp công nghệ mới nhất cho ngành F&B.',
    date: '31/05/2025',
    image: 'https://picsum.photos/600/400?random=10',
    author: 'Admin'
  },
  {
    id: 2,
    title: 'Rich\'s và Vũ Phúc Baking đóng góp bánh cưới tập thể',
    excerpt: 'Hoạt động thiện nguyện đầy ý nghĩa với sự đồng hành của các đối tác lớn.',
    date: '30/05/2025',
    image: 'https://picsum.photos/600/400?random=11',
    author: 'Editorial'
  },
  {
    id: 3,
    title: 'Gặp gỡ, kết nối cung cầu ngành bánh tại Miền Tây',
    excerpt: 'Sự kiện thu hút hơn 500 doanh nghiệp và cá nhân tham gia giao lưu.',
    date: '28/05/2025',
    image: 'https://picsum.photos/600/400?random=12',
    author: 'Admin'
  }
];

export const PARTNERS: Partner[] = [
  { id: 1, name: 'Dell', logo: 'https://picsum.photos/200/100?random=20' },
  { id: 2, name: 'ADG', logo: 'https://picsum.photos/200/100?random=21' },
  { id: 3, name: 'Richs', logo: 'https://picsum.photos/200/100?random=22' },
  { id: 4, name: 'Mauri', logo: 'https://picsum.photos/200/100?random=23' },
  { id: 5, name: 'VCCI', logo: 'https://picsum.photos/200/100?random=24' },
];
