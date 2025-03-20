import { ChevronRight } from "lucide-react";

const SettingItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md transition-all hover:bg-gray-700">
    <div className="flex items-center space-x-3">
      <span className="text-gray-300">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-white font-medium">{value}</span>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  </div>
);

export default SettingItem;
