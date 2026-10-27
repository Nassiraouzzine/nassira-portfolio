import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  github = 'https://github.com/Nassiraouzzine';
  linkedin = 'https://www.linkedin.com/in/nassira-ouzzine-30611a2a7/';
  email = 'ouzzine.nassira@outlook.com';
}