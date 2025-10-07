import { EducationLevel } from "../schemas/education-level.schema";

export function sortEducationLevelsByPower(
  educationLevels: EducationLevel[],
  ascending: boolean = true
) {
  return educationLevels.sort((a, b) => {
    if (ascending) {
      return a.power - b.power;
    } else {
      return b.power - a.power;
    }
  });
}
