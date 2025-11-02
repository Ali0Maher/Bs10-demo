import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, RotateCcw, Home } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import EmergencyRescheduleDialog from "@/components/EmergencyRescheduleDialog";

// أنواع السيناريوهات
type ScenarioType = "A" | "B" | "C" | "D";

// خطوات كل سيناريو
interface Step {
  id: number;
  title: string;
  description: string;
  screen: React.ReactNode;
  notification?: {
    type: "success" | "warning" | "error" | "info";
    message: string;
  };
}

export default function InteractiveDemo() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  // السيناريوهات المتاحة
  const scenarios = [
    {
      id: "A" as ScenarioType,
      title: "إعادة جدولة عادية",
      subtitle: "قبل ساعة أو أكثر",
      icon: "🌱",
      color: "from-green-500 to-emerald-600",
      description: "إعادة جدولة مباشرة بدون موافقة البستاني",
    },
    {
      id: "B" as ScenarioType,
      title: "إعادة جدولة طارئة",
      subtitle: "أقل من ساعة",
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      description: "تتطلب موافقة البستاني - حالتان: موافقة أو رفض",
    },
    {
      id: "C" as ScenarioType,
      title: "الجلسة الترحيبية",
      subtitle: "10 دقائق مجانية",
      icon: "🎁",
      color: "from-purple-500 to-pink-600",
      description: "جلسة مجانية - إعادة جدولة مرة واحدة فقط",
    },
    {
      id: "D" as ScenarioType,
      title: "البستاني يعتذر",
      subtitle: "اقتراح بديل أو استرداد",
      icon: "🌿",
      color: "from-blue-500 to-cyan-600",
      description: "البستاني يقترح مواعيد بديلة أو يسترد المبلغ",
    },
  ];

  // خطوات السيناريو A
  const stepsA: Step[] = [
    {
      id: 1,
      title: "بطاقة الجلسة",
      description: "عرض الجلسة في صفحة بذوري - باقي ساعة",
      screen: (
        <Card className="p-6 border-2">
          <div className="flex items-start gap-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Muhannad"
              alt="مهند الفارس"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">مهند الفارس</h3>
              <p className="text-sm text-muted-foreground">المحتوى العربي</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">📅 اليوم 12:00 ص - 12:10 ص</span>
              </div>
              <Badge className="mt-2 bg-orange-100 text-orange-700 border-orange-300">
                🟠 باقي ساعة
              </Badge>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1);
                    toast.info("فتح شاشة إعادة الجدولة...");
                  }}
                >
                  🕓 إعادة الجدولة
                </Button>
                <Button size="sm" variant="outline">
                  💬 تفاصيل
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 2,
      title: "شاشة إعادة الجدولة",
      description: "اختيار موعد جديد",
      screen: (
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">إعادة جدولة بذرة</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">مع</label>
              <p className="text-lg">مهند الفارس</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اختر اليوم</label>
              <div className="flex gap-2">
                {["اليوم 5/24", "غدًا 5/25", "بعد غد 5/26"].map((day, i) => (
                  <Button
                    key={i}
                    variant={i === 1 ? "default" : "outline"}
                    className="rounded-full"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اختر الوقت</label>
              <div className="grid grid-cols-2 gap-2">
                {["10:00 ص - 10:10 ص", "11:00 ص - 11:10 ص", "2:00 م - 2:10 م", "3:00 م - 3:10 م"].map(
                  (time, i) => (
                    <Button
                      key={i}
                      variant={i === 0 ? "default" : "outline"}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {time}
                    </Button>
                  )
                )}
              </div>
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setCurrentStep(2);
                toast.success("تمت إعادة جدولة الجلسة بنجاح ✓");
              }}
            >
              إعادة جدولة
            </Button>
          </div>
        </Card>
      ),
      notification: {
        type: "success",
        message: "تمت إعادة جدولة جلستك مع مهند الفارس إلى يوم 25 مايو، الساعة 10:00 ص",
      },
    },
    {
      id: 3,
      title: "تأكيد النجاح",
      description: "تم تحديث الجلسة بالموعد الجديد",
      screen: (
        <Card className="p-6 border-2 border-green-500 bg-green-50">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تمت إعادة الجدولة بنجاح!</h3>
            <p className="text-muted-foreground mb-4">
              تمت إعادة جدولة جلستك مع مهند الفارس إلى:
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-bold">📅 يوم 25 مايو</p>
              <p className="font-bold">⏰ الساعة 10:00 ص - 10:10 ص</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-blue-700">
                📢 تم إرسال إشعار للبستاني بالموعد الجديد
              </p>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  // خطوات السيناريو B (موافقة)
  const stepsB: Step[] = [
    {
      id: 1,
      title: "بطاقة الجلسة",
      description: "باقي 30 دقيقة فقط - تحتاج موافقة",
      screen: (
        <Card className="p-6 border-2 border-red-300">
          <div className="flex items-start gap-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
              alt="أحمد علي"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">أحمد علي</h3>
              <p className="text-sm text-muted-foreground">تطوير الأعمال</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">📅 اليوم 11:45 ص - 11:55 ص</span>
              </div>
              <Badge className="mt-2 bg-red-100 text-red-700 border-red-300">
                🔴 باقي 30 دقيقة
              </Badge>
              <div className="mt-2 bg-orange-50 p-2 rounded text-xs text-orange-700">
                ⚠️ إعادة الجدولة الآن تتطلب موافقة البستاني
              </div>
              <Button
                size="sm"
                className="mt-4 bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setCurrentStep(1);
                  toast.warning("فتح طلب إعادة جدولة طارئ...");
                }}
              >
                🕓 إعادة الجدولة
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 2,
      title: "طلب طارئ",
      description: "إرسال طلب للبستاني",
      screen: (
        <Card className="p-6 border-2 border-orange-500">
          <div className="text-center p-8">
            <p className="text-lg mb-4">اضغط على الزر لفتح نموذج إعادة الجدولة الطارئة</p>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowEmergencyDialog(true)}
            >
              🔥 فتح طلب إعادة جدولة طارئ
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: 3,
      title: "بانتظار الموافقة",
      description: "الانتظار حتى يرد البستاني",
      screen: (
        <Card className="p-6 border-2 border-purple-300">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h3 className="text-xl font-bold mb-2">بانتظار موافقة البستاني</h3>
            <p className="text-muted-foreground mb-4">
              تم إرسال طلب إعادة الجدولة إلى أحمد علي
            </p>
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700">
                سيتم إشعارك فور الموافقة أو الرفض
              </p>
              <p className="text-2xl font-bold mt-2 text-purple-900">12:30</p>
              <p className="text-xs text-purple-600">الوقت المتبقي للرد</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("تم إلغاء الطلب")}
            >
              إلغاء الطلب
            </Button>
            <div className="mt-6 flex gap-2 justify-center">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  setCurrentStep(3);
                  toast.success("وافق أحمد علي على طلب إعادة الجدولة!");
                }}
              >
                ✅ محاكاة: موافقة
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setCurrentStep(4);
                  toast.error("اعتذر أحمد علي عن إعادة الجدولة");
                }}
              >
                ❌ محاكاة: رفض
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 4,
      title: "تمت الموافقة",
      description: "تم تأكيد الموعد الذي اخترته مسبقاً",
      screen: (
        <Card className="p-6 border-2 border-green-500 bg-green-50">
          <div className="text-center mb-4">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تمت الموافقة!</h3>
            <p className="text-muted-foreground">
              وافق أحمد علي على طلب إعادة الجدولة
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-xs text-green-700 mb-2 text-center">الموعد الجديد المؤكد:</p>
            <p className="text-base font-bold text-green-900 text-center">
              📅 بعد ساعة من الآن
            </p>
            <p className="text-sm text-green-800 text-center">
              🕐 12:45 ص • 10 دقائق
            </p>
            <p className="text-xs text-green-700 text-center mt-2">
              ℹ️ تم تأكيد الموعد الذي اخترته مسبقاً
            </p>
          </div>
          <Button className="w-full bg-green-500 hover:bg-green-600">
            حسناً
          </Button>
        </Card>
      ),
      notification: {
        type: "success",
        message: "تمت إعادة جدولة الجلسة بنجاح",
      },
    },
    {
      id: 5,
      title: "تم الرفض",
      description: "البستاني رفض - الجلسة تُحسب كأنها انعقدت",
      screen: (
        <Card className="p-6 border-2 border-red-500 bg-red-50">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold mb-2">لم تتم الموافقة على إعادة الجدولة</h3>
            <p className="text-muted-foreground mb-4">
              اعتذر البستاني عن إعادة جدولة الجلسة
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ ستُحسب الجلسة كأنها انعقدت وفقًا لسياسة التطبيق
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-sm mb-4">
              <p className="text-blue-700">
                💡 يمكنك التواصل مع البستاني عبر الرسائل لترتيب جلسة جديدة
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                حسنًا
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                💬 مراسلة البستاني
              </Button>
            </div>
          </div>
        </Card>
      ),
      notification: {
        type: "error",
        message: "لم تتم الموافقة على إعادة الجدولة - الجلسة تُحسب كأنها انعقدت",
      },
    },
  ];

  // خطوات السيناريو C
  const stepsC: Step[] = [
    {
      id: 1,
      title: "Banner الترحيب",
      description: "عرض الجلسة الترحيبية المجانية",
      screen: (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎁</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">لديك جلسة ترحيبية مجانية!</h3>
                <p className="text-sm text-muted-foreground">
                  10 دقائق مجانية - صالحة حتى 7 أيام من التسجيل
                </p>
              </div>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  setCurrentStep(1);
                  toast.info("فتح شاشة الحجز...");
                }}
              >
                احجز الآن
              </Button>
            </div>
          </Card>
          <Card className="p-6 border-2">
            <div className="flex items-start gap-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara"
                alt="سارة أحمد"
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">سارة أحمد</h3>
                <p className="text-sm text-muted-foreground">استشارة ترحيبية</p>
                <Badge className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  🎁 جلسة ترحيبية مجانية
                </Badge>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span>📅 غدًا 3:00 م - 3:10 م</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  ⏰ صلاحية الجلسة: 4 أيام
                </div>
                <div className="mt-2 bg-green-50 p-2 rounded text-xs text-green-700">
                  💡 يمكنك إعادة جدولتها <strong>مرة واحدة فقط</strong> خلال 4 أيام
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCurrentStep(2);
                    toast.info("فتح شاشة إعادة الجدولة...");
                  }}
                >
                  🕓 إعادة الجدولة
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 2,
      title: "تحذير خاص",
      description: "تنبيه بقيود الجلسة الترحيبية",
      screen: (
        <Card className="p-6 border-2 border-green-500">
          <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-300">
            <div className="flex items-start gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="font-bold text-green-900">إعادة جدولة الجلسة الترحيبية</h3>
                <p className="text-sm text-green-700 mt-2">
                  هذه جلستك الترحيبية المجانية (10 دقائق)
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-green-800">
                    <strong>⚠️ ملاحظات مهمة:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>يمكنك إعادة جدولتها <strong>مرة واحدة فقط</strong></li>
                    <li>يجب استخدامها خلال <strong>4 أيام</strong> من الآن</li>
                    <li>في حالة عدم الحضور، لن تتمكن من الحصول على جلسة بديلة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              إلغاء
            </Button>
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => {
                setCurrentStep(3);
                toast.info("فتح اختيار الموعد...");
              }}
            >
              متابعة إعادة الجدولة
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: 3,
      title: "اختيار موعد جديد",
      description: "المدة ثابتة 10 دقائق - الأيام محدودة",
      screen: (
        <Card className="p-6 border-2">
          <div className="bg-green-100 p-3 rounded-lg mb-4 text-sm text-green-800">
            🎁 جلسة ترحيبية - إعادة جدولة واحدة فقط
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اختر اليوم</label>
              <div className="flex gap-2">
                {["اليوم", "غدًا", "بعد غد", "بعد 3 أيام"].map((day, i) => (
                  <Button
                    key={i}
                    variant={i === 2 ? "default" : "outline"}
                    className="rounded-full text-xs"
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-2">
                ⚠️ يجب اختيار موعد خلال 4 أيام من الآن
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اختر الوقت</label>
              <div className="grid grid-cols-2 gap-2">
                {["5:00 م - 5:10 م", "6:00 م - 6:10 م"].map((time, i) => (
                  <Button
                    key={i}
                    variant={i === 0 ? "default" : "outline"}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <label className="text-sm font-medium">المدة</label>
              <p className="text-lg font-bold">10 دقائق</p>
              <p className="text-xs text-muted-foreground">ثابتة - غير قابلة للتعديل</p>
            </div>
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => {
                setCurrentStep(4);
                toast.success("تم إعادة جدولة جلستك الترحيبية ✓");
                setTimeout(() => {
                  toast.warning("⚠️ تذكّر: لا يمكن إعادة جدولة هذه الجلسة مرة أخرى");
                }, 2000);
              }}
            >
              إعادة جدولة
            </Button>
          </div>
        </Card>
      ),
      notification: {
        type: "success",
        message: "تم إعادة جدولة جلستك الترحيبية إلى بعد غد 5:00 م",
      },
    },
    {
      id: 4,
      title: "تأكيد مع تحذير",
      description: "تم التحديث - لا يمكن إعادة الجدولة مرة أخرى",
      screen: (
        <Card className="p-6 border-2 border-green-500 bg-green-50">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تمت إعادة الجدولة بنجاح!</h3>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-bold">🎁 جلستك الترحيبية المجانية</p>
              <p className="text-lg font-bold mt-2">📅 بعد غد</p>
              <p className="text-lg font-bold">⏰ 5:00 م - 5:10 م</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-sm border-2 border-orange-300">
              <p className="text-orange-800 font-medium">
                ⚠️ <strong>تذكّر:</strong> لا يمكن إعادة جدولة هذه الجلسة مرة أخرى
              </p>
            </div>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => {
                setCurrentStep(5);
                toast.info("محاكاة محاولة إعادة الجدولة مرة أخرى...");
              }}
            >
              محاكاة: محاولة إعادة الجدولة مرة أخرى
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: 5,
      title: "محاولة ثانية (محظورة)",
      description: "لا يمكن إعادة الجدولة - استُخدمت الفرصة",
      screen: (
        <Card className="p-6 border-2 border-red-500 bg-red-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-xl font-bold mb-2">لا يمكن إعادة الجدولة</h3>
            <p className="text-muted-foreground mb-4">
              لقد استخدمت فرصة إعادة الجدولة الوحيدة للجلسة الترحيبية
            </p>
            <div className="bg-white rounded-lg p-4 mb-4 text-sm text-right">
              <p className="mb-2">إذا لم تتمكن من الحضور في الموعد الحالي، يمكنك:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>إلغاء الجلسة (ستفقد الجلسة الترحيبية)</li>
                <li>حجز جلسة مدفوعة جديدة</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                حسنًا
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                💰 حجز جلسة مدفوعة
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  // خطوات السيناريو D
  const stepsD: Step[] = [
    {
      id: 1,
      title: "البستاني يعتذر",
      description: "البستاني يطلب إعادة الجدولة",
      screen: (
        <Card className="p-6 border-2 border-blue-300">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">📢</span>
              <div>
                <h3 className="font-bold text-blue-900">إشعار جديد</h3>
                <p className="text-sm text-blue-700 mt-1">
                  طلب خالد محمد إعادة جدولة الجلسة
                </p>
              </div>
            </div>
          </div>
          <Card className="p-4 bg-white">
            <div className="flex items-start gap-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled"
                alt="خالد محمد"
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">خالد محمد</h3>
                <p className="text-sm text-muted-foreground">التسويق الرقمي</p>
                <div className="mt-2 text-sm">
                  <p className="line-through text-red-600">📅 غدًا 10:00 ص - 10:10 ص</p>
                </div>
              </div>
            </div>
          </Card>
          <Button
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              setCurrentStep(1);
              toast.info("عرض المواعيد البديلة...");
            }}
          >
            عرض المواعيد البديلة
          </Button>
        </Card>
      ),
      notification: {
        type: "info",
        message: "طلب خالد محمد إعادة جدولة الجلسة - عرض المواعيد البديلة",
      },
    },
    {
      id: 2,
      title: "المواعيد البديلة",
      description: "البستاني يقترح 3 مواعيد",
      screen: (
        <Card className="p-6 border-2">
          <h3 className="text-lg font-bold mb-2">مواعيد بديلة مقترحة</h3>
          <p className="text-sm text-muted-foreground mb-4">
            اعتذر خالد محمد عن الموعد الحالي (غدًا 10:00 ص) ويقترح:
          </p>
          <div className="space-y-2 mb-4">
            {[
              "غدًا 2:00 م - 2:10 م",
              "بعد غد 10:00 ص - 10:10 ص",
              "بعد غد 4:00 م - 4:10 م",
            ].map((time, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start hover:bg-green-50 hover:border-green-500"
              >
                <input type="radio" name="time" className="ml-2" />
                📅 {time}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:bg-red-50"
              onClick={() => {
                setCurrentStep(3);
                toast.info("رفض المواعيد واسترداد المبلغ...");
              }}
            >
              رفض واسترداد المبلغ
            </Button>
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => {
                setCurrentStep(2);
                toast.success("تم قبول الموعد البديل ✓");
              }}
            >
              قبول الموعد
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: 3,
      title: "قبول الموعد",
      description: "تم تأكيد الموعد الجديد",
      screen: (
        <Card className="p-6 border-2 border-green-500 bg-green-50">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تم تأكيد الموعد الجديد!</h3>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-bold">📅 بعد غد</p>
              <p className="font-bold">⏰ 10:00 ص - 10:10 ص</p>
              <p className="text-sm text-muted-foreground mt-2">مع خالد محمد</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-blue-700">
                📢 تم إرسال إشعار للبستاني بالتأكيد
              </p>
            </div>
          </div>
        </Card>
      ),
      notification: {
        type: "success",
        message: "تم تأكيد الموعد الجديد: بعد غد 10:00 ص",
      },
    },
    {
      id: 4,
      title: "رفض واسترداد",
      description: "تم إلغاء الجلسة واسترداد المبلغ",
      screen: (
        <Card className="p-6 border-2 border-blue-500 bg-blue-50">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">تم إلغاء الجلسة واسترداد المبلغ</h3>
            <p className="text-muted-foreground mb-4">
              تم رفض المواعيد البديلة
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2">المبلغ المسترد</p>
              <p className="text-3xl font-bold text-green-600">50 ر.س</p>
              <p className="text-xs text-muted-foreground mt-2">
                تم إضافته إلى محفظتك
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-sm">
              <p className="text-purple-700">
                💡 يمكنك حجز جلسة جديدة مع أي بستاني آخر
              </p>
            </div>
          </div>
        </Card>
      ),
      notification: {
        type: "success",
        message: "تم إلغاء الجلسة واسترداد 50 ر.س إلى محفظتك",
      },
    },
  ];

  // اختيار الخطوات حسب السيناريو
  const getSteps = (): Step[] => {
    switch (selectedScenario) {
      case "A":
        return stepsA;
      case "B":
        return stepsB;
      case "C":
        return stepsC;
      case "D":
        return stepsD;
      default:
        return [];
    }
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  // عرض الإشعار عند الانتقال لخطوة جديدة
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      if (nextStep.notification) {
        const { type, message } = nextStep.notification;
        switch (type) {
          case "success":
            toast.success(message);
            break;
          case "warning":
            toast.warning(message);
            break;
          case "error":
            toast.error(message);
            break;
          case "info":
            toast.info(message);
            break;
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    toast.info("تم إعادة تشغيل السيناريو");
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <div className="container max-w-6xl">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
                <Home className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">🎬 المحاكاة التفاعلية</h1>
            <p className="text-purple-100 mt-2">
              اختبر جميع سيناريوهات إعادة الجدولة خطوة بخطوة
            </p>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="container max-w-6xl py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">اختر السيناريو</h2>
            <p className="text-muted-foreground">
              كل سيناريو يحتوي على خطوات تفاعلية مع إشعارات حقيقية
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-300"
                onClick={() => {
                  setSelectedScenario(scenario.id);
                  setCurrentStep(0);
                  toast.success(`بدء السيناريو: ${scenario.title}`);
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`text-5xl w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${scenario.color}`}
                  >
                    {scenario.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{scenario.title}</h3>
                    <p className="text-sm text-purple-600 font-medium mb-2">
                      {scenario.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {scenario.description}
                    </p>
                    <Button className="mt-4" size="sm">
                      ابدأ المحاكاة
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // عرض السيناريو المختار
  const selectedScenarioData = scenarios.find((s) => s.id === selectedScenario)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedScenarioData.color} text-white p-6`}>
        <div className="container max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => {
              setSelectedScenario(null);
              setCurrentStep(0);
            }}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للسيناريوهات
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{selectedScenarioData.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{selectedScenarioData.title}</h1>
              <p className="text-white/90">{selectedScenarioData.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="container max-w-4xl py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              الخطوة {currentStep + 1} من {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${selectedScenarioData.color} transition-all duration-300`}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        {/* Screen */}
        <div className="mb-6">{currentStepData.screen}</div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            السابق
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`flex-1 bg-gradient-to-r ${selectedScenarioData.color}`}
          >
            التالي
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>

        {/* Steps List */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold mb-3 text-sm">خطوات السيناريو:</h3>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm p-2 rounded cursor-pointer transition-colors ${
                  index === currentStep
                    ? "bg-purple-100 text-purple-900 font-medium"
                    : index < currentStep
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white">
                  {index < currentStep ? "✓" : index + 1}
                </span>
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Reschedule Dialog */}
      <EmergencyRescheduleDialog
        open={showEmergencyDialog}
        onOpenChange={(open) => {
          setShowEmergencyDialog(open);
          if (!open && currentStep === 1) {
            // إذا تم إغلاق الحوار بعد إرسال الطلب، انتقل للخطوة التالية
            setCurrentStep(3);
          }
        }}
        session={{
          id: "demo-session",
          gardenerName: "أحمد علي",
          topic: "تطوير الأعمال",
        }}
      />
    </div>
  );
}
