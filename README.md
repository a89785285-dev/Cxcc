# BLOCK MASTER

لعبة ألغاز مكعبات مبنية بـ HTML5 وCSS3 وJavaScript. تم تجهيز تغليف Android باستخدام Capacitor مع الحفاظ على ملفات اللعبة وآلياتها دون إعادة تطويرها.

## بناء APK عبر GitHub (من الهاتف أو الحاسوب)

1. افتح تبويب **Actions** في المستودع.
2. اختر **Build Android APK**.
3. اضغط **Run workflow** وانتظر انتهاء البناء بنجاح.
4. افتح عملية البناء المكتملة، ثم نزّل **BLOCK-MASTER-APK** من قسم **Artifacts**.
5. فك ضغط الملف للحصول على `app-debug.apk` وانقله إلى هاتف Android.

## ملاحظات

- يتم توليد أيقونات Android وPWA تلقائياً من `resources/icon.svg` أثناء البناء.
- الناتج APK تجريبي من نوع debug للتثبيت والاختبار، وليس إصداراً جاهزاً للنشر على Google Play.
- لا يحتوي المستودع على APK مبني مسبقاً؛ يتم إنشاؤه بواسطة GitHub Actions.

## البناء المحلي للويب

```bash
npm install
npm run generate:icons
npm run build:web
```
