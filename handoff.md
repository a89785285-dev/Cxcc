# BLOCK MASTER — handoff.md

## الهدف
إزالة Capacitor من تطبيق Android ونقل BLOCK MASTER إلى تطبيق Android أصلي باستخدام Kotlin وAndroid Canvas، مع الحفاظ على أساسيات اللعبة: شبكة 8×8، ثلاث قطع لكل مجموعة، السحب والإفلات، النقاط، ومسح الصفوف والأعمدة.

## أين وصلت
- تم إنشاء فرع مستقل: `migration/native-android-kotlin` انطلاقاً من `main`.
- تمت إضافة هيكل Android Native باستخدام Kotlin وGradle.
- تمت إضافة شاشة لعب أصلية ترسم اللوحة والقطع مباشرة عبر Android Canvas، دون WebView أو Capacitor.
- تمت إزالة اعتماديات Capacitor من `package.json` وإزالة ملف الإعداد الخاص به.
- تم إعداد GitHub Actions لبناء APK أصلي ورفعه كـ Artifact.
- بقي تشغيل البناء واختبار APK على هاتف فعلي؛ لا يوجد APK ناجح مؤكد حتى الآن.
- واجهة Android الأصلية الحالية إعادة تنفيذ أولية للعب وليست مطابقة بكسلياً لواجهة HTML الأصلية بعد.
- نسخة الويب/PWA الأصلية محفوظة مستقلة داخل المستودع.

## الملفات التي تعمل عليها
- `settings.gradle.kts`: إعداد مشروع Gradle.
- `build.gradle.kts`: إصدارات Android Gradle Plugin وKotlin.
- `app/build.gradle.kts`: إعداد تطبيق Android.
- `app/src/main/AndroidManifest.xml`: تعريف التطبيق والنشاط الرئيسي.
- `app/src/main/java/com/blockmaster/game/MainActivity.kt`: نقطة دخول Android.
- `app/src/main/java/com/blockmaster/game/BlockMasterView.kt`: رسم اللعبة والتفاعل باللمس ومنطق اللوحة 8×8.
- `.github/workflows/android.yml`: بناء APK أصلي بواسطة GitHub Actions.
- `package.json`: إزالة اعتماديات Capacitor مع إبقاء بناء PWA.
- `README.md`: تعليمات بناء APK الأصلي.
- `handoff.md`: حالة النقل والاختبارات المتبقية.

## التعديلات التي صارت
1. استبدال تغليف Capacitor بمشروع Android Native بلغة Kotlin.
2. استخدام Android Canvas للرسم بدلاً من HTML DOM داخل WebView.
3. تنفيذ شبكة 8×8، وقطع بأشكال متعددة، وثلاث قطع لكل مجموعة.
4. تنفيذ سحب القطع باللمس ووضعها على اللوحة مع رفض التداخل والخروج عن الحدود.
5. تنفيذ النقاط ومسح الصفوف والأعمدة المكتملة.
6. حفظ أفضل نتيجة محلياً عبر SharedPreferences.
7. إضافة GitHub Actions لبناء `app-debug.apk` من دون Android Studio.
8. إبقاء نسخة الويب/PWA الحالية مستقلة وعدم حذف ملفاتها.
9. إزالة حزم Capacitor وملف `capacitor.config.json` من فرع النقل.

## المحاولات التي فشلت
- محاولة إنشاء/تحديث عدة ملفات GitHub في عملية متزامنة واحدة أعادت خطأ API لبعض المسارات الموجودة؛ تم التحقق من الملفات ثم إعادة ترتيب عمليات التحديث.
- لم تُشغّل عملية بناء Gradle بعد، لذلك لا توجد نتيجة فشل/نجاح للبناء لتوثيقها.

## الاختبارات

### تم
- مراجعة بنية المستودع الحالي وملفات اللعبة قبل النقل.
- إنشاء مشروع Android Native مستقل عن WebView وCapacitor.
- إعداد مصدر بناء APK أصلي على GitHub Actions.

### لم يتم بعد
- تشغيل GitHub Actions والتأكد من نجاح Gradle.
- تثبيت APK على هاتف Android.
- اختبار السحب والإفلات وحالات حدود اللوحة.
- اختبار مسح صف وعمود في الحركة نفسها.
- قياس FPS واستهلاك الذاكرة على الهاتف.
- مطابقة تفاصيل الواجهة الأصلية وأحجام القطع بدقة.

## الخطوة القادمة
1. تشغيل Actions من فرع `migration/native-android-kotlin`.
2. إصلاح أي أخطاء Gradle أو Kotlin تظهر في سجل البناء.
3. تنزيل APK واختبار اللعبة على الهاتف.
4. تحسين مطابقة الواجهة الأصلية بعد التحقق من الأداء.
5. عدم دمج التغيير إلى `main` قبل نجاح البناء والاختبار.
