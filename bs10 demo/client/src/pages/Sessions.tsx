import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical, Video } from "lucide-react";
import { useState } from "react";
import RescheduleDialog from "@/components/RescheduleDialog";
import EmergencyRescheduleDialog from "@/components/EmergencyRescheduleDialog";

interface Session {
  id: string;
  gardenerName: string;
  gardenerImage: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "waiting_approval";
  timeUntil: string;
  timeUntilColor: "green" | "orange" | "red";
  isWelcome?: boolean;
  welcomeDaysLeft?: number;
  canReschedule: boolean;
  requiresApproval: boolean;
}

const mockSessions: Session[] = [
  {
    id: "1",
    gardenerName: "مهند الفارس",
    gardenerImage: "https://i.pravatar.cc/150?img=12",
    topic: "المحتوى العربي",
    date: "اليوم",
    time: "12:00 ص - 12:10 ص",
    duration: 10,
    status: "confirmed",
    timeUntil: "باقي 45 دقيقة",
    timeUntilColor: "orange",
    canReschedule: true,
    requiresApproval: true,
  },
  {
    id: "2",
    gardenerName: "سارة أحمد",
    gardenerImage: "https://i.pravatar.cc/150?img=5",
    topic: "استشارة ترحيبية",
    date: "غدًا",
    time: "3:00 م - 3:10 م",
    duration: 10,
    status: "confirmed",
    timeUntil: "باقي يوم",
    timeUntilColor: "green",
    isWelcome: true,
    welcomeDaysLeft: 4,
    canReschedule: true,
    requiresApproval: false,
  },
  {
    id: "3",
    gardenerName: "أحمد علي",
    gardenerImage: "https://i.pravatar.cc/150?img=8",
    topic: "تطوير الأعمال",
    date: "اليوم",
    time: "11:45 ص - 11:55 ص",
    duration: 10,
    status: "waiting_approval",
    timeUntil: "بانتظار الموافقة",
    timeUntilColor: "orange",
    canReschedule: false,
    requiresApproval: true,
  },
];

export default function Sessions() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showEmergencyReschedule, setShowEmergencyReschedule] = useState(false);

  const handleReschedule = (session: Session) => {
    setSelectedSession(session);
    
    // Check if requires emergency approval (less than 1 hour)
    if (session.requiresApproval) {
      setShowEmergencyReschedule(true);
    } else {
      setShowReschedule(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">بذوري</h1>
              <p className="text-purple-100 text-sm mt-1">جلساتك المحجوزة</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm font-medium">{mockSessions.length} جلسات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="container max-w-4xl py-6 space-y-4">
        {mockSessions.map((session) => (
          <Card key={session.id} className="overflow-hidden border-2 hover:border-purple-200 transition-all">
            <div className="p-5">
              {/* Welcome Badge */}
              {session.isWelcome && (
                <div className="mb-3 space-y-2">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    🎁 جلسة ترحيبية مجانية
                  </Badge>
                  {session.welcomeDaysLeft && (
                    <span className="text-xs text-muted-foreground mr-2">
                      ⏰ صلاحية الجلسة: {session.welcomeDaysLeft} أيام
                    </span>
                  )}
                  <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
                    💡 يمكنك إعادة جدولتها <strong>مرة واحدة فقط</strong> خلال {session.welcomeDaysLeft} أيام
                  </p>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Gardener Image */}
                <div className="relative">
                  <img
                    src={session.gardenerImage}
                    alt={session.gardenerName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div className="absolute -bottom-1 -left-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>

                {/* Session Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{session.gardenerName}</h3>
                      <p className="text-sm text-muted-foreground">{session.topic}</p>
                    </div>
                    
                    {/* More Options */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        // Show dropdown menu
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Time and Status */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{session.time}</span>
                    </div>
                    
                    <Badge
                      variant="secondary"
                      className={`
                        ${session.timeUntilColor === "green" ? "bg-green-100 text-green-700" : ""}
                        ${session.timeUntilColor === "orange" ? "bg-orange-100 text-orange-700" : ""}
                        ${session.timeUntilColor === "red" ? "bg-red-100 text-red-700" : ""}
                      `}
                    >
                      {session.timeUntil}
                    </Badge>

                    {session.status === "waiting_approval" && (
                      <>
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          ⏳ بانتظار الموافقة
                        </Badge>
                        <div className="w-full mt-2">
                          <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded">
                            💡 تم إرسال طلب إعادة جدولة <strong>طارئ</strong> (أقل من ساعة) - بانتظار رد البستاني
                          </p>
                        </div>
                      </>
                    )}
                    
                    {!session.isWelcome && !session.status.includes("waiting") && session.timeUntilColor === "orange" && (
                      <span className="text-xs text-orange-600">
                        💡 لازلت تقدر تعيد الجدولة مباشرة
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      disabled={session.status === "waiting_approval"}
                    >
                      <Video className="h-4 w-4 ml-2" />
                      قاعة الانتظار
                    </Button>
                    
                    {session.canReschedule && (
                      <Button
                        variant="outline"
                        onClick={() => handleReschedule(session)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        إعادة جدولة
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reschedule Dialogs */}
      {selectedSession && (
        <>
          <RescheduleDialog
            open={showReschedule}
            onOpenChange={setShowReschedule}
            session={selectedSession}
          />
          <EmergencyRescheduleDialog
            open={showEmergencyReschedule}
            onOpenChange={setShowEmergencyReschedule}
            session={selectedSession}
          />
        </>
      )}
    </div>
  );
}
