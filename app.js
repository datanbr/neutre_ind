const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Importer la fonction de génération de formulaire depuis formGenerator
const { generateForm } = require("./dist/frontend/formGenerator");

// Importer la fonction de calcul depuis calculationEngine
const { calculateScoring } = require("./dist/backend/calculationEngine");

const app = express();
const port = 3000;

// Middleware pour analyser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Charger le fichier JSON pour les règles de calcul
const formDataPath = path.join(__dirname, "./src/data/formData.json");

// Route pour servir le formulaire dynamique
app.get("/", (req, res) => {
  try {
    const formData = fs.readFileSync(formDataPath, "utf-8");
    const formStructure = JSON.parse(formData);

    // Générer le formulaire HTML à partir de formStructure
    const formHtml = generateForm(formStructure);

    // Envoyer le formulaire HTML au client
    const completeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Formulaire Dynamique</title>
      </head>
      <body>
        ${formHtml}
      </body>
      </html>
    `;

    res.send(completeHtml);
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res
      .status(500)
      .send("Erreur lors de la lecture des données du formulaire.");
  }
});

// Route pour traiter la soumission du formulaire
app.post("/submit", (req, res) => {
  const submittedData = req.body;

  // Charger la structure de formulaire pour calculer les scores
  const formData = fs.readFileSync(formDataPath, "utf-8");
  const formStructure = JSON.parse(formData);

  // Calculer le score
  const score = calculateScoring(formStructure, submittedData);

  let responseHtml = `
    <html>
      <head>
        <title>Formulaire reçu et calculé</title>
      </head>
      <body>
        <h1>Les données soumises</h1>
        <ul>
  `;

  Object.keys(submittedData).forEach((key) => {
    const value = submittedData[key];
    responseHtml += `<li>${key}: ${JSON.stringify(value)}</li>`;
  });

  responseHtml += `
        </ul>
        <h2>Résultat des calculs : ${score} (gCO2eq)</h2>
        <a href="/">Retourner au formulaire</a>
      </body>
    </html>
  `;

  res.send(responseHtml);
});

// Route pour servir un formulaire HTML afin de générer un fichier JSON
app.get("/generate-form-json", (req, res) => {
  const formHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Générer un fichier JSON</title>
      </head>
      <body>
        <h1>Générer un fichier JSON</h1>
        <form action="/generate-json" method="POST">
          <label>Type:</label>
          <input type="text" name="type" required /><br><br>

          <label>Catégorie:</label>
          <input type="text" name="category" required /><br><br>

          <label>Sous-catégorie:</label>
          <input type="text" name="subCategory" required /><br><br>

          <label>Nom de la phase:</label>
          <input type="text" name="phaseName" required /><br><br>

          <label>Description de la phase:</label>
          <input type="text" name="phaseDescription" required /><br><br>

          <label>Nom du module:</label>
          <input type="text" name="moduleName" required /><br><br>

          <label>Description du module:</label>
          <input type="text" name="moduleDescription" required /><br><br>

          <button type="submit">Générer le fichier JSON</button>
        </form>
      </body>
    </html>
  `;
  res.send(formHtml);
});

// Route pour traiter la génération du fichier JSON
app.post("/generate-json", (req, res) => {
  const formData = req.body;

  // Générer la structure JSON basée sur les données soumises
  const formStructure = generateFormStructure(formData);

  // Sauvegarder le fichier JSON
  const filename = "generatedFormStructure.json";
  fs.writeFileSync(filename, JSON.stringify(formStructure, null, 2), "utf-8");

  res.send(`<p>Fichier JSON généré avec succès : <a href="/${filename}">Télécharger le fichier</a></p>`);
});

// Fonction pour générer un objet FormStructure à partir des données du formulaire
function generateFormStructure(formData) {
  // Métadonnées
  const metadata = {
    type: formData.type,
    category: formData.category,
    subCategory: formData.subCategory,
  };

  // Colonnes (un exemple simple pour la démonstration)
  const columns = [
    { key: "COLUMN_1", title: "Colonne 1", type: "NUMBER" },
    { key: "COLUMN_2", title: "Colonne 2", type: "NUMBER" },
    { key: "CARBON_FACTOR", title: "Facteur carbone", type: "CONSTANT", value: 100 },
  ];

  // Lignes (données fixes pour l'exemple)
  const rows = [
    { key: "ROW_1", name: "Ligne 1", values: [1, 500, 100] },
    { key: "ROW_2", name: "Ligne 2", values: [2, 300, 100] },
  ];

  // Scoring pour chaque ligne
  const formFieldData = {
    columns,
    rows,
    scoringPerLine: "COLUMN_1 * COLUMN_2 * CARBON_FACTOR",
  };

  // Champs du formulaire
  const formField = {
    key: "TABLE_INPUT",
    title: "Tableau de test",
    type: "FIXED_ROWS_TABLE",
    data: formFieldData,
  };

  // Modules
  const formModule = {
    name: formData.moduleName,
    description: formData.moduleDescription,
    inputs: [formField],
    scoring: "TABLE_INPUT",
  };

  // Phases
  const formPhase = {
    order: 1,
    name: formData.phaseName,
    description: formData.phaseDescription,
    modules: [formModule],
  };

  // Structure globale du formulaire
  return {
    metadata,
    scoringElements: ["CARBON"],
    phases: [formPhase],
  };
}

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
