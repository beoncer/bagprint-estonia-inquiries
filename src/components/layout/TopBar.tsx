import { Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TopBarContent {
  leftText: string | null;
  middleText: string | null;
  phone: string | null;
  email: string | null;
  workingHours: string | null;
}

const fetchTopBarContent = async (): Promise<TopBarContent> => {
  const { data, error } = await supabase
    .from("website_content")
    .select("key, value")
    .eq("page", "global")
    .in("key", ["topbar_left_text", "topbar_middle_text", "topbar_phone", "topbar_email", "topbar_opening_hours"]);

  if (error) throw error;

  const content = {
    leftText: null,
    middleText: null,
    phone: null,
    email: null,
    workingHours: null
  };

  data?.forEach(item => {
    switch (item.key) {
      case "topbar_left_text":
        content.leftText = item.value;
        break;
      case "topbar_middle_text":
        content.middleText = item.value;
        break;
      case "topbar_phone":
        content.phone = item.value;
        break;
      case "topbar_email":
        content.email = item.value;
        break;
      case "topbar_opening_hours":
        content.workingHours = item.value;
        break;
    }
  });

  return content;
};

const TopBar = () => {
  const { data: topBarContent, isLoading, isError } = useQuery({
    queryKey: ['topBarContent'],
    queryFn: fetchTopBarContent,
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading || !topBarContent) {
    return (
      <div className="bg-[#f7f2f3] text-black w-full py-2 border-b">
        <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:block">
              <div className="animate-pulse bg-gray-200 h-4 w-64 rounded"></div>
            </div>
            <div className="hidden md:block">
              <div className="animate-pulse bg-gray-200 h-4 w-48 rounded"></div>
            </div>
            <div className="flex items-center justify-end w-full md:w-auto space-x-4">
              <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-40 rounded"></div>
              <div className="hidden md:block">
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f2f3] text-black w-full py-2 border-b">
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20">
        <div className="flex justify-between items-center text-sm">
          {/* Left side text */}
          <div className="hidden md:block">
            <span>{topBarContent.leftText}</span>
          </div>
          {/* Middle text */}
          <div className="hidden md:block">
            <span>{topBarContent.middleText}</span>
          </div>
          {/* Right side - contact information and opening hours */}
          <div className="flex items-center justify-end w-full md:w-auto space-x-4">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{topBarContent.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{topBarContent.email}</span>
            </div>
            <div className="hidden md:block">
              <span>{topBarContent.workingHours}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
