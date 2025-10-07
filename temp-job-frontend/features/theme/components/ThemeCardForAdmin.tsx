import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Theme } from "../schemas/theme.schema";
import { themeService } from "../services/theme.service";

interface IThemeCardForAdminProps {
  theme: Theme;
  onSelectThemeToEdit: (theme: Theme) => void;
  onRefresh: () => void;
}

const ThemeCardForAdmin = ({
  theme,
  onSelectThemeToEdit,
  onRefresh,
}: IThemeCardForAdminProps) => {
  const { name, price, image_url, description, is_active } = theme;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  async function handleDeleteTheme() {
    try {
      const { isConfirmed } = await showConfirmationAlert(
        "ยืนยันการลบธีม",
        "คุณแน่ใจที่จะลบธีมนี้หรือไม่?"
      );

      if (!isConfirmed) return;

      setIsDeleting(true);

      await themeService.deleteThemeByThemeId(theme.id);

      showSuccessAlert("ลบธีมเรียบร้อย");

      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleThemeStatus() {
    try {
      setIsTogglingStatus(true);

      await themeService.updateTheme(theme.id, {
        is_active: !is_active,
      });

      showSuccessAlert(
        `ธีมถูก${is_active ? "ปิดใช้งาน" : "เปิดใช้งาน"}เรียบร้อย`
      );

      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsTogglingStatus(false);
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-50">
        <Image
          className="w-full h-full object-contain"
          src={image_url ?? "/placeholder-image.png"}
          alt={name}
          width={200}
          height={200}
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">
              {is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
            </span>
            <Switch
              checked={is_active}
              onCheckedChange={handleToggleThemeStatus}
              disabled={isTogglingStatus}
              className={
                isTogglingStatus ? "opacity-50 cursor-not-allowed" : ""
              }
              aria-label={is_active ? "ปิดใช้งานธีม" : "เปิดใช้งานธีม"}
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 h-10">
              {description || "ไม่มีคำอธิบาย"}
            </p>
            <p className="text-emerald-600 font-medium mt-1">
              ฿{price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="text-sm text-emerald-700 border-emerald-200 hover:bg-emerald-50 flex-1"
            onClick={() => onSelectThemeToEdit(theme)}
            startIcon={<Edit className="h-4 w-4" />}
          >
            แก้ไข
          </Button>
          <Button
            variant="destructive"
            className="text-sm text-white flex-1"
            onClick={handleDeleteTheme}
            loading={isDeleting}
            startIcon={<Trash className="h-4 w-4" />}
          >
            ลบ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCardForAdmin;
