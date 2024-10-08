// Interface pour les colonnes du tableau
export interface FormColumn {
  key: string;
  title: string;
  type: string;
  value?: any; // Par exemple, pour des constantes comme CARBON_FACTOR
}

// Interface pour les lignes du tableau
export interface FormRow {
  key: string;
  name: string;
  values: any[]; // Les valeurs des lignes dans le tableau
}

// Interface pour les données spécifiques aux tableaux dans un formulaire
export interface FormFieldData {
  columns: FormColumn[];
  rows: FormRow[];
  scoringPerLine: string; // La formule de scoring pour chaque ligne
}

// Interface pour les pièces justificatives
export interface SupportingDocument {
  id: string;           // Identifiant unique du document
  name: string;         // Nom du document (par exemple, "Facture")
  type: string;         // Type de document (PDF, image, etc.)
  url?: string;         // URL pour accéder au document (facultatif, si déjà transmis)
  required: boolean;    // Indique si la pièce justificative est obligatoire
  description?: string; // Description du document justificatif
}

// Interface pour un champ de formulaire (input)
export interface FormField {
  key: string;
  title: string;
  type: string;
  default?: any;             // Valeur par défaut pour le champ
  values?: any[];            // Liste des valeurs possibles, utile pour les champs de type ENUM ou SELECT
  data?: FormFieldData;      // Ajouté pour les types de formulaire complexes comme les tableaux
  supportingDocuments?: SupportingDocument[];  // Liste des pièces justificatives pour ce champ
  visible?: boolean;         // Indique si le champ est visible ou non
}

// Interface pour un module de formulaire, qui regroupe plusieurs champs
export interface FormModule {
  name: string;
  description?: string;
  inputs: FormField[];  // Liste des champs de formulaire dans ce module
  scoring: string;      // Logique de scoring pour ce module
  score?: number;       // Le score calculé pour ce module (facultatif)
}

// Interface pour une phase du formulaire, qui regroupe plusieurs modules
export interface FormPhase {
  order: number;          // Ordre de la phase dans le processus
  name: string;           // Nom de la phase
  description: string;    // Description de la phase
  modules: FormModule[];  // Liste des modules inclus dans cette phase
  score?: number;         // Le score total de cette phase, calculé à partir des modules (facultatif)
}

// Interface pour les métadonnées de la structure du formulaire
export interface Metadata {
  type: string;         // Type de service ou produit
  category: string;     // Catégorie de service ou produit
  subCategory: string;  // Sous-catégorie de service ou produit
}

// Interface pour la structure globale du formulaire
export interface FormStructure {
  metadata: Metadata;     // Métadonnées du formulaire
  scoringElements: string[]; // Eléments utilisés pour le scoring (par exemple, CARBON)
  phases: FormPhase[];    // Liste des phases dans la structure du formulaire
  score?: number;         // Score total de la structure, calculé à partir des phases (facultatif)
  explanation?: string;   // Explication pour les acheteurs expliquant pourquoi ces éléments environnementaux ont été choisis
  number?: string;        // Numéro correspondant à un numéro d'Appel d'offres ou à une référence produit
  description?: string;   // Description de l'Appel d'offres ou du produit
  name?: string;          // Nom de l'Appel d'offres ou du produit
}