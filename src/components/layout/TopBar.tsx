
import { Phone, Mail } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#fcdee4] text-black w-full py-2 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>+372 123 4567</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>info@leatex.ee</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>E-R 9:00-17:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
