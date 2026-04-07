# 📧 EmailJS Kurulumu - Mesaj Gönderimi

Sitede "Bize Ulaşın" formundan gelen mesajlar automatikman **onninsaat9@gmail.com** adresine gönderilir.

## ✅ Kurulum Adımları

### 1. EmailJS Hesabı Oluşturun
- https://www.emailjs.com adresine gidin
- **Sign Up** butonuna tıklayın
- Gmail veya diğer email adresinizle kayıt olun
- Email adresinizi verify edin (onay e-postası gelecektir)

### 2. Email Service Bağlayın
- Dashboard'a giriş yapın
- **Email Services** bölümüne gidin
- **Add New Service** tıklayın
- **Gmail** seçin
- Kendi Gmail hesabınızı bağlayın (*onninsaat9@gmail.com* gibi)

### 3. Template Oluşturun
- **Email Templates** bölümüne gidin
- **Create New Template** tıklayın
- Template adı: `contact_form_template`
- Aşağıdaki parametreleri ekleyin:

```
ONN İnşaat - Yeni Mesaj

Gönderici: {{from_name}} ({{from_email}})
Telefon: {{phone}}

---

{{message}}

---

Cevap gönder: {{reply_to}}
```

### 4. Credentials Alın
- Dashboard'da **Account** > **API** bölümüne gidin
- Aşağıdaki bilgileri kopyalayın:
  - **Public Key**
  - **Service ID**
  - **Template ID** (Create ettiğiniz template'in ID'si)

### 5. .env.local Dosyasını Güncelleyin

Proje root'unda `.env.local` dosyasını açın ve aşağıdaki satırları düzenleyin:

```env
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID_HERE
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
VITE_CONTACT_EMAIL=onninsaat9@gmail.com
```

**Örnek:**
```env
VITE_EMAILJS_PUBLIC_KEY=abc123def456xyz
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_CONTACT_EMAIL=onninsaat9@gmail.com
```

### 6. Sunucuyu Yeniden Başlatın
- Terminal'de **Ctrl+C** ile dev sunucuyu durdurun
- `npm run dev` ile yeniden başlatın

## 🧪 Test Etme

1. Siteye gidin
2. "Bize Ulaşın" sekmesine tıklayın
3. Formu doldurun ve gönder!
4. Aşağıdakiler gerçekleşmelidir:
   - ✅ Mesaj Firebase'e kaydedilir (Admin Panel'de görünür)
   - ✅ **onninsaat9@gmail.com** adresine bildirim emaili gelir
   - ✅ Gönderenin emailine teşekkür mesajı gelir

## ⚠️ Sorun Giderme

### E-mail gelmiyor?
- EmailJS dashboard'ında tüm credential'ları kontrol edin
- Template ID'nin doğru olduğundan emin olun
- `import.meta.env.VITE_EMAILJS_PUBLIC_KEY` vs kontrol etmek için browser console'u açın

### "Access Denied" hatası?
- Gmail hesabında 2FA aktifse, **App Password** oluşturun:
  - Google Account > Security > App Passwords
  - EmailJS'de bu password'ü kullanın

### .env.local dosyası nerede?
```
app/
├── .env.local          ← Buraya
├── src/
├── public/
└── package.json
```

## 🔐 Güvenlik Notları

- `.env.local` dosyasını **ASLA** Git'e commit etmeyin
- `.gitignore`'da zaten `.env.local` var (kontrol edin)
- Public Key dışında tüm credential'lar gizli tutulmalıdır

## 📝 Yapılandırma Dosyası

EmailJS yapılandırması:
- **Dosya**: `src/lib/emailConfig.ts`
- Buradan hataları debug edebilirsiniz

## ✨ İleriye Dönük

- Mesaj sayısı arttığında, EmailJS'in **Free Tier** limitini kontrol edin (aylık 200 email)
- Sınıra ulaşırsanız, ücretli tier'a geçin veya Sendgrid, Mailgun kullanın
