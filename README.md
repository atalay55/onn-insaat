# ONN İnşaat - Website

Modern inşaat şirketi websitesi. React, TypeScript, Firebase, ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Başlangıç

### Kurulum
```bash
npm install
npm run dev
```

### Konfigürasyon

#### Firebase Setup
1. `.env.local` dosyasında Firebase credentials'ını kontrol edin
2. Projesi oluşturmak için `src/config/firebase.ts` referans alın

#### Email Gönderimi (İsteğe Bağlı)
"Bize Ulaşın" formundan **onninsaat9@gmail.com** adresine email göndermek için:

📄 **[EMAILJS_SETUP.md](./EMAILJS_SETUP.md)** dosyasını okuyun

## 📁 Proje Yapısı

```
src/
├── pages/              # Sayfa bileşenleri
│   ├── AdminPanel.tsx  # Admin yönetim paneli
│   ├── Eskizler.tsx    # Proje eskizleri
│   └── ProjectDetail.tsx
├── components/         # Yeniden kullanılabilir bileşenler
├── services/           # Firebase ve diğer servisler
│   ├── adminService.ts # Admin işlemleri
│   └── sketchService.ts # Eskiz yönetimi
├── config/
│   └── firebase.ts     # Firebase konfigürasyonu
└── context/
    └── AuthContext.tsx # Kimlik doğrulama
```

## 🔑 Environment Variables

`.env.local` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Admin
VITE_ADMIN_EMAIL=onninsaat9@gmail.com

# Email (İsteğe bağlı)
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_CONTACT_EMAIL=onninsaat9@gmail.com
```

## ✨ Özellikler

- ✅ Dinamik proje galerisi
- ✅ Proje detayları sayfası
- ✅ Eskiz yönetimi (Firebase)
- ✅ Admin paneli (Projeler, Mesajlar, Eskizler)
- ✅ İletişim formu (Email + Firebase)
- ✅ Responsive design
- ✅ Dark theme

## 🛠 Teknolojiler

- React 18 + TypeScript
- Vite
- Firebase (Firestore, Authentication)
- Tailwind CSS
- shadcn/ui
- Lucide React (İkonlar)

## 📦 Build

```bash
npm run build
```

## 📝 Lisans

ONN İnşaat © 2024
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
