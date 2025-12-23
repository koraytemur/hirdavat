# Belgian Hardware Store - Android APK Oluşturma Rehberi

Bu rehber, Belgian Hardware Store uygulamasının Android APK dosyasını nasıl oluşturacağınızı adım adım açıklar.

## 🚀 Yöntem 1: EAS Build (Önerilen - Bulut Tabanlı)

EAS Build, Expo'nun bulut tabanlı build hizmetidir. Bilgisayarınızda Android Studio kurmanıza gerek yoktur.

### Ön Gereksinimler
1. Expo hesabı oluşturun: https://expo.dev/signup
2. EAS CLI'yi yükleyin:
   ```bash
   npm install -g eas-cli
   ```

### Adımlar

1. **Expo hesabına giriş yapın:**
   ```bash
   cd frontend
   eas login
   ```

2. **Projeyi yapılandırın:**
   ```bash
   eas build:configure
   ```
   Bu komut sizden proje ID'si isteyecektir.

3. **Preview APK oluşturun (Test için):**
   ```bash
   eas build -p android --profile preview
   ```
   Bu işlem yaklaşık 10-20 dakika sürer. Tamamlandığında APK indirme linki verilecektir.

4. **Production AAB oluşturun (Play Store için):**
   ```bash
   eas build -p android --profile production
   ```

### Ücretsiz Plan Limitleri
- Ayda 30 build (Android + iOS toplam)
- Build sırası bekleme süresi değişebilir

---

## 🔧 Yöntem 2: Yerel Build (Android Studio Gerekli)

Bu yöntem için bilgisayarınızda Android Studio ve Java JDK kurulu olmalıdır.

### Ön Gereksinimler
1. Android Studio yükleyin: https://developer.android.com/studio
2. Java JDK 17 yükleyin
3. ANDROID_HOME ve JAVA_HOME ortam değişkenlerini ayarlayın

### Adımlar

1. **Expo prebuild çalıştırın:**
   ```bash
   cd frontend
   npx expo prebuild --platform android
   ```

2. **Android klasörüne gidin:**
   ```bash
   cd android
   ```

3. **APK oluşturun:**
   ```bash
   ./gradlew assembleRelease
   ```

4. **APK dosyasını bulun:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 📱 iOS Build Rehberi

### Gereksinimler
- Mac bilgisayar (zorunlu)
- Apple Developer hesabı ($99/yıl)
- Xcode yüklü

### EAS Build ile (Mac gerekmez):
```bash
eas build -p ios --profile preview
```
Bu komut iOS Simulator için .app dosyası oluşturur.

### Production Build için:
1. Apple Developer Program'a katılın
2. App Store Connect'te uygulama oluşturun
3. `eas build -p ios --profile production` çalıştırın

---

## 🔑 Önemli Notlar

### API URL Yapılandırması
APK oluşturmadan önce, `.env` dosyasında `EXPO_PUBLIC_BACKEND_URL` değişkenini production sunucu URL'niz ile güncelleyin:

```
EXPO_PUBLIC_BACKEND_URL=https://your-production-api.com
```

### İmzalama Anahtarı (Keystore)
EAS Build otomatik olarak keystore oluşturur. Production için kendi keystore'unuzu kullanmak isterseniz:

1. Keystore oluşturun:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. EAS'a yükleyin:
   ```bash
   eas credentials
   ```

---

## 📋 Build Profilleri

| Profil | Çıktı | Kullanım |
|--------|-------|----------|
| development | APK | Test/geliştirme |
| preview | APK | Internal test |
| production | AAB | Play Store |

---

## 🆘 Sorun Giderme

### Build başarısız olursa:
1. `npx expo doctor` çalıştırın
2. Hataları düzeltin
3. `rm -rf node_modules && yarn install`
4. Tekrar deneyin

### APK çok büyükse:
- `app.json`'da `"newArchEnabled": false` yapın
- Gereksiz asset'leri kaldırın

---

## 📞 Destek

Sorularınız için:
- Expo Docs: https://docs.expo.dev/build/introduction/
- Expo Discord: https://chat.expo.dev/
