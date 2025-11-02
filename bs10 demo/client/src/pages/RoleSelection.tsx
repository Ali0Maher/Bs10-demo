import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { User, Leaf } from "lucide-react";

export default function RoleSelection() {
  const [, setLocation] = useLocation();

  const roles = [
    {
      id: "badher",
      title: "🌱 الباذر",
      subtitle: "عرض تجربة الباذر",
      icon: User,
      color: "from-blue-500 to-blue-600",
      description: "شاهد كيف يمكن للباذر إعادة جدولة الجلسات والتفاعل مع البستاني",
      path: "/badher",
    },
    {
      id: "bostani",
      title: "🌿 البستاني",
      subtitle: "عرض تجربة البستاني",
      icon: Leaf,
      color: "from-green-500 to-green-600",
      description: "شاهد كيف يستقبل البستاني طلبات إعادة الجدولة ويستجيب لها",
      path: "/bostani",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/images/logo.svg"
              alt="BAS10 Logo"
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-4xl font-bold mb-3">بستن - شاشات إعادة الجدولة</h1>
          <p className="text-purple-100 text-lg">
            نظام متكامل لإدارة الجلسات وإعادة جدولتها
          </p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">اختر التجربة التي تريد استكشافها</h2>
          <p className="text-muted-foreground text-lg">
            يمكنك مشاهدة النظام من وجهة نظر الباذر أو البستاني
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card
                key={role.id}
                className={`p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 ${
                  role.comingSoon
                    ? "opacity-75 hover:border-gray-300"
                    : "hover:border-purple-400 hover:scale-105"
                } relative overflow-hidden`}
                onClick={() => {
                  if (!role.comingSoon) {
                    setLocation(role.path);
                  }
                }}
              >
                {/* Coming Soon Badge */}
                {role.comingSoon && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    قريباً
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-6">
                  {/* Icon */}
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                    <p className="text-sm text-purple-600 font-medium mb-3">
                      {role.subtitle}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Button */}
                  <Button
                    className={`w-full ${
                      role.comingSoon
                        ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                        : `bg-gradient-to-r ${role.color} hover:opacity-90`
                    }`}
                    size="lg"
                    disabled={role.comingSoon}
                  >
                    {role.comingSoon ? "قريباً" : "استكشف التجربة"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
