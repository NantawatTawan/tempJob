import { useState } from "react";
import { Theme } from "../schemas/theme.schema";
import ThemeCardForAdmin from "./ThemeCardForAdmin";
import EditThemeModal from "./EditThemeModal";
import Pagination from "@/shared/components/ui/pagination";
import { usePagination } from "@/shared/hooks/usePagination";

interface IThemeListForAdminProps {
  themes: Theme[];
  onRefresh: () => void;
}

const ThemeListForAdmin = ({ themes, onRefresh }: IThemeListForAdminProps) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  return (
    <>
      {selectedTheme && (
        <EditThemeModal
          theme={selectedTheme}
          isOpen={Boolean(selectedTheme)}
          onClose={() => setSelectedTheme(null)}
          onRefresh={onRefresh}
        />
      )}
      <div className="grid grid-cols-3 gap-6">
        {themes.map((theme) => (
          <ThemeCardForAdmin
            key={theme.id}
            theme={theme}
            onSelectThemeToEdit={setSelectedTheme}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </>
  );
};

export default ThemeListForAdmin;
