import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Session {
  id: string;
  gardenerName: string;
  topic: string;
  isWelcome?: boolean;
  welcomeDaysLeft?: number;
}

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

const availableDays = [
  { id: "today", label: "اليوم", date: "5/24" },
  { id: "tomorrow", label: "غدًا", date: "5/25" },
  { id: "day3", label: "بعد غد", date: "5/26" },
  { id: "day4", label: "الأحد", date: "5/27" },
  { id: "day5", label: "الاثنين", date: "5/28" },
];

const availableSlots = [
  { id: "1", time: "الآن - 11:00 ص", available: true, highlight: true },
  { id: "2", time: "10:00 ص - 11:00 ص", available: true },
  { id: "3", time: "2:00 م - 3:00 م", available: true },
  { id: "4", time: "4:00 م - 5:00 م", available: true },
  { id: "5", time: "6:00 م - 7:00 م", available: false },
];

export default function RescheduleDialog({ open, onOpenChange, session }: RescheduleDialogProps) {
  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(10);

  const handleReschedule = () => {
    if (!selectedSlot) {
      toast.error("الرجاء اختيار موعد");
      return;
    }

    toast.success("تم إعادة جدولة الجلسة بنجاح ✓");
    onOpenChange(false);
  };

  // Limit days for welcome session
  const daysToShow = session.isWelcome && session.welcomeDaysLeft 
    ? availableDays.slice(0, Math.min(session.welcomeDaysLeft, availableDays.length))
    : availableDays;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">إعادة جدولة بذرة</DialogTitle>
          <div className="space-y-2 pt-2">
            <p className="text-muted-foreground">مع {session.gardenerName}</p>
            <p className="text-sm font-medium">{session.topic}</p>
          </div>
        </DialogHeader>

        {/* Welcome Session Warning */}
        {session.isWelcome && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-green-700">جلسة ترحيبية - إعادة جدولة واحدة فقط</span>
            </div>
            <p className="text-sm text-green-700">
              ⚠️ يجب اختيار موعد خلال {session.welcomeDaysLeft} أيام من الآن
            </p>
          </div>
        )}

        {/* Days Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">اختر اليوم</h3>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {daysToShow.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center
                  w-20 h-20 rounded-full border-2 transition-all
                  ${selectedDay === day.id
                    ? "bg-purple-600 text-white border-purple-600 scale-110"
                    : "bg-white border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                <span className="text-sm font-medium">{day.label}</span>
                <span className="text-xs opacity-75">{day.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">اختر الوقت</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && setSelectedSlot(slot.id)}
                disabled={!slot.available}
                className={`
                  p-3 rounded-lg border-2 transition-all text-sm font-medium
                  ${!slot.available
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : selectedSlot === slot.id
                    ? "bg-purple-600 text-white border-purple-600"
                    : slot.highlight
                    ? "bg-green-50 border-green-300 text-green-700 hover:border-green-400"
                    : "bg-white border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                {slot.time}
                {slot.highlight && slot.available && (
                  <Badge className="mr-2 bg-green-500 text-white text-xs">متاح الآن</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Control */}
        <div className="space-y-3">
          <h3 className="font-semibold">المدة</h3>
          
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <span className="text-sm text-muted-foreground">البداية: 9:00 ص</span>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => duration > 10 && setDuration(duration - 10)}
                disabled={session.isWelcome || duration <= 10}
                className="h-8 w-8 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-purple-600">{duration}</div>
                <div className="text-xs text-muted-foreground">دقيقة</div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(duration + 10)}
                disabled={session.isWelcome}
                className="h-8 w-8 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {session.isWelcome && (
            <p className="text-xs text-muted-foreground text-center">
              المدة ثابتة للجلسة الترحيبية (10 دقائق)
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!selectedSlot}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            إعادة جدولة
          </Button>
        </div>

        {/* Warning for Welcome Session */}
        {session.isWelcome && (
          <p className="text-xs text-center text-orange-600 font-medium">
            ⚠️ تذكّر: لا يمكن إعادة جدولة هذه الجلسة مرة أخرى
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
