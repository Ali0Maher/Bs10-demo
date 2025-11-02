import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  RotateCcw,
  Gift,
  Video
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import GardenerCalendar from "@/components/GardenerCalendar";

type ScenarioType = "regular" | "emergency" | "welcome" | "confirmed" | null;

const scenarios = [
  {
    id: "regular",
    badherName: "محمد أحمد",
    badherImage: "https://i.pravatar.cc/150?img=15",
    topic: "استشارة تطوير الأعمال",
    type: "regular" as ScenarioType,
    title: "طلب إعادة جدولة عادي",
    description: "طلب عادي (أكثر من ساعة)",
    icon: Clock,
    color: "from-bas10-teal to-bas10-cyan",
    requestReason: "ظرف طارئ في العمل",
    suggestedDate: "غداً",
    suggestedTime: "10:00 ص",
    originalDate: "اليوم",
    originalTime: "2:00 م - 2:10 م",
  },
  {
    id: "emergency",
    badherName: "فاطمة علي",
    badherImage: "https://i.pravatar.cc/150?img=9",
    topic: "استشارة تسويق المحتوى",
    type: "emergency" as ScenarioType,
    title: "طلب إعادة جدولة طارئ",
    description: "طلب عاجل (أقل من ساعة)",
    icon: AlertTriangle,
    color: "from-red-500 to-orange-500",
    requestReason: "اجتماع مفاجئ ومهم جداً",
    suggestedDate: "اليوم",
    suggestedTime: "3:00 م",
    originalDate: "اليوم",
    originalTime: "11:45 ص - 11:55 ص",
    timeLeft: "باقي 30 دقيقة",
  },
  {
    id: "welcome",
    badherName: "خالد سعيد",
    badherImage: "https://i.pravatar.cc/150?img=11",
    topic: "استشارة ترحيبية",
    type: "welcome" as ScenarioType,
    title: "جلسة ترحيبية مجانية",
    description: "جلسة مجانية 10 دقائق",
    icon: Gift,
    color: "from-bas10-cyan to-bas10-teal",
    originalDate: "غداً",
    originalTime: "4:00 م - 4:10 م",
    timeLeft: "باقي يوم",
    isWelcome: true,
  },
  {
    id: "confirmed",
    badherName: "نورة محمد",
    badherImage: "https://i.pravatar.cc/150?img=10",
    topic: "استشارة ريادة الأعمال",
    type: "confirmed" as ScenarioType,
    title: "جلسة مؤكدة عادية",
    description: "جلسة عادية بدون طلبات",
    icon: CheckCircle,
    color: "from-bas10-teal to-bas10-cyan",
    originalDate: "اليوم",
    originalTime: "5:00 م - 5:10 م",
    timeLeft: "باقي 3 ساعات",
  },
];

interface AlternativeSlot {
  date: string;
  time: string;
}

