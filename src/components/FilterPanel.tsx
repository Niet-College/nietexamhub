import { FilterOptions } from "@/types/examPaper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useExamPapers } from "@/hooks/useExamPapers";
import { useMode } from "@/contexts/ModeContext";

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const FilterPanel = ({ filters, onFilterChange, onClearFilters }: FilterPanelProps) => {
  const { availableSemesters, availableFaculty, availableUnits } = useExamPapers();
  const { mode } = useMode();

  const handleSemesterChange = (semester: string) => {
    onFilterChange({
      ...filters,
      semester: semester === "All" ? null : semester,
      subject: "All", // Reset subject when semester changes
    });
  };

  // Exam mode: Semester + Exam Type
  // PPT mode: Semester + Faculty + Unit
  const gridCols = mode === "exam"
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-1 sm:grid-cols-3";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full bg-background border border-border rounded-xl p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 text-sm text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className={`grid ${gridCols} gap-4`}>
        {/* Semester Filter — shown in both modes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Semester</label>
          <Select
            value={filters.semester || "All"}
            onValueChange={handleSemesterChange}
          >
            <SelectTrigger className="border-border rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Semesters</SelectItem>
              {availableSemesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Exam mode: Type Filter */}
        {mode === "exam" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Exam Type</label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFilterChange({ ...filters, type: value })}
            >
              <SelectTrigger className="border-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="cop">COP</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* PPT mode: Faculty Filter */}
        {mode === "ppt" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Faculty</label>
            <Select
              value={filters.faculty}
              onValueChange={(value) => onFilterChange({ ...filters, faculty: value })}
            >
              <SelectTrigger className="border-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Faculty</SelectItem>
                {availableFaculty.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* PPT mode: Unit Filter */}
        {mode === "ppt" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Unit</label>
            <Select
              value={filters.unit}
              onValueChange={(value) => onFilterChange({ ...filters, unit: value })}
            >
              <SelectTrigger className="border-border rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FilterPanel;
