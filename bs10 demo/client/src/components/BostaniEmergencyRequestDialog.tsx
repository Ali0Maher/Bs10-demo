import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Session {
  id: string;
  badherName: string;
  topic: string;
  requestReason?: string;
  suggestedDate?: string;
  suggestedTime?: string;
}

interface BostaniEmergencyRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

type RequestStatus = "reviewing" | "approved" | "rejected";

export default function BostaniEmergencyRequestDialog({
  open,
  onOpenChange,
  session,
}: BostaniEmergencyRequestDialogProps) {
  const [status, setStatus] = useState<RequestStatus>("reviewing");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes (900 seconds) to respond
  const [rejectionReason, setRejectionReason] = useState("");

  // Countdown timer
  useEffect(() => {
    if (status === "reviewing" && open) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Auto-reject if no response
            setStatus("rejected");
            setRejectionReason("لم يتم الرد خلال المهلة المحددة");
            toast.error("انتهت المهلة - تم رفض الطلب تلقائياً");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, open]);

  const handleApprove = () => {
    setStatus("approved");
    toast.success("تمت الموافقة على الطلب الطارئ");
  };

  const handleReject = () => {
    if (rejectionReason.trim().length === 0) {
      toast.error("يرجى كتابة سبب الرفض");
      return;
    }
    setStatus("rejected");
    toast.error("تم رفض الطلب");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a delay
    setTimeout(() => {
      setStatus("reviewing");
      setTimeLeft(900);
      setRejectionReason("");
    }, 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {/* Reviewing State - URGENT */}
        {status === "reviewing" && (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="bg-red-100 rounded-full p-4 animate-pulse">
                    <AlertTriangle className="h-12 w-12 text-red-600" />
                  </div>
                  {/* Countdown Badge */}
                  <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-sm font-bold rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-xs">باقي</span>
                    <span className="text-base">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <DialogTitle className="text-2xl">طلب طارئ!</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* URGENT Warning */}
              <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-lg p-4 animate-pulse">
                <p className="text-sm font-bold text-red-900 text-center mb-2">
                  ⚡ طلب عاجل جداً - يحتاج رد فوري!
                </p>
                <p className="text-xs text-red-700 text-center">
                  باقي أقل من <strong>ساعة واحدة</strong> على موعد الجلسة. يجب الرد خلال{" "}
                  <strong>15 دقيقة</strong> وإلا سيتم رفض الطلب تلقائياً.
                </p>
              </div>

              {/* Badher Info */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">الباذر</p>
                    <p className="font-bold text-lg">{session.badherName}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{session.topic}</p>
              </div>

              {/* Request Details */}
              <div className="space-y-3">
                <div className="bg-white border-2 border-orange-300 rounded-lg p-4">
                  <p className="text-xs font-medium text-orange-900 mb-2">سبب الطلب الطارئ:</p>
                  <p className="text-sm leading-relaxed font-medium">{session.requestReason}</p>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-green-900 mb-2">الموعد البديل المقترح:</p>
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="font-bold text-green-900">
                      📅 {session.suggestedDate}
                    </span>
                    <span className="font-bold text-green-900">
                      🕐 {session.suggestedTime}
                    </span>
                    <span className="text-muted-foreground">• 10 دقائق</span>
                  </div>
                </div>
              </div>

              {/* Time Remaining Display */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-lg p-4">
                <p className="text-sm text-center text-orange-900 mb-2 font-medium">
                  ⏰ الوقت المتبقي للرد
                </p>
                <p className="text-4xl font-bold text-center text-red-600">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  {timeLeft < 300 && "⚠️ أقل من 5 دقائق!"}
                  {timeLeft >= 300 && "يجب الرد قبل انتهاء الوقت"}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleApprove}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base py-6"
                >
                  <CheckCircle className="h-5 w-5 ml-2" />
                  الموافقة على الموعد المقترح
                </Button>

                <div className="pt-2 border-t-2 border-dashed border-gray-300">
                  <label className="text-sm font-medium mb-2 block text-red-700">
                    رفض الطلب (اختياري)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border-2 border-red-300 rounded-lg p-3 text-sm min-h-[70px] resize-none mb-2"
                    placeholder="سبب الرفض... (مثل: لا يوجد وقت متاح في هذا التوقيت)"
                  />
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="w-full border-red-400 text-red-700 hover:bg-red-50 border-2"
                    disabled={rejectionReason.trim().length === 0}
                  >
                    <XCircle className="h-4 w-4 ml-2" />
                    رفض الطلب
                  </Button>
                </div>
              </div>

              {/* Policy Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>💡 ملاحظة:</strong> في حالة الموافقة، سيتم تأكيد الموعد الجديد فوراً. في حالة
                  الرفض أو عدم الرد، ستُحسب الجلسة كأنها انعقدت وفقاً لسياسة التطبيق.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Approved State */}
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
                  تمت الموافقة على طلب إعادة الجدولة الطارئ من <strong>{session.badherName}</strong>
                </p>

                <div className="bg-white border border-green-300 rounded-lg p-4">
                  <p className="text-xs text-green-700 mb-3 text-center font-medium">
                    الموعد الجديد المؤكد:
                  </p>
                  <p className="text-lg font-bold text-green-900 text-center mb-2">
                    📅 {session.suggestedDate}
                  </p>
                  <p className="text-base font-bold text-green-800 text-center">
                    🕐 {session.suggestedTime} • 10 دقائق
                  </p>
                </div>

                <p className="text-xs text-green-700 text-center mt-2">
                  ✅ تم إرسال تأكيد للباذر بالموعد الجديد
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 text-center">
                  💡 شكراً على استجابتك السريعة! سيتم إرسال تذكير للطرفين قبل الموعد الجديد.
                </p>
              </div>

              <Button
                onClick={handleClose}
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
                <DialogTitle className="text-2xl">تم رفض الطلب</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-3">
                <p className="text-sm leading-relaxed text-center">
                  تم رفض طلب إعادة الجدولة الطارئ من <strong>{session.badherName}</strong>
                </p>

                {rejectionReason && (
                  <div className="bg-white border border-red-300 rounded-lg p-3">
                    <p className="text-xs text-red-700 mb-2 font-medium">سبب الرفض:</p>
                    <p className="text-sm">{rejectionReason}</p>
                  </div>
                )}

                <p className="text-xs text-red-700 bg-red-100 p-3 rounded border border-red-300">
                  ⚠️ وفقاً لسياسة التطبيق، سيتم احتساب الجلسة كأنها انعقدت في موعدها الأصلي.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                  💡 تم إشعار الباذر بالرفض. يمكنه التواصل معك عبر الرسائل لترتيب جلسة جديدة في وقت لاحق.
                </p>
              </div>

              <Button onClick={handleClose} variant="outline" className="w-full">
                إغلاق
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