export default function BostaniInteractiveDemo() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [decision, setDecision] = useState<"approve" | "reject" | "counter" | "apologize" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([]);

  const scenario = scenarios.find(s => s.type === selectedScenario);

  const handleSelectScenario = (type: ScenarioType) => {
    setSelectedScenario(type);
    setCurrentStep(1);
    setDecision(null);
    setRejectionReason("");
    setAlternativeSlots([]);
  };

  const handleAddAlternativeSlot = () => {
    if (alternativeSlots.length >= 3) {
      toast.error("يمكنك اقتراح 3 مواعيد كحد أقصى");
      return;
    }
    setShowCalendar(true);
  };

  const handleRemoveAlternativeSlot = (index: number) => {
    setAlternativeSlots(alternativeSlots.filter((_, i) => i !== index));
    toast.info("تم حذف الموعد");
  };

  const handleCalendarConfirm = (date: string, time: string, duration: number) => {
    setAlternativeSlots([...alternativeSlots, { date, time }]);
    setShowCalendar(false);
    toast.success(`تم إضافة موعد بديل: ${date} - ${time}`);
  };

  const handleNext = () => {
    // Validate decisions
    if (selectedScenario === "regular" || selectedScenario === "emergency") {
      if (currentStep === 1 && !decision) {
        toast.error("يجب اختيار قرار أولاً");
        return;
      }
      if (currentStep === 1 && decision === "reject" && !rejectionReason.trim()) {
        toast.error("يجب كتابة سبب الرفض");
        return;
      }
      if (currentStep === 1 && decision === "apologize" && alternativeSlots.length === 0) {
        toast.error("يجب اختيار موعد بديل واحد على الأقل من الكاليندر");
        return;
      }
    }

    const maxSteps = getMaxSteps();
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 1 && (selectedScenario === "regular" || selectedScenario === "emergency")) {
        toast.success("تم إرسال الرد للباذر");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setDecision(null);
    setRejectionReason("");
    setSelectedAlternativeIndex(null);
    setAlternativeSlots([]);
    toast.info("تم إعادة تشغيل المحاكاة");
  };

  const getMaxSteps = () => {
    if (selectedScenario === "regular" || selectedScenario === "emergency") return 2;
    if (selectedScenario === "welcome") return 2;
    if (selectedScenario === "confirmed") return 2;
    return 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const maxSteps = getMaxSteps();
    return (currentStep / maxSteps) * 100;
  };

  if (!selectedScenario || !scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-bas10-teal to-bas10-purple text-white p-6">
          <div className="container max-w-4xl">
            <Link href="/bostani">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة للسيناريوهات
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="/images/logo.svg"
                alt="BAS10 Logo"
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              🌿 محاكاة تفاعلية - البستاني
            </h1>
            <p className="text-center text-white/90">
              اختر السيناريو الذي تريد تجربته
            </p>
          </div>
        </div>

        <div className="container max-w-6xl py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">اختر سيناريو للمحاكاة</h2>
            <p className="text-muted-foreground">كل سيناريو يعرض تدفق مختلف من الجلسات</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {scenarios.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.id}
                  className="p-6 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-bas10-teal"
                  onClick={() => handleSelectScenario(s.type)}
                >
                  <div className={`bg-gradient-to-r ${s.color} rounded-lg p-4 text-white mb-4`}>
                    <Icon className="h-8 w-8 mb-2" />
                    <h3 className="text-lg font-bold">{s.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{s.badherName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.topic}</p>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-bas10-teal to-bas10-purple hover:from-bas10-purple hover:to-bas10-teal">
                    ابدأ المحاكاة
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-bas10-teal to-bas10-purple text-white p-6">
        <div className="container max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => setSelectedScenario(null)}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة لاختيار السيناريو
          </Button>
          <h1 className="text-2xl font-bold text-center mb-2">
            {scenario.title}
          </h1>
          <p className="text-center text-white/90 text-sm">
            {scenario.badherName} • {scenario.topic}
          </p>
        </div>
      </div>

      <div className="container max-w-4xl py-8 space-y-6">
        {/* Progress Bar */}
        {currentStep > 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  الخطوة {currentStep} من {getMaxSteps()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          </Card>
        )}

        {/* Steps for Regular/Emergency Requests */}
        {(selectedScenario === "regular" || selectedScenario === "emergency") && (
          <>
            {/* Combined Step: استقبال الطلب + مراجعة التفاصيل + اتخاذ القرار */}
            {currentStep === 1 && (
              <Card className={`p-8 border-2 ${selectedScenario === "emergency" ? "border-red-200 bg-red-50/30" : "border-bas10-teal bg-teal-50/30"}`}>
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="text-center">
                    <div className={`${selectedScenario === "emergency" ? "bg-red-100" : "bg-teal-100"} rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center mb-4 ${selectedScenario === "emergency" ? "animate-pulse" : ""}`}>
                      {selectedScenario === "emergency" ? (
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                      ) : (
                        <Clock className="h-12 w-12 text-teal-600" />
                      )}
                    </div>
                    <Badge className={`${selectedScenario === "emergency" ? "bg-red-500" : "bg-gradient-to-r from-bas10-teal to-bas10-cyan"} text-white text-sm mb-3`}>
                      {selectedScenario === "emergency" ? "⚡ طلب طارئ جديد" : "📋 طلب عادي جديد"}
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">
                      طلب إعادة جدولة {selectedScenario === "emergency" ? "طارئ" : "عادي"}
                    </h2>
                    <p className="text-muted-foreground">
                      وصل طلب من الباذر <strong>{scenario.badherName}</strong> لإعادة جدولة الجلسة
                    </p>
                  </div>

                  {/* Badher Info Card */}
                  <div className={`bg-white border-2 ${selectedScenario === "emergency" ? "border-orange-300" : "border-bas10-teal"} rounded-lg p-4 max-w-3xl mx-auto`}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={scenario.badherImage} alt={scenario.badherName} className="w-12 h-12 rounded-full" />
                      <div className="text-right flex-1">
                        <p className="font-bold">{scenario.badherName}</p>
                        <p className="text-sm text-muted-foreground">{scenario.topic}</p>
                      </div>
                      {selectedScenario === "emergency" && (
                        <Badge className="bg-red-100 text-red-700">
                          ⏰ {scenario.timeLeft}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm"><strong>الموعد الأصلي:</strong> {scenario.originalDate} {scenario.originalTime}</p>
                  </div>

                  {/* Emergency Warning */}
                  {selectedScenario === "emergency" && (
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 max-w-3xl mx-auto">
                      <p className="text-sm text-orange-900 font-medium text-center">
                        ⚠️ هذا طلب طارئ يحتاج موافقة سريعة خلال 15 دقيقة!
                      </p>
                    </div>
                  )}

                  {/* Request Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-orange-900 mb-2">سبب الطلب{selectedScenario === "emergency" ? " الطارئ" : ""}:</p>
                      <p className="text-sm font-medium">{scenario.requestReason}</p>
                    </div>

                    <div className="bg-teal-50 border-2 border-bas10-teal rounded-lg p-4">
                      <p className="text-xs font-medium text-teal-900 mb-2">الموعد البديل المقترح:</p>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="font-bold text-teal-900">📅 {scenario.suggestedDate}</span>
                        <span className="font-bold text-teal-900">🕐 {scenario.suggestedTime}</span>
                        <span className="text-muted-foreground">• 10 دقائق</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Timer */}
                  {selectedScenario === "emergency" && (
                    <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-center text-red-900 mb-2 font-medium">
                        ⏰ الوقت المتبقي للرد
                      </p>
                      <p className="text-4xl font-bold text-center text-red-600">
                        14:50
                      </p>
                    </div>
                  )}

                  {/* Decision Section */}
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold mb-2">اتخاذ القرار</h3>
                      <p className="text-muted-foreground text-sm">
                        اختر قرارك بشأن طلب إعادة الجدولة
                      </p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                    <Button
                      onClick={() => {
                        setDecision("approve");
                        toast.success("تم اختيار الموافقة");
                      }}
                      className={`w-full h-16 text-base ${
                        decision === "approve"
                          ? "bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal ring-4 ring-teal-200"
                          : "bg-gradient-to-r from-bas10-teal to-bas10-cyan hover:from-bas10-cyan hover:to-bas10-teal"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5 ml-2" />
                      الموافقة على الموعد المقترح
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm text-muted-foreground">أو</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setDecision("apologize");
                          toast.info("اختر مواعيد بديلة من الكاليندر (حتى 3 مواعيد)");
                        }}
                        variant="outline"
                        className={`w-full h-12 border-2 ${
                          decision === "apologize"
                            ? "border-orange-400 bg-orange-50 ring-4 ring-orange-100"
                            : "border-orange-300 hover:bg-orange-50"
                        }`}
                      >
                        <Calendar className="h-4 w-4 ml-2 text-orange-600" />
                        <span className="text-orange-700">الاعتذار واقتراح مواعيد بديلة</span>
                      </Button>

                      {decision === "apologize" && (
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                          <p className="text-sm font-medium text-orange-900 mb-3 text-center">
                            المواعيد البديلة المقترحة ({alternativeSlots.length}/3):
                          </p>

                          {/* Alternative Slots List */}
                          <div className="space-y-2 mb-3">
                            {alternativeSlots.length === 0 && (
                              <div className="bg-white border-2 border-dashed border-orange-300 rounded-lg p-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                  لم تضف أي مواعيد بديلة بعد
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  اضغط "إضافة موعد من الكاليندر" للبدء
                                </p>
                              </div>
                            )}

                            {alternativeSlots.map((slot, index) => (
                              <div
                                key={index}
                                className="bg-white border-2 border-orange-300 rounded-lg p-3 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="text-sm font-bold text-orange-700">{index + 1}</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      📅 {slot.date} • 🕐 {slot.time}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAlternativeSlot(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {/* Add More Button */}
                          {alternativeSlots.length < 3 && (
                            <Button
                              onClick={handleAddAlternativeSlot}
                              variant="outline"
                              className="w-full border-orange-300 hover:bg-orange-50"
                            >
                              <Calendar className="h-4 w-4 ml-2" />
                              إضافة موعد من الكاليندر ({alternativeSlots.length}/3)
                            </Button>
                          )}
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setDecision("reject");
                          toast.info("اختر سبب الرفض");
                        }}
                        variant="outline"
                        className={`w-full h-12 border-2 ${
                          decision === "reject"
                            ? "border-red-400 bg-red-50 ring-4 ring-red-100"
                            : "border-red-300 hover:bg-red-50"
                        }`}
                      >
                        <XCircle className="h-4 w-4 ml-2 text-red-600" />
                        <span className="text-red-700">رفض الطلب</span>
                      </Button>

                      {decision === "reject" && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                          <label className="text-sm font-medium text-red-900 mb-2 block">
                            سبب الرفض (إجباري):
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full border-2 border-red-300 rounded-lg p-3 text-sm min-h-[80px] resize-none"
                            placeholder="مثل: لا يوجد وقت متاح في هذا التوقيت..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </Card>
            )}

            {/* Step 2: تأكيد النتيجة */}
            {currentStep === 2 && (
              <Card className={`p-8 border-2 ${
                decision === "approve" ? "border-green-200 bg-green-50/50" :
                decision === "apologize" ? "border-orange-200 bg-orange-50/50" :
                "border-red-200 bg-red-50/50"
              }`}>
                <div className="text-center space-y-6">
                  {decision === "approve" ? (
                    <>
                      <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-green-900 mb-2">تمت الموافقة! ✅</h2>
                        <p className="text-muted-foreground">
                          تم إرسال الموافقة للباذر وتأكيد الموعد الجديد
                        </p>
                      </div>
                      <div className="bg-white border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-sm text-green-700 mb-3">الموعد الجديد المؤكد:</p>
                        <p className="text-xl font-bold text-green-900 mb-2">
                          📅 {scenario.suggestedDate}
                        </p>
                        <p className="text-lg font-bold text-green-800">
                          🕐 {scenario.suggestedTime} • 10 دقائق
                        </p>
                      </div>
                    </>
                  ) : decision === "apologize" && alternativeSlots.length > 0 ? (
                    <>
                      <div className="bg-orange-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-orange-900 mb-2">تم الاعتذار وإرسال مواعيد بديلة! 🙏</h2>
                        <p className="text-muted-foreground">
                          تم إرسال {alternativeSlots.length} مواعيد بديلة للباذر
                        </p>
                      </div>
                      <div className="bg-white border-2 border-orange-300 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-sm text-orange-700 mb-3">المواعيد البديلة المرسلة:</p>
                        <div className="space-y-3">
                          {alternativeSlots.map((slot, index) => (
                            <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-base font-bold text-orange-900">
                                  📅 {slot.date}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-orange-800 mr-8">
                                🕐 {slot.time}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-orange-700 mt-4 text-center">
                          ✅ سيتلقى الباذر إشعاراً لاختيار الموعد المناسب
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                        <XCircle className="h-12 w-12 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">تم الرفض</h2>
                        <p className="text-muted-foreground">
                          تم إرسال الرفض للباذر مع السبب
                        </p>
                      </div>
                      <div className="bg-white border-2 border-red-300 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-sm text-red-700 mb-3">سبب الرفض:</p>
                        <p className="text-sm text-gray-700">{rejectionReason}</p>
                        <p className="text-xs text-red-700 mt-4">
                          ⚠️ ستُحسب الجلسة كأنها انعقدت وفقاً لسياسة التطبيق
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Steps for Welcome Session */}
        {selectedScenario === "welcome" && (
          <>
            {/* Step 1: عرض الجلسة الترحيبية */}
            {currentStep === 1 && (
              <Card className="p-8 border-2 border-emerald-200 bg-emerald-50/50">
                <div className="text-center space-y-6">
                  <div className="bg-emerald-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <Gift className="h-12 w-12 text-emerald-600" />
                  </div>

                  <div>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm mb-3">
                      🎁 جلسة ترحيبية مجانية
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">جلسة ترحيبية مع باذر جديد</h2>
                    <p className="text-muted-foreground">
                      جلسة استشارية مجانية لمدة 10 دقائق مع <strong>{scenario.badherName}</strong>
                    </p>
                  </div>

                  <div className="bg-white border-2 border-emerald-300 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={scenario.badherImage} alt={scenario.badherName} className="w-16 h-16 rounded-full" />
                      <div className="text-right">
                        <p className="font-bold text-lg">{scenario.badherName}</p>
                        <p className="text-sm text-muted-foreground">{scenario.topic}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-sm"><strong>📅 التاريخ:</strong> {scenario.originalDate}</p>
                      <p className="text-sm"><strong>🕐 الوقت:</strong> {scenario.originalTime}</p>
                      <p className="text-sm"><strong>⏱️ المدة:</strong> 10 دقائق (مجاناً)</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 mt-4">
                      ✨ {scenario.timeLeft}
                    </Badge>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-xs text-blue-700 text-center">
                      💡 هذه أول جلسة مع هذا الباذر. الجلسة الترحيبية مجانية لتشجيع المستخدمين الجدد.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: الاستعداد للجلسة */}
            {currentStep === 2 && (
              <Card className="p-8">
                <div className="text-center space-y-6">
                  <div className="bg-purple-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <Video className="h-12 w-12 text-purple-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">الاستعداد للجلسة</h2>
                    <p className="text-muted-foreground">
                      تأكد من جاهزيتك قبل موعد الجلسة
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <h3 className="font-bold mb-3 text-center">✓ قائمة التحضيرات</h3>
                      <ul className="space-y-2 text-sm text-right">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>تأكد من اتصال الإنترنت</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>راجع ملف الباذر والموضوع</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>حضّر أسئلة افتتاحية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>اختر مكان هادئ للجلسة</span>
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 h-14">
                      <Video className="h-5 w-5 ml-2" />
                      الدخول لقاعة الانتظار
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: تأكيد الجلسة */}
            {currentStep === 3 && (
              <Card className="p-8 border-2 border-green-200 bg-green-50/50">
                <div className="text-center space-y-6">
                  <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">جاهز للجلسة! ✅</h2>
                    <p className="text-muted-foreground">
                      أنت الآن جاهز لبدء الجلسة الترحيبية
                    </p>
                  </div>
                  <div className="bg-white border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-sm text-green-700 mb-4">معلومات الجلسة:</p>
                    <div className="space-y-2 text-sm">
                      <p><strong>الباذر:</strong> {scenario.badherName}</p>
                      <p><strong>الموضوع:</strong> {scenario.topic}</p>
                      <p><strong>الموعد:</strong> {scenario.originalDate} • {scenario.originalTime}</p>
                      <p className="text-emerald-700 font-medium">💚 جلسة مجانية • 10 دقائق</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Steps for Confirmed Session */}
        {selectedScenario === "confirmed" && (
          <>
            {/* Step 1: عرض الجلسة المؤكدة */}
            {currentStep === 1 && (
              <Card className="p-8 border-2 border-green-200 bg-green-50/50">
                <div className="text-center space-y-6">
                  <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>

                  <div>
                    <Badge className="bg-green-600 text-white text-sm mb-3">
                      ✓ جلسة مؤكدة
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">جلسة مؤكدة بدون طلبات</h2>
                    <p className="text-muted-foreground">
                      جلسة استشارية عادية مع <strong>{scenario.badherName}</strong>
                    </p>
                  </div>

                  <div className="bg-white border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={scenario.badherImage} alt={scenario.badherName} className="w-16 h-16 rounded-full" />
                      <div className="text-right">
                        <p className="font-bold text-lg">{scenario.badherName}</p>
                        <p className="text-sm text-muted-foreground">{scenario.topic}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-sm"><strong>📅 التاريخ:</strong> {scenario.originalDate}</p>
                      <p className="text-sm"><strong>🕐 الوقت:</strong> {scenario.originalTime}</p>
                      <p className="text-sm"><strong>⏱️ المدة:</strong> 10 دقائق</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 mt-4">
                      ⏰ {scenario.timeLeft}
                    </Badge>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-xs text-blue-700 text-center">
                      ✓ لا توجد طلبات إعادة جدولة. الجلسة مؤكدة في موعدها الأصلي.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: الدخول للجلسة */}
            {currentStep === 2 && (
              <Card className="p-8">
                <div className="text-center space-y-6">
                  <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                    <Video className="h-12 w-12 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-2">جاهز لبدء الجلسة</h2>
                    <p className="text-muted-foreground">
                      يمكنك الدخول لقاعة الانتظار الآن
                    </p>
                  </div>

                  <div className="bg-white border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto">
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14">
                        <Video className="h-5 w-5 ml-2" />
                        الدخول لقاعة الانتظار
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        ستبدأ الجلسة تلقائياً في الموعد المحدد
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        {currentStep > 0 && (
          <Card className="p-6">
            <div className="flex gap-4 justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex-1"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                السابق
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                className="px-8"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentStep === getMaxSteps()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {currentStep === getMaxSteps() ? "انتهى" : "التالي"}
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-center text-muted-foreground">
            💡 <strong>ملاحظة:</strong> هذه محاكاة تفاعلية لتوضيح تدفق {scenario.title}.
            في التطبيق الحقيقي، سيتم إرسال إشعارات فورية للطرفين.
          </p>
        </Card>
      </div>

      {/* Gardener Calendar */}
      {showCalendar && (
        <GardenerCalendar
          open={showCalendar}
          onOpenChange={setShowCalendar}
          gardenerName="أنت"
          onConfirm={handleCalendarConfirm}
        />
      )}
    </div>
  );
}
