import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical, Video, AlertTriangle, Gift, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import BostaniRegularRequestDialog from "@/components/BostaniRegularRequestDialog";
import BostaniEmergencyRequestDialog from "@/components/BostaniEmergencyRequestDialog";

interface Session {
  id: string;
  badherName: string;
  badherImage: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending_reschedule" | "pending_emergency" | "welcome";
  requestType?: "regular" | "emergency" | "welcome";
  requestReason?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  isWelcome?: boolean;
  timeUntil: string;
  timeUntilColor: "green" | "orange" | "red";
}

const mockSessions: Session[] = [
  {
    id: "1",
    badherName: "محمد أحمد",
    badherImage: "https://i.pravatar.cc/150?img=15",
    topic: "استشارة تطوير الأعمال",
    date: "اليوم",
    time: "2:00 م - 2:10 م",
    duration: 10,
    status: "pending_reschedule",
    requestType: "regular",
    requestReason: "ظرف طارئ في العمل",
    suggestedDate: "غداً",
    suggestedTime: "10:00 ص",
    timeUntil: "طلب إعادة جدولة عادي",
    timeUntilColor: "green",
  },
  {
    id: "2",
    badherName: "فاطمة علي",
    badherImage: "https://i.pravatar.cc/150?img=9",
    topic: "استشارة تسويق المحتوى",
    date: "اليوم",
    time: "11:45 ص - 11:55 ص",
    duration: 10,
    status: "pending_emergency",
    requestType: "emergency",
    requestReason: "اجتماع مفاجئ ومهم جداً",
    suggestedDate: "اليوم",
    suggestedTime: "3:00 م",
    timeUntil: "طلب طارئ - باقي 30 دقيقة",
    timeUntilColor: "red",
  },
  {
    id: "3",
    badherName: "خالد سعيد",
    badherImage: "https://i.pravatar.cc/150?img=11",
    topic: "استشارة ترحيبية",
    date: "غداً",
    time: "4:00 م - 4:10 م",
    duration: 10,
    status: "welcome",
    isWelcome: true,
    timeUntil: "باقي يوم",
    timeUntilColor: "green",
  },
  {
    id: "4",
    badherName: "نورة محمد",
    badherImage: "https://i.pravatar.cc/150?img=10",
    topic: "استشارة ريادة الأعمال",
    date: "اليوم",
    time: "5:00 م - 5:10 م",
    duration: 10,
    status: "confirmed",
    timeUntil: "باقي 3 ساعات",
    timeUntilColor: "green",
  },
];

export default function BostaniSessions() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showRegularDialog, setShowRegularDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  const handleViewRequest = (session: Session) => {
    setSelectedSession(session);

    if (session.requestType === "emergency") {
      setShowEmergencyDialog(true);
    } else if (session.requestType === "regular") {
      setShowRegularDialog(true);
    }
  };

  const pendingCount = mockSessions.filter(s =>
    s.status === "pending_reschedule" || s.status === "pending_emergency"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="container max-w-4xl">
          <Link href="/bostani">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للسيناريوهات
            </Button>
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">جلساتي</h1>
              <p className="text-green-100 text-sm mt-1">إدارة ومراجعة طلبات الجلسات</p>
            </div>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <div className="bg-orange-500 text-white rounded-full px-4 py-2">
                  <span className="text-sm font-medium">{pendingCount} طلب جديد</span>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm font-medium">{mockSessions.length} جلسات</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="container max-w-4xl mt-6">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-sm text-center">
            💡 <strong>ملاحظة:</strong> الطلبات الطارئة (أقل من ساعة) تحتاج موافقة سريعة خلال 15 دقيقة
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="container max-w-4xl py-6 space-y-4">
        {mockSessions.map((session) => (
          <Card
            key={session.id}
            className={`overflow-hidden border-2 transition-all ${
              session.status.includes("pending")
                ? "border-orange-300 bg-orange-50/30"
                : "border-green-100 hover:border-green-200"
            }`}
          >
            <div className="p-5">
              {/* Urgent Badge */}
              {session.status === "pending_emergency" && (
                <div className="mb-3">
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 animate-pulse">
                    ⚡ طلب طارئ - يحتاج موافقة فورية
                  </Badge>
                </div>
              )}

              {/* Regular Request Badge */}
              {session.status === "pending_reschedule" && (
                <div className="mb-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    📋 طلب إعادة جدولة عادي
                  </Badge>
                </div>
              )}

              {/* Welcome Badge */}
              {session.isWelcome && (
                <div className="mb-3">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    <Gift className="w-3 h-3 ml-1" />
                    جلسة ترحيبية مجانية
                  </Badge>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Badher Image */}
                <div className="relative">
                  <img
                    src={session.badherImage}
                    alt={session.badherName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-green-100"
                  />
                  <div className="absolute -bottom-1 -left-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>

                {/* Session Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{session.badherName}</h3>
                      <p className="text-sm text-muted-foreground">{session.topic}</p>
                    </div>

                    {/* More Options */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Original Time */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{session.time}</span>
                      <span className="text-muted-foreground">• {session.date}</span>
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
                  </div>

                  {/* Request Details */}
                  {session.status.includes("pending") && (
                    <div className="mt-3 bg-white border-2 border-orange-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-orange-900 mb-2">تفاصيل الطلب:</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <strong>السبب:</strong> {session.requestReason}
                        </p>
                        <p className="text-green-700">
                          <strong>الموعد المقترح:</strong> {session.suggestedDate} - {session.suggestedTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    {session.status.includes("pending") ? (
                      <>
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          onClick={() => handleViewRequest(session)}
                        >
                          {session.status === "pending_emergency" && (
                            <AlertTriangle className="h-4 w-4 ml-2" />
                          )}
                          مراجعة الطلب
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          <Video className="h-4 w-4 ml-2" />
                          قاعة الانتظار
                        </Button>

                        <Button
                          variant="outline"
                          className="border-green-200 hover:bg-green-50"
                        >
                          تفاصيل
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Request Dialogs */}
      {selectedSession && (
        <>
          <BostaniRegularRequestDialog
            open={showRegularDialog}
            onOpenChange={setShowRegularDialog}
            session={selectedSession}
          />
          <BostaniEmergencyRequestDialog
            open={showEmergencyDialog}
            onOpenChange={setShowEmergencyDialog}
            session={selectedSession}
          />
        </>
      )}
    </div>
  );
}
