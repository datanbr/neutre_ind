import { FormStructure, FormField } from "../models/formStructures";

// Fonction pour appliquer les règles de calcul basées sur le JSON
export function calculateScoring(
  formData: FormStructure,
  submittedData: any,
): number {
  let totalScore = 0;

  formData.phases.forEach((phase) => {
    phase.modules.forEach((module) => {
      module.inputs.forEach((input: FormField) => {
        if (input.type === "FIXED_ROWS_TABLE" && input.data) {
          // Récupérer les règles de calcul pour chaque ligne du tableau
          const scoringPerLine = input.data.scoringPerLine;

          // Parcourir les lignes soumises dans submittedData
          const tableData = submittedData[input.key];

          // Vérifier que tableData contient bien des données
          if (tableData) {
            Object.keys(tableData).forEach((rowKey) => {
              const row = tableData[rowKey];
              const values =
                input.data?.columns.map((column) =>
                  parseFloat(row[column.key]),
                ) || [];

              // Vérifier que nous avons bien toutes les valeurs et que input.data n'est pas undefined
              if (input.data && values.length === input.data.columns.length) {
                // Générer une fonction de calcul dynamique
                const calculateLineScore = new Function(
                  ...input.data.columns.map((col) => col.key),
                  `return ${scoringPerLine};`,
                );

                // Exécuter la formule de calcul
                const lineScore = calculateLineScore(...values);

                // Ajouter le score de la ligne au score total
                totalScore += lineScore;
              } else {
                console.error(
                  `Mismatch entre les colonnes et les valeurs pour la ligne ${rowKey}`,
                );
              }
            });
          } else {
            console.error(
              `Tableau de données soumis pour ${input.key} est invalide ou manquant.`,
            );
          }
        }
      });
    });
  });

  return totalScore;
}
