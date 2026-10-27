import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  bx: number; by: number;
  r: number;
  g: number;
  ux: number; uy: number;
}

const GROUPS = [
  { name: 'Analyse de données', color: '#ffffff' },
  { name: 'Machine learning', color: '#7db4ff' },
  { name: 'Automatisation et LLM', color: '#2f7bff' },
];

const ROLES = [
  'Élève ingénieure Data et IA',
  'Data analyst',
  'Data scientist',
  'Automatisation et LLM',
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('field', { static: true }) private field!: ElementRef<HTMLCanvasElement>;

  grouped = false;
  typed = '';

  private ctx!: CanvasRenderingContext2D;
  private dots: Dot[] = [];
  private centers: { x: number; y: number }[] = [];
  private w = 0;
  private h = 0;
  private spread = 60;
  private labelAlpha = 0;
  private raf = 0;
  private autoTimer = 0;
  private typeTimer = 0;
  private touched = false;
  private reduce = false;
  private observer?: ResizeObserver;

  private roleIdx = 0;
  private charIdx = 0;
  private deleting = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.ctx = this.field.nativeElement.getContext('2d')!;
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    if (this.w > 0) this.makeDots();

    this.observer = new ResizeObserver(() => {
      this.resize();
      if (this.dots.length === 0 && this.w > 0) this.makeDots();
    });
    this.observer.observe(this.field.nativeElement);

    this.zone.runOutsideAngular(() => {
      this.raf = requestAnimationFrame(this.tick);
    });

    if (this.reduce) {
      this.typed = ROLES[0];
    } else {
      this.type();
      this.autoTimer = window.setTimeout(() => {
        if (!this.touched) this.grouped = true;
      }, 1400);
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.autoTimer);
    clearTimeout(this.typeTimer);
    this.observer?.disconnect();
  }

  toggle(): void {
    this.touched = true;
    clearTimeout(this.autoTimer);
    this.grouped = !this.grouped;
    if (!this.grouped) this.scatter();
  }

  // Titre qui s'écrit tout seul
  private type = (): void => {
    const full = ROLES[this.roleIdx];
    let delay = 70;
    if (!this.deleting) {
      this.charIdx++;
      this.typed = full.slice(0, this.charIdx);
      if (this.charIdx === full.length) {
        this.deleting = true;
        delay = 1600;
      }
    } else {
      this.charIdx--;
      this.typed = full.slice(0, this.charIdx);
      delay = 35;
      if (this.charIdx === 0) {
        this.deleting = false;
        this.roleIdx = (this.roleIdx + 1) % ROLES.length;
        delay = 350;
      }
    }
    this.typeTimer = window.setTimeout(this.type, delay);
  };

  private resize(): void {
    const canvas = this.field.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = rect.width;
    this.h = rect.height;
    canvas.width = Math.round(this.w * dpr);
    canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.spread = Math.max(34, Math.min(80, Math.min(this.w, this.h) * 0.13));
    this.centers = [
      { x: this.w * 0.3, y: this.h * 0.3 },
      { x: this.w * 0.7, y: this.h * 0.42 },
      { x: this.w * 0.42, y: this.h * 0.76 },
    ];
  }

  private makeDots(): void {
    this.dots = Array.from({ length: 72 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random());
      const bx = this.reduce ? 0 : (Math.random() - 0.5) * 0.5;
      const by = this.reduce ? 0 : (Math.random() - 0.5) * 0.5;
      return {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: bx, vy: by, bx, by,
        r: 3 + Math.random() * 3.5,
        g: i % 3,
        ux: Math.cos(angle) * dist,
        uy: Math.sin(angle) * dist,
      };
    });
  }

  private scatter(): void {
    for (const d of this.dots) {
      if (this.reduce) {
        d.x = Math.random() * this.w;
        d.y = Math.random() * this.h;
      } else {
        d.vx = (Math.random() - 0.5) * 7;
        d.vy = (Math.random() - 0.5) * 7;
      }
    }
  }

  private tick = (): void => {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    const ease = this.reduce ? 1 : 0.07;
    this.labelAlpha += ((this.grouped ? 1 : 0) - this.labelAlpha) * (this.reduce ? 1 : 0.08);

    for (const d of this.dots) {
      if (this.grouped) {
        const c = this.centers[d.g];
        d.x += (c.x + d.ux * this.spread - d.x) * ease;
        d.y += (c.y + d.uy * this.spread - d.y) * ease;
      } else if (!this.reduce) {
        d.vx += (d.bx - d.vx) * 0.03;
        d.vy += (d.by - d.vy) * 0.03;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -12) d.x = w + 12; else if (d.x > w + 12) d.x = -12;
        if (d.y < -12) d.y = h + 12; else if (d.y > h + 12) d.y = -12;
      }

      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#7f93bd';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = this.labelAlpha;
      ctx.fillStyle = GROUPS[d.g].color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.labelAlpha > 0.02) {
      const size = w < 420 ? 12 : 15;
      ctx.font = `700 ${size}px "Bricolage Grotesque", sans-serif`;
      ctx.textAlign = 'center';
      GROUPS.forEach((g, i) => {
        const c = this.centers[i];
        ctx.globalAlpha = this.labelAlpha * 0.4;
        ctx.strokeStyle = g.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, this.spread * 1.18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = this.labelAlpha;
        ctx.fillStyle = g.color;
        ctx.fillText(g.name, c.x, c.y - this.spread * 1.18 - 8);
      });
    }

    ctx.globalAlpha = 1;
    this.raf = requestAnimationFrame(this.tick);
  };
}