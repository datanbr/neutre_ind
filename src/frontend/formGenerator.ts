import { FormStructure } from "../models/formStructures";
import * as fs from "fs";

// Charger le fichier JSON pour la personnalisation
const formData = fs.readFileSync("./src/data/formData.json", "utf-8");
const formStructure: FormStructure = JSON.parse(formData);

// Fonction pour générer le formulaire HTML
export function generateForm(formStructure: FormStructure): string {
  let formHtml = '<form action="/submit" method="POST">'; // Le formulaire avec la méthode POST

  formStructure.phases.forEach((phase) => {
    formHtml += `<h2>${phase.name}</h2><p>${phase.description}</p>`;

    phase.modules.forEach((module) => {
      formHtml += `<h3>${module.name}</h3><p>${module.description}</p>`;

      module.inputs.forEach((input) => {
        if (input.type === "FIXED_ROWS_TABLE") {
          formHtml += generateTable(input);
        } else {
          formHtml += generateInputField(input);
        }
      });
    });
  });

  formHtml += `<button type="submit">Envoyer</button></form>`; // Ajouter un bouton pour soumettre le formulaire
  return formHtml;
}

// Fonction pour générer une table HTML interactive avec des champs modifiables
function generateTable(input: any): string {
  let tableHtml = `<table border="1"><tr>`;

  // Générer les colonnes du tableau
  input.data.columns.forEach((column: any) => {
    tableHtml += `<th>${column.title}</th>`;
  });
  tableHtml += `</tr>`;

  // Générer les lignes du tableau avec des champs d'entrée modifiables
  input.data.rows.forEach((row: any, rowIndex: number) => {
    tableHtml += `<tr>`;
    row.values.forEach((value: any, colIndex: number) => {
      const columnKey = input.data.columns[colIndex].key;
      // Chaque input a un name unique avec rowIndex et colIndex pour identifier la cellule lors de la soumission
      tableHtml += `<td><input type="text" name="${input.key}[${rowIndex}][${columnKey}]" value="${value}" /></td>`;
    });
    tableHtml += `</tr>`;
  });

  tableHtml += `</table>`;
  return tableHtml;
}

// Fonction pour générer un champ d'entrée simple
function generateInputField(input: any): string {
  return `<label>${input.title}</label><input type="${input.type}" name="${input.key}" /><br>`;
}
