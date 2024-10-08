import {
  FormStructure,
  Metadata,
  FormPhase,
  FormModule,
  FormField,
  FormFieldData,
  FormColumn,
  FormRow,
} from "../models/formStructures"; // Assurez-vous que formStructures.ts est importé

// Fonction pour générer un objet FormStructure à partir des données du formulaire
export function generateFormStructure(formData: any): FormStructure {
  // 1. Générer les métadonnées
  const metadata: Metadata = {
    type: formData.type,
    category: formData.category,
    subCategory: formData.subCategory,
  };

  // 2. Colonnes du tableau
  const columns: FormColumn[] = [
    { key: "COLUMN_1", title: "Colonne 1", type: "NUMBER" },
    { key: "COLUMN_2", title: "Colonne 2", type: "NUMBER" },
    {
      key: "CARBON_FACTOR",
      title: "Facteur carbone (gCO2eq/km)",
      type: "CONSTANT",
      value: 100,
    },
  ];

  // 3. Lignes du tableau (données fixes pour l'exemple)
  const rows: FormRow[] = [
    { key: "ROW_1", name: "Ligne 1", values: [1, 500, 100] },
    { key: "ROW_2", name: "Ligne 2", values: [2, 300, 100] },
  ];

  // 4. Données spécifiques au tableau
  const formFieldData: FormFieldData = {
    columns,
    rows,
    scoringPerLine: "COLUMN_1 * COLUMN_2 * CARBON_FACTOR",
  };

  // 5. Champs du formulaire
  const formField: FormField = {
    key: "TABLE_INPUT",
    title: "Tableau de test",
    type: "FIXED_ROWS_TABLE",
    data: formFieldData,
  };

  // 6. Modules de formulaire
  const formModule: FormModule = {
    name: formData.moduleName,
    description: formData.moduleDescription,
    inputs: [formField],
    scoring: "TABLE_INPUT",
  };

  // 7. Phases du formulaire
  const formPhase: FormPhase = {
    order: 1,
    name: formData.phaseName,
    description: formData.phaseDescription,
    modules: [formModule],
  };

  // 8. Générer la structure globale du formulaire
  const formStructure: FormStructure = {
    metadata,
    scoringElements: ["CARBON"],
    phases: [formPhase],
  };

  return formStructure;
}
