import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import GardenerCalendar from "./GardenerCalendar";

interface Session {
  id: string;
  gardenerName: string;
  topic: string;
  isWelcome?: boolean;
  welcomeDaysLeft?: number;
}

interface EmergencyRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

type EmergencyStatus = "warning" | "waiting" | "approved" | "rejected";

// Suggested time options
const SUGGESTED_TIMES = [
  { label: "بعد ساعة من الآن (12:45 ص)", value: "hour_later" },
  { label: "غداً 10:00 ص", value: "tomorrow_10am" },
  { label: "بعد غد 2:00 م", value: "day_after_2pm" },
];

export default function EmergencyRescheduleDialog({
  open,
  onOpenChange,
  session,
}: EmergencyRescheduleDialogProps) {
  const [status, setStatus] = useState<EmergencyStatus>("warning");
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reason, setReason] = useState("");
  
  // State for selected appointment
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(10);

  const handleSuggestedTimeClick = (value: string) => {
    // Open calendar when any suggested time is clicked
    setShowCalendar(true);
  };

  const handleRequestEmergency = () => {
    setStatus("waiting");
    toast.info("تم إرسال الطلب إلى البستاني");
    
    // Simulate countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate response after 5 seconds (for demo)
    setTimeout(() => {
      clearInterval(interval);
      // Randomly approve or reject for demo
      const approved = Math.random() > 0.3;
      setStatus(approved ? "approved" : "rejected");
      
      if (approved) {
        toast.success("وافق البستاني على إعادة الجدولة");
      } else {
        toast.error("اعتذر البستاني عن إعادة الجدولة");
      }
    }, 5000);
  };

  const handleCancelRequest = () => {
    setStatus("warning");
    setTimeLeft(15);
    toast.info("تم إلغاء الطلب");
  };

  const handleCalendarConfirm = (date: string, time: string, duration: number) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedDuration(duration);
    setShowCalendar(false);
    toast.success(`تم اختيار الموعد: ${date} - ${time}`);
  };

  const handleFinalConfirm = () => {
    toast.success(`تم تأكيد الموعد الجديد: ${selectedDate} - ${selectedTime}`);
    onOpenChange(false);
    // Reset states
    setStatus("warning");
    setReason("");
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDuration(10);
  };

  const handleContactGardener = () => {
    toast.info("سيتم فتح صفحة المراسلة");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          {/* Warning State - WITH suggested time dropdown that opens calendar */}
          {status === "warning" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-orange-100 rounded-full p-4">
                    <AlertTriangle className="h-12 w-12 text-orange-600" />
                  </div>
                  <DialogTitle className="text-2xl">طلب إعادة جدولة طارئ</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm leading-relaxed">
                    باقي <strong>أقل من ساعة</strong> على موعد الجلسة. إعادة الجدولة في هذه الحالة تتطلب
                    موافقة البستاني.
                  </p>
                  <p className="text-sm leading-relaxed text-orange-700 font-medium">
                    إذا لم يوافق البستاني أو لم يرد خلال 15 دقيقة، ستُحسب الجلسة كأنها انعقدت.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    سبب الطلب <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded-lg p-3 text-sm min-h-[80px] resize-none"
                    placeholder="مثل: ظرف طارئ، اجتماع مفاجئ..."
                    required
                  />
                  {reason.trim().length === 0 && (
                    <p className="text-xs text-red-600">
                      يجب ذكر سبب الطلب الطارئ
                    </p>
                  )}
                </div>

                {/* NEW: Suggested time dropdown that opens calendar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    الوقت البديل المقترح <span className="text-red-500">*</span>
                  </label>
                  
                  {selectedDate && selectedTime ? (
                    // Show selected appointment
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            📅 {selectedDate}
                          </p>
                          <p className="text-sm text-green-700">
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
                          onClick={() => handleSuggestedTimeClick(option.value)}
                          className="w-full text-right border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-lg p-3 text-sm transition-colors"
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

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleRequestEmergency}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    disabled={reason.trim().length === 0 || !selectedDate}
                  >
                    إرسال الطلب
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Waiting State - Show selected appointment */}
          {status === "waiting" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <div className="bg-purple-100 rounded-full p-4 animate-pulse">
                      <Clock className="h-12 w-12 text-purple-600" />
                    </div>
                    <div className="absolute -top-1 -left-1 bg-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {timeLeft}
                    </div>
                  </div>
                  <DialogTitle className="text-2xl">بانتظار موافقة البستاني</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm leading-relaxed">
                    تم إرسال طلب إعادة الجدولة إلى <strong>{session.gardenerName}</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    سيتم إشعارك فور الموافقة أو الرفض.
                  </p>
                </div>

                {/* Show selected appointment */}
                {selectedDate && selectedTime && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 mb-2">الموعد البديل المقترح:</p>
                    <p className="text-sm font-medium text-blue-900">
                      📅 {selectedDate} • 🕐 {selectedTime}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">الوقت المتبقي للرد</p>
                  <p className="text-3xl font-bold text-purple-600">{timeLeft} دقيقة</p>
                </div>

                <Button
                  variant="outline"
                  onClick={handleCancelRequest}
                  className="w-full"
                >
                  إلغاء الطلب
                </Button>
              </div>
            </>
          )}

          {/* Approved State - Show confirmation only (no calendar selection) */}
          {status === "approved" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <DialogTitle className="text-2xl">تمت الموافقة!</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm leading-relaxed text-center">
                    وافق <strong>{session.gardenerName}</strong> على طلب إعادة الجدولة.
                  </p>
                  
                  {/* Show confirmed appointment */}
                  {selectedDate && selectedTime && (
                    <div className="bg-white border border-green-300 rounded-lg p-3 mt-3">
                      <p className="text-xs text-green-700 mb-2 text-center">الموعد الجديد المؤكد:</p>
                      <p className="text-base font-bold text-green-900 text-center">
                        📅 {selectedDate}
                      </p>
                      <p className="text-sm text-green-800 text-center">
                        🕐 {selectedTime} • {selectedDuration} دقائق
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-green-700 text-center mt-2">
                    ℹ️ تم تأكيد الموعد الذي اخترته مسبقاً
                  </p>
                </div>

                <Button
                  onClick={handleFinalConfirm}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  حسناً
                </Button>
              </div>
            </>
          )}

          {/* Rejected State */}
          {status === "rejected" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-red-100 rounded-full p-4">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <DialogTitle className="text-2xl">لم تتم الموافقة</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm leading-relaxed">
                    اعتذر البستاني عن إعادة جدولة الجلسة.
                  </p>
                  <p className="text-sm text-red-700 font-medium">
                    ستُحسب الجلسة كأنها انعقدت وفقًا لسياسة التطبيق.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 يمكنك التواصل مع البستاني عبر الرسائل لترتيب جلسة جديدة.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    حسنًا
                  </Button>
                  <Button
                    onClick={handleContactGardener}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    مراسلة البستاني
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Gardener Calendar - Opens when suggested time is clicked */}
      {showCalendar && (
        <GardenerCalendar
          open={showCalendar}
          onOpenChange={setShowCalendar}
          gardenerName={session.gardenerName}
          onConfirm={handleCalendarConfirm}
        />
      )}
    </>
  );
}
