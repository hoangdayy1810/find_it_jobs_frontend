import { ISpecialization } from "@/stores/specializationStore";

const flattenSpecializations = (
  specializations: ISpecialization[],
  depth = 0,
  result: { id: string; name: string; depth: number }[] = []
): { id: string; name: string; depth: number }[] => {
  specializations.forEach((spec) => {
    // Add current specialization with its depth
    result.push({
      id: spec._id,
      name: spec.name,
      depth,
    });

    // Recursively process children if any
    if (spec.children && spec.children.length > 0) {
      flattenSpecializations(spec.children, depth + 1, result);
    }
  });

  return result;
};

export default flattenSpecializations;
