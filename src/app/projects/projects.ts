import { Component, ElementRef, ViewChild } from '@angular/core';

interface Project {
  id: string;        // nom du dossier des captures : public/projets/<id>/
  kind: string;
  title: string;
  text: string;
  result: string;    // laisse '' s'il n'y a pas de chiffre
  role: string;
  tags: string[];
  github: string;
  files: string[];
  docs: { label: string; file: string }[];   // noms exacts des fichiers dans public/projets/<id>/  // nombre de captures déposées (1.png, 2.png, ...)
}


type ProjectView = Project & { images: string[] };

const GITHUB = 'https://github.com/Nassiraouzzine';

const PROJECTS: Project[] = [
  {
    id: 'veille',
    kind: 'Stage chez Value IT, 2026',
    title: 'Veille concurrentielle automatisée par IA',
    text: 'Un formulaire lance un workflow n8n : une recherche par concurrent, l’analyse de chaque article par un modèle de langage, le filtrage des articles non pertinents, puis un rapport HTML envoyé par e-mail et archivé dans Google Sheets.',
    result: '',
    role: 'Réalisé pendant mon stage de l’été 2026.',
    tags: ['n8n', 'LLM', 'Perplexity', 'DeepSeek', 'Gmail', 'Google Sheets'],
    github: GITHUB + '/Veille-Concurrentielle-n8n',
    files: ['1.jpeg', '2.jpeg', '3.jpeg', '4.JPG'],
    docs: [],
  },
  {
    id: 'vols',
    kind: 'Projet académique, équipe de 6',
    title: 'Prédiction des retards de vols',
    text: 'Comparaison de quatre modèles de classification : régression logistique, Random Forest, SVM et XGBoost. Optimisation par GridSearchCV, puis évaluation avec les courbes ROC et PR, la matrice de confusion et le ROC-AUC.',
    result: 'Meilleur modèle : XGBoost, ROC-AUC de 0,93 sur trois classes (accuracy de 0,89 sur 52 559 vols de test).',
    role: 'Ma part : la partie machine learning, en binôme.',
    tags: ['Python', 'scikit-learn', 'XGBoost', 'GridSearchCV'],
    github: GITHUB + '/Projet_Prediction-Retards-Vols',
    files: ['1.JPG', '2.JPG', '3.JPG'],
    docs: [{ label: 'Présentation du projet (ML et DL)', file: 'documents/presentation-retards-vols.pdf' }],
  },
  {
    id: 'rfm',
    kind: 'Projet académique, équipe de 5',
    title: 'Comprendre le comportement des clients e-commerce',
    text: 'Analyse du tunnel de conversion et des paniers abandonnés, segmentation RFM et estimation de la valeur vie client (CLV). Un ETL prépare les couches Bronze et Silver, puis dbt et DuckDB construisent la couche Gold, visualisée sous Tableau.',
    result: '',
    role: 'Ma part : le traitement des données (ETL et dbt) et le dashboard Tableau.',
    tags: ['SQL', 'dbt', 'DuckDB', 'Tableau'],
    github: GITHUB + '/Projet_Analyse-Funnel-RFM-CLV-Ecommerce',
    files: ['1.png', '2.jpeg', '3.jpeg', '4.jpeg'],
    docs: [{ label: 'Rapport du projet', file: 'documents/rapport-ecommerce.pdf' }],
  },
];

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  @ViewChild('viewerDialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;

  projects: ProjectView[] = PROJECTS.map((p) => ({
    ...p,
    images: p.files.map((f) => `projets/${p.id}/${f}`),
  }));

  viewer: { p: ProjectView; i: number } | null = null;

  open(p: ProjectView): void {
    this.viewer = { p, i: 0 };
    this.dialog.nativeElement.showModal();
  }

  close(): void {
    this.dialog.nativeElement.close();
  }

  step(d: number): void {
    if (!this.viewer) return;
    const n = this.viewer.p.images.length;
    this.viewer.i = (this.viewer.i + d + n) % n;
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }

  onBackdrop(e: MouseEvent): void {
    if (e.target === this.dialog.nativeElement) this.close();
  }
}