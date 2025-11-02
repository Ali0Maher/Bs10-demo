import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, RotateCcw, Home, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import EmergencyRescheduleDialog from "@/components/EmergencyRescheduleDialog";
import GardenerCalendar from "@/components/GardenerCalendar";
import BadherSelectAlternativeDialog from "@/components/BadherSelectAlternativeDialog";

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

  // State for inline emergency form (step 2)
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [showCalendar, setShowCalendar] = useState(false);

  // State for Scenario D - Gardener apologizes with alternatives
  const [showAlternativesDialog, setShowAlternativesDialog] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<{ date: string; time: string } | null>(null);
  const [alternativeSlots] = useState([
    { date: "غدًا 5/25", time: "2:00 م - 2:10 م" },
    { date: "بعد غد 5/26", time: "10:00 ص - 10:10 ص" },
    { date: "بعد غد 5/26", time: "4:00 م - 4:10 م" },
  ]);

  // State for Scenario A - Regular reschedule
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Suggested time options
  const SUGGESTED_TIMES = [
    { label: "بعد ساعة من الآن (12:45 ص)", value: "hour_later" },
    { label: "غداً 10:00 ص", value: "tomorrow_10am" },
    { label: "بعد غد 2:00 م", value: "day_after_2pm" },
  ];

  // Handler for calendar confirmation
  const handleCalendarConfirm = (date: string, time: string, duration: number) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedDuration(duration);
    setShowCalendar(false);
    toast.success(`تم اختيار الموعد: ${date} - ${time}`);
  };

  // Handler for sending emergency request
  const handleSendEmergencyRequest = () => {
    if (reason.trim().length === 0 || !selectedDate) {
      toast.error("يجب ملء جميع الحقول المطلوبة");
      return;
    }
    toast.success("تم إرسال الطلب إلى البستاني");
    // Move to next step
    setCurrentStep(2);
  };

  // السيناريوهات المتاحة
  const scenarios = [
    {
      id: "A" as ScenarioType,
      title: "إعادة جدولة عادية",
      subtitle: "قبل ساعة أو أكثر",
      icon: "🌱",
      color: "from-bas10-teal to-bas10-cyan",
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
      color: "from-bas10-cyan to-bas10-teal",
      description: "جلسة مجانية - إعادة جدولة مرة واحدة فقط",
    },
    {
      id: "D" as ScenarioType,
      title: "البستاني يعتذر",
      subtitle: "اقتراح بديل أو استرداد",
      icon: "🌿",
      color: "from-bas10-teal to-bas10-purple",
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
          <h2 className="text-2xl font-bold mb-6 text-center">إعادة جدولة بذرة</h2>
          <div className="space-y-6">
            {/* Gardener Info */}
            <div className="text-right">
              <label className="text-sm text-muted-foreground">مع</label>
              <p className="text-lg font-bold">مهند الفارس</p>
            </div>

            {/* Day Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block text-right">اختر اليوم</label>
              <div className="flex gap-3 justify-end">
                {[
                  { label: "اليوم 5/24", value: "اليوم 5/24" },
                  { label: "غدًا 5/25", value: "غدًا 5/25" },
                  { label: "بعد غد 5/26", value: "بعد غد 5/26" }
                ].map((day) => (
                  <Button
                    key={day.value}
                    variant="outline"
                    className={`rounded-full px-6 ${
                      selectedDay === day.value
                        ? "bg-teal-100 border-bas10-teal"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedDay(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block text-right">اختر الوقت</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "10:00 ص - 10:10 ص",
                  "11:00 ص - 11:10 ص",
                  "2:00 م - 2:10 م",
                  "3:00 م - 3:10 م"
                ].map((time) => (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? "default" : "outline"}
                    className={`h-auto py-4 ${
                      selectedTimeSlot === time
                        ? "bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal text-white"
                        : "border-gray-300 hover:bg-teal-50"
                    }`}
                    onClick={() => setSelectedTimeSlot(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Reschedule Button */}
            <Button
              className="w-full h-14 text-lg bg-gradient-to-r from-bas10-teal to-bas10-purple hover:from-bas10-purple hover:to-bas10-teal"
              disabled={!selectedDay || !selectedTimeSlot}
              onClick={() => {
                if (!selectedDay || !selectedTimeSlot) {
                  toast.error("يجب اختيار اليوم والوقت");
                  return;
                }
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
        message: selectedDay && selectedTimeSlot
          ? `تمت إعادة جدولة جلستك مع مهند الفارس إلى ${selectedDay}، ${selectedTimeSlot}`
          : "تمت إعادة جدولة جلستك مع مهند الفارس",
      },
    },
    {
      id: 3,
      title: "تأكيد النجاح",
      description: "تم تحديث الجلسة بالموعد الجديد",
      screen: (
        <Card className="p-6 border-2 border-bas10-teal bg-teal-50">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تمت إعادة الجدولة بنجاح!</h3>
            <p className="text-muted-foreground mb-4">
              تمت إعادة جدولة جلستك مع مهند الفارس إلى:
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-bold">📅 {selectedDay || "غدًا 5/25"}</p>
              <p className="font-bold">⏰ {selectedTimeSlot || "10:00 ص - 10:10 ص"}</p>
            </div>
            <div className="bg-cyan-50 p-3 rounded-lg text-sm border border-bas10-cyan">
              <p className="text-teal-700">
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
        <Card className="p-6 border-2 border-orange-500 max-w-2xl mx-auto">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="bg-orange-100 rounded-full p-4">
                <AlertTriangle className="h-12 w-12 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">طلب إعادة جدولة طارئ</h2>
            </div>

            {/* Warning message */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-3">
              <p className="text-sm leading-relaxed">
                باقي <strong>أقل من ساعة</strong> على موعد الجلسة. إعادة الجدولة في هذه الحالة تتطلب
                موافقة البستاني.
              </p>
              <p className="text-sm leading-relaxed text-orange-700 font-medium">
                إذا لم يوافق البستاني أو لم يرد خلال 15 دقيقة، ستُحسب الجلسة كأنها انعقدت.
              </p>
            </div>

            {/* Reason field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                سبب الطلب <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border-2 border-teal-300 focus:border-bas10-teal rounded-lg p-3 text-sm min-h-[80px] resize-none"
                placeholder="مثل: ظرف طارئ، اجتماع مفاجئ..."
                required
              />
              {reason.trim().length === 0 && (
                <p className="text-xs text-red-600">
                  يجب ذكر سبب الطلب الطارئ
                </p>
              )}
            </div>

            {/* Alternative time selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                الوقت البديل المقترح <span className="text-red-500">*</span>
              </label>

              {selectedDate && selectedTime ? (
                // Show selected appointment
                <div className="bg-teal-50 border-2 border-bas10-teal rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-teal-800">
                        📅 {selectedDate}
                      </p>
                      <p className="text-sm text-teal-700">
                        🕐 {selectedTime} • {selectedDuration} دقائق
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCalendar(true)}
                      className="text-xs"
                    >
                      تغيير
                    </Button>
                  </div>
                </div>
              ) : (
                // Show suggested times as clickable options
                <div className="space-y-2">
                  {SUGGESTED_TIMES.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setShowCalendar(true)}
                      className="w-full text-right border-2 border-gray-200 hover:border-bas10-teal hover:bg-teal-50 rounded-lg p-3 text-sm transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                  <p className="text-xs text-gray-600 mt-2">
                    💡 اضغط على أي وقت لفتح تقويم البستاني واختيار الموعد المناسب
                  </p>
                </div>
              )}

              {!selectedDate && (
                <p className="text-xs text-red-600">
                  يجب اختيار موعد بديل قبل إرسال الطلب
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(0)}
                className="flex-1"
              >
                السابق
              </Button>
              <Button
                onClick={handleSendEmergencyRequest}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={reason.trim().length === 0 || !selectedDate}
              >
                إرسال الطلب
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 3,
      title: "بانتظار الموافقة",
      description: "الانتظار حتى يرد البستاني",
      screen: (
        <Card className="p-6 border-2 border-bas10-teal">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h3 className="text-xl font-bold mb-2">بانتظار موافقة البستاني</h3>
            <p className="text-muted-foreground mb-4">
              تم إرسال طلب إعادة الجدولة إلى أحمد علي
            </p>
            <div className="bg-teal-50 rounded-lg p-4 mb-4 border border-bas10-teal">
              <p className="text-sm text-teal-700">
                سيتم إشعارك فور الموافقة أو الرفض
              </p>
              <p className="text-2xl font-bold mt-2 text-teal-900">12:30</p>
              <p className="text-xs text-teal-600">الوقت المتبقي للرد</p>
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
                className="bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
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
        <Card className="p-6 border-2 border-bas10-teal bg-teal-50">
          <div className="text-center mb-4">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تمت الموافقة!</h3>
            <p className="text-muted-foreground">
              وافق أحمد علي على طلب إعادة الجدولة
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-xs text-teal-700 mb-2 text-center">الموعد الجديد المؤكد:</p>
            <p className="text-base font-bold text-teal-900 text-center">
              📅 بعد ساعة من الآن
            </p>
            <p className="text-sm text-teal-800 text-center">
              🕐 12:45 ص • 10 دقائق
            </p>
            <p className="text-xs text-teal-700 text-center mt-2">
              ℹ️ تم تأكيد الموعد الذي اخترته مسبقاً
            </p>
          </div>
          <Button className="w-full bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal">
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
            <div className="bg-cyan-50 p-3 rounded-lg text-sm mb-4 border border-bas10-cyan">
              <p className="text-teal-700">
                💡 يمكنك التواصل مع البستاني عبر الرسائل لترتيب جلسة جديدة
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                حسنًا
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-bas10-teal to-bas10-purple hover:from-bas10-purple hover:to-bas10-teal">
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
          <Card className="p-6 bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-bas10-teal">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎁</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">لديك جلسة ترحيبية مجانية!</h3>
                <p className="text-sm text-muted-foreground">
                  10 دقائق مجانية - صالحة حتى 7 أيام من التسجيل
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
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
                <Badge className="mt-2 bg-gradient-to-r from-bas10-teal to-bas10-cyan text-white border-0">
                  🎁 جلسة ترحيبية مجانية
                </Badge>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span>📅 غدًا 3:00 م - 3:10 م</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  ⏰ صلاحية الجلسة: 4 أيام
                </div>
                <div className="mt-2 bg-teal-50 p-2 rounded text-xs text-teal-700 border border-bas10-cyan">
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
        <Card className="p-6 border-2 border-bas10-teal">
          <div className="bg-teal-50 p-4 rounded-lg mb-4 border-2 border-bas10-teal">
            <div className="flex items-start gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="font-bold text-teal-900">إعادة جدولة الجلسة الترحيبية</h3>
                <p className="text-sm text-teal-700 mt-2">
                  هذه جلستك الترحيبية المجانية (10 دقائق)
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-teal-800">
                    <strong>⚠️ ملاحظات مهمة:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-teal-700">
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
              className="flex-1 bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
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
          <div className="bg-teal-100 p-3 rounded-lg mb-4 text-sm text-teal-800">
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
                    className={`rounded-full text-xs ${
                      i === 2
                        ? "bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
                        : "hover:bg-teal-50"
                    }`}
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
                    className={`${
                      i === 0
                        ? "bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
                        : "hover:bg-teal-50"
                    }`}
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
              className="w-full bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
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
        <Card className="p-6 border-2 border-bas10-teal bg-teal-50">
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
              <Button className="flex-1 bg-gradient-to-r from-bas10-purple to-bas10-teal hover:from-bas10-teal hover:to-bas10-purple">
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
        <Card className="p-6 border-2 border-bas10-teal">
          <div className="bg-teal-50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">📢</span>
              <div>
                <h3 className="font-bold text-teal-900">إشعار جديد</h3>
                <p className="text-sm text-teal-700 mt-1">
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
            className="w-full mt-4 bg-gradient-to-r from-bas10-teal to-bas10-purple hover:from-bas10-purple hover:to-bas10-teal"
            onClick={() => {
              setShowAlternativesDialog(true);
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
      title: "اختيار موعد بديل",
      description: "اختر من المواعيد البديلة المقترحة",
      screen: (
        <Card className="p-6 border-2 border-bas10-teal">
          <div className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">يُرجى اختيار موعد بديل</h3>
            <p className="text-muted-foreground mb-4">
              اعتذر خالد محمد عن الموعد الحالي واقترح 3 مواعيد بديلة
            </p>
            <div className="bg-teal-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-teal-700">
                📢 اضغط على الزر أدناه لعرض المواعيد واختيار ما يناسبك
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-bas10-teal to-bas10-purple hover:from-bas10-purple hover:to-bas10-teal"
              onClick={() => setShowAlternativesDialog(true)}
            >
              عرض المواعيد البديلة
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
        <Card className="p-6 border-2 border-bas10-teal bg-teal-50">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">تم تأكيد الموعد الجديد!</h3>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-bold">📅 {selectedAlternative?.date || "بعد غد"}</p>
              <p className="font-bold">⏰ {selectedAlternative?.time || "10:00 ص - 10:10 ص"}</p>
              <p className="text-sm text-muted-foreground mt-2">مع خالد محمد</p>
            </div>
            <div className="bg-cyan-50 p-3 rounded-lg text-sm border border-bas10-cyan">
              <p className="text-teal-700">
                📢 تم إرسال إشعار للبستاني بالتأكيد
              </p>
            </div>
          </div>
        </Card>
      ),
      notification: {
        type: "success",
        message: selectedAlternative
          ? `تم تأكيد الموعد الجديد: ${selectedAlternative.date} ${selectedAlternative.time}`
          : "تم تأكيد الموعد الجديد",
      },
    },
    {
      id: 4,
      title: "رفض واسترداد",
      description: "تم إلغاء الجلسة واسترداد المبلغ",
      screen: (
        <Card className="p-6 border-2 border-bas10-teal bg-teal-50">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">تم إلغاء الجلسة واسترداد المبلغ</h3>
            <p className="text-muted-foreground mb-4">
              تم رفض المواعيد البديلة
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2">المبلغ المسترد</p>
              <p className="text-3xl font-bold text-teal-600">50 ر.س</p>
              <p className="text-xs text-muted-foreground mt-2">
                تم إضافته إلى محفظتك
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-sm border border-bas10-purple">
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
    // Reset all state
    setSelectedDay(null);
    setSelectedTimeSlot(null);
    setReason("");
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedAlternative(null);
    toast.info("تم إعادة تشغيل السيناريو");
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <div className="container max-w-6xl">
            <Link href="/badher">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
                <Home className="w-4 h-4 ml-2" />
                العودة لصفحة الباذر
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="/images/logo.svg"
                alt="BAS10 Logo"
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold text-center">🌱 المحاكاة التفاعلية</h1>
            <p className="text-purple-100 mt-2 text-center">
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
                  // Reset all state when starting new scenario
                  setSelectedDay(null);
                  setSelectedTimeSlot(null);
                  setReason("");
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedAlternative(null);
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
              // Reset all state when going back
              setSelectedDay(null);
              setSelectedTimeSlot(null);
              setReason("");
              setSelectedDate(null);
              setSelectedTime(null);
              setSelectedAlternative(null);
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

      {/* Gardener Calendar Dialog */}
      <GardenerCalendar
        open={showCalendar}
        onOpenChange={setShowCalendar}
        onConfirm={handleCalendarConfirm}
        gardenerName="أحمد علي"
        sessionDuration={10}
      />

      {/* Badher Select Alternative Dialog - Scenario D */}
      <BadherSelectAlternativeDialog
        open={showAlternativesDialog}
        onOpenChange={setShowAlternativesDialog}
        gardenerName="خالد محمد"
        alternativeSlots={alternativeSlots}
        onConfirm={(selectedSlot) => {
          setSelectedAlternative(selectedSlot);
          toast.success(`تم تأكيد الموعد: ${selectedSlot.date} - ${selectedSlot.time}`);
          setShowAlternativesDialog(false);
          setCurrentStep(2); // Move to step 3 (قبول الموعد) - 0-indexed
        }}
      />
    </div>
  );
}
