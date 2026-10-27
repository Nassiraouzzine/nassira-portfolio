import { Component } from '@angular/core';

interface Skill {
  name: string;
  icon?: string;     // nom de l'icône Devicon, si elle existe
  invert?: boolean;  // pour les logos noirs, à éclaircir sur fond sombre
}

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  skills: Skill[] = [
    { name: 'Python', icon: 'python' },
    { name: 'SQL' },
    { name: 'Java', icon: 'java' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'C/C++', icon: 'cplusplus' },
    { name: 'pandas', icon: 'pandas' },
    { name: 'NumPy', icon: 'numpy' },
    { name: 'scikit-learn', icon: 'scikitlearn' },
    { name: 'XGBoost' },
    { name: 'TensorFlow', icon: 'tensorflow' },
    { name: 'Keras' },
    { name: 'PyTorch', icon: 'pytorch' },
    { name: 'NLP et BERT' },
    { name: 'LLM' },
    { name: 'dbt' },
    { name: 'DuckDB' },
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'MySQL', icon: 'mysql' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'n8n' },
    { name: 'Streamlit' },
    { name: 'Docker', icon: 'docker' },
  ];

  tools: Skill[] = [
    { name: 'Windows' },
    { name: 'Linux', icon: 'linux' },
    { name: 'VS Code', icon: 'vscode' },
    { name: 'Jupyter', icon: 'jupyter' },
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github', invert: true },
    { name: 'GitHub Actions' },
    { name: 'Tableau' },
    { name: 'Power BI' },
    { name: 'Excel' },
    { name: 'LM Studio' },
  ];

  iconUrl(icon: string): string {
    return `${DEVICON}${icon}/${icon}-original.svg`;
  }

  // Si un logo n'existe pas, on le cache : la pastille garde son texte.
  hide(e: Event): void {
    (e.target as HTMLElement).style.display = 'none';
  }
}