import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import GardenerCalendar from "./GardenerCalendar";

interface Session {
  id: string;
  badherName: string;
  topic: string;
  requestReason?: string;
  suggestedDate?: string;
  suggestedTime?: string;
}

interface BostaniRegularRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

type RequestStatus = "reviewing" | "approved" | "rejected" | "counter_offer" | "selecting_alternatives";

interface AlternativeSlot {
  date: string;
  time: string;
}

export default function BostaniRegularRequestDialog({
  open,
  onOpenChange,
  session,
}: BostaniRegularRequestDialogProps) {
  const [status, setStatus] = useState<RequestStatus>("reviewing");
  const [showCalendar, setShowCalendar] = useState(false);
  const [counterDate, setCounterDate] = useState<string | null>(null);
  const [counterTime, setCounterTime] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([]);

  const handleApprove = () => {
    setStatus("approved");
    toast.success("تمت الموافقة على الطلب");
  };

  const handleReject = () => {
    if (rejectionReason.trim().length === 0) {
      toast.error("يرجى كتابة سبب الرفض");
      return;
    }
    setStatus("rejected");
    toast.error("تم رفض الطلب");
  };

  const handleCounterOffer = () => {
    setShowCalendar(true);
  };

  const handleApologizeAndSuggest = () => {
    setAlternativeSlots([]);
    setStatus("selecting_alternatives");
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
    if (status === "selecting_alternatives") {
      // إضافة موعد بديل للقائمة
      setAlternativeSlots([...alternativeSlots, { date, time }]);
      setShowCalendar(false);
      toast.success(`تم إضافة موعد بديل: ${date} - ${time}`);
    } else {
      // الحالة القديمة لموعد واحد
      setCounterDate(date);
      setCounterTime(time);
      setShowCalendar(false);
      setStatus("counter_offer");
      toast.success(`تم اقتراح موعد بديل: ${date} - ${time}`);
    }
  };

  const handleSendAlternatives = () => {
    if (alternativeSlots.length === 0) {
      toast.error("يجب اختيار موعد بديل واحد على الأقل");
      return;
    }
    toast.success(`تم إرسال ${alternativeSlots.length} مواعيد بديلة للباذر`);
    onOpenChange(false);
    // Reset state
    setTimeout(() => {
      setStatus("reviewing");
      setAlternativeSlots([]);
    }, 300);
  };

  const handleSendCounterOffer = () => {
    toast.success("تم إرسال الموعد البديل للباذر");
    onOpenChange(false);
    // Reset state
    setStatus("reviewing");
    setCounterDate(null);
    setCounterTime(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state
    setTimeout(() => {
      setStatus("reviewing");
      setCounterDate(null);
      setCounterTime(null);
      setRejectionReason("");
      setAlternativeSlots([]);
    }, 300);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {/* Reviewing State */}
          {status === "reviewing" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-blue-100 rounded-full p-4">
                    <Calendar className="h-12 w-12 text-blue-600" />
                  </div>
                  <DialogTitle className="text-2xl">طلب إعادة جدولة عادي</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Badher Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">الباذر</p>
                      <p className="font-bold text-lg">{session.badherName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.topic}</p>
                </div>

                {/* Request Details */}
                <div className="space-y-3">
                  <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-orange-900 mb-2">سبب الطلب:</p>
                    <p className="text-sm leading-relaxed">{session.requestReason}</p>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-green-900 mb-2">الموعد المقترح:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{session.suggestedDate}</span>
                      <Clock className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">{session.suggestedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 هذا طلب عادي (أكثر من ساعة). يمكنك الموافقة، الرفض، أو اقتراح موعد بديل.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 ml-2" />
                    الموافقة على الموعد المقترح
                  </Button>

                  <Button
                    onClick={handleApologizeAndSuggest}
                    variant="outline"
                    className="w-full border-orange-300 hover:bg-orange-50 text-orange-700"
                  >
                    <Calendar className="h-4 w-4 ml-2" />
                    الاعتذار واقتراح مواعيد بديلة
                  </Button>

                  <Button
                    onClick={handleCounterOffer}
                    variant="outline"
                    className="w-full border-purple-300 hover:bg-purple-50"
                  >
                    <Calendar className="h-4 w-4 ml-2" />
                    اقتراح موعد بديل واحد
                  </Button>

                  <div className="pt-2">
                    <label className="text-sm font-medium mb-2 block">رفض الطلب (اختياري)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full border rounded-lg p-3 text-sm min-h-[60px] resize-none mb-2"
                      placeholder="سبب الرفض..."
                    />
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                      disabled={rejectionReason.trim().length === 0}
                    >
                      <XCircle className="h-4 w-4 ml-2" />
                      رفض الطلب
                    </Button>
                  </div>
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
                    تمت الموافقة على طلب إعادة الجدولة من <strong>{session.badherName}</strong>
                  </p>

                  <div className="bg-white border border-green-300 rounded-lg p-3">
                    <p className="text-xs text-green-700 mb-2 text-center">الموعد الجديد المؤكد:</p>
                    <p className="text-base font-bold text-green-900 text-center">
                      📅 {session.suggestedDate}
                    </p>
                    <p className="text-sm text-green-800 text-center">
                      🕐 {session.suggestedTime} • 10 دقائق
                    </p>
                  </div>
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
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm leading-relaxed text-center">
                    تم رفض طلب إعادة الجدولة من <strong>{session.badherName}</strong>
                  </p>
                  <div className="bg-white border border-red-300 rounded-lg p-3">
                    <p className="text-xs text-red-700 mb-2">سبب الرفض:</p>
                    <p className="text-sm">{rejectionReason}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 سيتم إشعار الباذر بالرفض. يمكنه التواصل معك لترتيب موعد آخر.
                  </p>
                </div>

                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                >
                  إغلاق
                </Button>
              </div>
            </>
          )}

          {/* Counter Offer State */}
          {status === "counter_offer" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-purple-100 rounded-full p-4">
                    <Calendar className="h-12 w-12 text-purple-600" />
                  </div>
                  <DialogTitle className="text-2xl">موعد بديل مقترح</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm leading-relaxed text-center">
                    سيتم إرسال الموعد البديل التالي إلى <strong>{session.badherName}</strong>:
                  </p>

                  <div className="bg-white border border-purple-300 rounded-lg p-3">
                    <p className="text-xs text-purple-700 mb-2 text-center">الموعد البديل:</p>
                    <p className="text-base font-bold text-purple-900 text-center">
                      📅 {counterDate}
                    </p>
                    <p className="text-sm text-purple-800 text-center">
                      🕐 {counterTime} • 10 دقائق
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 سيتم إشعار الباذر بالموعد البديل وسينتظر موافقته.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStatus("reviewing")}
                    className="flex-1"
                  >
                    تعديل
                  </Button>
                  <Button
                    onClick={handleSendCounterOffer}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    إرسال
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Selecting Alternatives State */}
          {status === "selecting_alternatives" && (
            <>
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-orange-100 rounded-full p-4">
                    <Calendar className="h-12 w-12 text-orange-600" />
                  </div>
                  <DialogTitle className="text-2xl">المواعيد البديلة</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    البستاني يقترح {alternativeSlots.length || 0} من 3 مواعيد
                  </p>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-center mb-3">
                    اعتذر عن الموعد الحالي <strong>({session.suggestedDate} {session.suggestedTime})</strong> ويقترح:
                  </p>

                  {/* Alternative Slots List */}
                  <div className="space-y-2">
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
                            <p className="text-xs text-muted-foreground">10 دقائق</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAlternativeSlot(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      className="w-full mt-3 border-orange-300 hover:bg-orange-50"
                    >
                      <Calendar className="h-4 w-4 ml-2" />
                      إضافة موعد من الكاليندر ({alternativeSlots.length}/3)
                    </Button>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 يمكنك اقتراح من 1 إلى 3 مواعيد بديلة. سيختار الباذر واحداً منها.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStatus("reviewing")}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSendAlternatives}
                    disabled={alternativeSlots.length === 0}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    إرسال للباذر
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Gardener Calendar */}
      {showCalendar && (
        <GardenerCalendar
          open={showCalendar}
          onOpenChange={setShowCalendar}
          gardenerName="أنت"
          onConfirm={handleCalendarConfirm}
        />
      )}
    </>
  );
}
