import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Clock, CheckCircle, XCircle, Calendar, AlertTriangle, Gift } from "lucide-react";

const scenarios = [
  {
    id: "sessions",
    title: "عرض الجلسات والطلبات",
    description: "شاهد جميع الجلسات المحجوزة والطلبات الواردة من 🌱 الباذرين",
    icon: Calendar,
    color: "from-bas10-teal to-bas10-purple",
    path: "/bostani/sessions",
  },
  {
    id: "regular-request",
    title: "طلب إعادة جدولة عادي",
    description: "استقبال ومراجعة طلب إعادة جدولة عادي (أكثر من ساعة)",
    icon: Clock,
    color: "from-blue-500 to-blue-600",
    path: "/bostani/sessions",
  },
  {
    id: "emergency-request",
    title: "طلب إعادة جدولة طارئ",
    description: "طلب عاجل (أقل من ساعة) - يحتاج موافقة سريعة خلال 15 دقيقة",
    icon: AlertTriangle,
    color: "from-red-500 to-orange-500",
    path: "/bostani/sessions",
  },
  {
    id: "welcome-session",
    title: "جلسة ترحيبية",
    description: "استشارة مجانية للمرة الأولى مع باذر جديد (10 دقائق)",
    icon: Gift,
    color: "from-bas10-cyan to-bas10-teal",
    path: "/bostani/sessions",
  },
];

export default function Bostani() {
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
            <h1 className="text-4xl md:text-5xl font-bold">🌿 شاشات البستاني</h1>
            <p className="text-xl text-white/90">BAS10</p>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              إدارة واستقبال طلبات إعادة الجدولة من 🌱 الباذرين، مع نظام موافقة سريع للطلبات الطارئة
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
                هذه الشاشات تعرض تجربة <strong>🌿 البستاني</strong> عند استقبال طلبات إعادة الجدولة
                من 🌱 الباذرين. كل سيناريو يوضح كيف يتعامل 🌿 البستاني مع أنواع الطلبات المختلفة:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="text-2xl mb-2">📋</div>
                  <h4 className="font-bold mb-2">طلب عادي</h4>
                  <p className="text-sm text-muted-foreground">
                    🌱 الباذر يطلب إعادة جدولة قبل ساعة - يمكنك الموافقة، الرفض، أو اقتراح موعد بديل
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-bold mb-2">طلب طارئ</h4>
                  <p className="text-sm text-muted-foreground">
                    طلب عاجل (أقل من ساعة) - يحتاج رد سريع خلال 15 دقيقة
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">السيناريوهات المتاحة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              استكشف كيف يستقبل ويراجع 🌿 البستاني الطلبات من 🌱 الباذرين
            </p>
            <Link href="/bostani/demo">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                🎬 المحاكاة التفاعلية
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
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
          <h3 className="text-2xl font-bold mb-6 text-center">الميزات الرئيسية للبستاني</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-bas10-teal">✨ إدارة الطلبات</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• استقبال طلبات إعادة الجدولة العادية والطارئة</li>
                <li>• الموافقة أو الرفض مع التبرير</li>
                <li>• اقتراح مواعيد بديلة من تقويمك</li>
                <li>• مهلة 15 دقيقة للرد على الطلبات الطارئة</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-bas10-purple">🎯 سياسات واضحة</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• عرض سبب الطلب من 🌱 الباذر</li>
                <li>• الموعد البديل المقترح من 🌱 الباذر</li>
                <li>• إشعارات فورية لـ 🌱 الباذر بالقرار</li>
                <li>• احتساب الجلسة في حالة عدم الرد على الطلب الطارئ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-teal-200">
          <h3 className="text-2xl font-bold mb-4 text-center">لماذا هذا النظام؟</h3>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              تم تصميم هذا النظام لتحقيق <strong>التوازن</strong> بين مرونة 🌱 الباذر وحقوق 🌿 البستاني.
              الطلبات العادية تمنح وقتاً كافياً للمراجعة، بينما الطلبات الطارئة تحتاج موافقة سريعة
              لضمان عدم إهدار وقت الطرفين.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-12">
        <div className="container max-w-6xl py-8 text-center text-muted-foreground">
          <p>مصمم بواسطة Manus AI • 2025</p>
          <p className="text-sm mt-2">
            نظام متطابق لتجربة 🌱 الباذر و 🌿 البستاني
          </p>
        </div>
      </div>
    </div>
  );
}
