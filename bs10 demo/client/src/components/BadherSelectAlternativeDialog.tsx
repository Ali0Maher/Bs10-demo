import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AlternativeSlot {
  date: string;
  time: string;
}

interface BadherSelectAlternativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gardenerName: string;
  alternativeSlots: AlternativeSlot[];
  onConfirm: (selectedSlot: AlternativeSlot) => void;
}

export default function BadherSelectAlternativeDialog({
  open,
  onOpenChange,
  gardenerName,
  alternativeSlots,
  onConfirm,
}: BadherSelectAlternativeDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedIndex === null) {
      toast.error("يرجى اختيار موعد");
      return;
    }

    const selectedSlot = alternativeSlots[selectedIndex];
    onConfirm(selectedSlot);
    toast.success(`تم اختيار الموعد: ${selectedSlot.date} - ${selectedSlot.time}`);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedIndex(null);
  };

  // Group slots by date
  const slotsByDate = alternativeSlots.reduce((acc, slot, index) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push({ ...slot, originalIndex: index });
    return acc;
  }, {} as Record<string, Array<AlternativeSlot & { originalIndex: number }>>);

  const dates = Object.keys(slotsByDate);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">إعادة جدولة بذرة</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Gardener Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3 justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">مع</p>
                <p className="font-bold text-lg">{gardenerName}</p>
              </div>
              <User className="h-5 w-5 text-purple-600" />
            </div>
          </div>

          {/* Apologize Message */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <p className="text-sm text-center text-orange-900 font-medium">
              🙏 يعتذر البستاني عن الموعد الأصلي ويقترح المواعيد البديلة التالية:
            </p>
          </div>

          {/* Date Selection */}
          {dates.length > 0 && (
            <>
              <div>
                <p className="text-right font-bold text-lg mb-3">اختر اليوم</p>
                <div className="flex gap-3 justify-end flex-wrap">
                  {dates.map((date, idx) => (
                    <Button
                      key={date}
                      variant="outline"
                      className={`px-6 py-3 text-base ${
                        slotsByDate[date].some(s => s.originalIndex === selectedIndex)
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                          : "border-gray-300"
                      }`}
                      onClick={() => {
                        // Select first slot of this date by default
                        setSelectedIndex(slotsByDate[date][0].originalIndex);
                      }}
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <p className="text-right font-bold text-lg mb-3">اختر الوقت</p>
                <div className="grid grid-cols-2 gap-3">
                  {alternativeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedIndex === index ? "default" : "outline"}
                      className={`h-auto py-4 text-base ${
                        selectedIndex === index
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          : "border-gray-300 hover:bg-green-50"
                      }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{slot.time}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Selected slot preview */}
          {selectedIndex !== null && (
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
              <p className="text-sm text-purple-700 mb-2 text-center">الموعد المختار:</p>
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-purple-900">
                <Calendar className="h-5 w-5" />
                <span>{alternativeSlots[selectedIndex].date}</span>
                <span>•</span>
                <Clock className="h-5 w-5" />
                <span>{alternativeSlots[selectedIndex].time}</span>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null}
            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            إعادة جدولة
          </Button>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 text-center">
              💡 سيتم تأكيد الموعد الجديد بعد اختيارك
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
