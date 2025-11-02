import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GardenerCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gardenerName: string;
  onConfirm: (date: string, time: string, duration: number) => void;
}

const weekDays = [
  { id: 1, name: "سبت", date: "1" },
  { id: 2, name: "أحد", date: "2", selected: true },
  { id: 3, name: "اثنين", date: "3" },
  { id: 4, name: "ثلاثاء", date: "4" },
  { id: 5, name: "أربعاء", date: "5" },
  { id: 6, name: "خميس", date: "6" },
];

const availableSlots = [
  { time: "9:00 PM - 7:30 PM", available: true },
  { time: "11:00 PM - 9:30 PM", available: false },
  { time: "1:00 AM - 11:30 PM", available: true },
];

export default function GardenerCalendar({
  open,
  onOpenChange,
  gardenerName,
  onConfirm,
}: GardenerCalendarProps) {
  const [selectedDay, setSelectedDay] = useState(2);
  const [startTime, setStartTime] = useState("7:30 PM");
  const [duration, setDuration] = useState(10.0);
  const [cost, setCost] = useState(10.0);

  const handleConfirm = () => {
    const selectedDayName = weekDays.find(d => d.id === selectedDay)?.name || "";
    toast.success("تم تأكيد الموعد الجديد");
    onConfirm(selectedDayName, startTime, duration);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">الوقت والمدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Current Session Warning */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 flex items-center gap-2">
            <div className="bg-purple-500 rounded-full p-1">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm text-purple-700">
              الجلسة الحالية هي المجانية 10 دقائق ⏱️
            </p>
          </div>

          {/* Week Days Selector */}
          <div className="flex justify-between gap-2">
            {weekDays.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 transition-all ${
                  selectedDay === day.id
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-purple-200 hover:border-purple-400"
                }`}
              >
                <span className="text-xs">{day.name}</span>
                <span className="text-lg font-bold">{day.date}</span>
              </button>
            ))}
          </div>

          {/* Available Time Slots */}
          <div className="space-y-2">
            {availableSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                {slot.available ? (
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                    onClick={() => setStartTime(slot.time.split(" - ")[1])}
                  >
                    {slot.time}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1 border-purple-300 text-purple-600"
                  >
                    طلب موعد
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Time and Duration Controls */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
            {/* Start Time */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">البداية</span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-bold min-w-[100px] text-center">{startTime}</span>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">المدة</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDuration(Math.max(10, duration - 5))}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-bold min-w-[100px] text-center">{duration.toFixed(1)}</span>
                <button
                  onClick={() => setDuration(duration + 5)}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">التكلفة</span>
              <span className="text-lg font-bold">₪{cost.toFixed(1)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              التالي
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
