import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, Link } from "wouter";
import { Calendar, Clock, AlertTriangle, Gift, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

const scenarios = [
  {
    id: "sessions",
    title: "عرض الجلسات",
    description: "شاشة قائمة الجلسات المحجوزة مع خيارات إعادة الجدولة",
    icon: Calendar,
    color: "from-bas10-teal to-bas10-purple",
    path: "/sessions",
  },
  {
    id: "regular-reschedule",
    title: "إعادة جدولة عادية",
    description: "إعادة جدولة جلسة قبل ساعة واحدة (الحالة العادية)",
    icon: Clock,
    color: "from-blue-500 to-blue-600",
    path: "/sessions",
  },
  {
    id: "emergency-reschedule",
    title: "إعادة جدولة طارئة",
    description: "إعادة جدولة أقل من ساعة - تتطلب موافقة 🌿 البستاني",
    icon: AlertTriangle,
    color: "from-orange-500 to-orange-600",
    path: "/sessions",
  },
  {
    id: "welcome-session",
    title: "الجلسة الترحيبية",
    description: "جلسة مجانية 10 دقائق لمرة واحدة خلال 7 أيام",
    icon: Gift,
    color: "from-bas10-teal to-bas10-cyan",
    path: "/sessions",
  },
  {
    id: "approval-success",
    title: "موافقة 🌿 البستاني",
    description: "سيناريو موافقة 🌿 البستاني على إعادة الجدولة الطارئة",
    icon: CheckCircle,
    color: "from-bas10-teal to-teal-600",
    path: "/sessions",
  },
  {
    id: "approval-rejected",
    title: "رفض 🌿 البستاني",
    description: "سيناريو رفض 🌿 البستاني لإعادة الجدولة الطارئة",
    icon: XCircle,
    color: "from-red-500 to-red-600",
    path: "/sessions",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-bas10-teal to-bas10-purple text-white">
        <div className="container max-w-6xl py-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للاختيار
            </Button>
          </Link>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src="/images/logo.svg"
                alt="BAS10 Logo"
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">🌱 شاشات إعادة الجدولة - الباذر</h1>
            <p className="text-xl text-white/90">BAS10</p>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              استكشف جميع سيناريوهات إعادة جدولة الجلسات الاستشارية، من الحالات العادية إلى الطارئة،
              مع تطبيق أفضل الممارسات العالمية في تجربة المستخدم
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl py-12">
        {/* Introduction */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-teal-200 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-center">كيف تستخدم هذه الشاشات؟</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-lg">
              <p className="leading-relaxed">
                عندما تضغط على <strong>"عرض الجلسات"</strong>، ستجد <strong>3 جلسات مختلفة</strong>. 
                كل جلسة تمثل <strong>حالة مختلفة</strong> لتوضيح كيف يعمل نظام إعادة الجدولة:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border-2 border-teal-200">
                  <div className="text-2xl mb-2">📅</div>
                  <h4 className="font-bold mb-2">مهند الفارس</h4>
                  <p className="text-sm text-muted-foreground">جلسة عادية - باقي ساعة</p>
                  <p className="text-xs mt-2 text-teal-700">✅ إعادة جدولة مباشرة</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-cyan-200">
                  <div className="text-2xl mb-2">🎁</div>
                  <h4 className="font-bold mb-2">سارة أحمد</h4>
                  <p className="text-sm text-muted-foreground">جلسة ترحيبية مجانية</p>
                  <p className="text-xs mt-2 text-orange-700">⚠️ مرة واحدة فقط</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                  <div className="text-2xl mb-2">⏳</div>
                  <h4 className="font-bold mb-2">أحمد علي</h4>
                  <p className="text-sm text-muted-foreground">طلب طارئ - بانتظار الرد</p>
                  <p className="text-xs mt-2 text-teal-700">🔄 يحتاج موافقة</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">السيناريوهات المتاحة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              تم تصميم هذه الشاشات بناءً على بحث عميق في أفضل الممارسات العالمية والعربية
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-gradient-to-r from-bas10-teal to-bas10-purple hover:from-bas10-purple hover:to-bas10-teal text-white">
                🎬 المحاكاة التفاعلية
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <Card
                key={scenario.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-teal-200"
                onClick={() => setLocation(scenario.path)}
              >
                <div className={`bg-gradient-to-r ${scenario.color} p-6 text-white`}>
                  <Icon className="h-12 w-12 mb-3" />
                  <h3 className="text-xl font-bold">{scenario.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {scenario.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-teal-50 group-hover:border-teal-300"
                  >
                    عرض السيناريو
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-teal-100">
          <h3 className="text-2xl font-bold mb-6 text-center">الميزات الرئيسية</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-bas10-teal">✨ تجربة مستخدم محسّنة</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• دعم كامل للغة العربية مع RTL</li>
                <li>• تصميم عصري بألوان BAS10 الرسمية (Teal & Purple)</li>
                <li>• واجهة سهلة وواضحة</li>
                <li>• رسوم متحركة سلسة</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-bas10-purple">🎯 سياسات واضحة</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• مهلة ساعة واحدة للإعادة العادية</li>
                <li>• نظام موافقة للحالات الطارئة</li>
                <li>• جلسة ترحيبية مجانية للمستخدمين الجدد</li>
                <li>• إشعارات فورية للطرفين</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Research Summary */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-teal-200">
          <h3 className="text-2xl font-bold mb-4 text-center">نتائج البحث</h3>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              بعد دراسة معمّقة لأفضل الممارسات في تطبيقات الاستشارات العالمية والعربية، تم تصميم
              هذه الشاشات لتوفر <strong>مرونة عالية</strong> (مهلة ساعة واحدة) مع الحفاظ على
              <strong> حقوق 🌿 البستانيين</strong> من خلال نظام الموافقة في الحالات الطارئة.
            </p>
            <p className="leading-relaxed">
              التصميم يجمع بين <strong>سهولة الاستخدام</strong> و<strong>الوضوح التام</strong> في
              السياسات، مع إضافة ميزات فريدة مثل الجلسة الترحيبية المجانية لتشجيع المستخدمين الجدد
              على تجربة المنصة.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-12">
        <div className="container max-w-6xl py-8 text-center text-muted-foreground">
          <p>مصمم بواسطة Manus AI • 2025</p>
          <p className="text-sm mt-2">
            بناءً على أفضل الممارسات من BetterHelp، Talkspace، شيزلونج، لبيه، وZocdoc
          </p>
        </div>
      </div>
    </div>
  );
}
