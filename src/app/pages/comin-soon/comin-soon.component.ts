import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

@Component({
  selector: 'app-comin-soon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comin-soon.component.html',
  styleUrl: './comin-soon.component.scss'
})
export class CominSoonComponent implements OnInit, OnDestroy {

  releaseDate = new Date('2026-07-01T18:00:00');

  countdown: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private timerId: ReturnType<typeof setInterval> | null = null;

  email = '';
  savedEmailsCount = 0;
  sent = false;
  error = '';
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.loadSavedCount();
    this.tick();
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  private tick(): void {
    const diff = this.releaseDate.getTime() - Date.now();

    if (diff <= 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown = { days, hours, minutes, seconds };
  }

  notifyMe(): void {
    this.error = '';
    this.sent = false;

    const trimmed = this.email.trim().toLowerCase();

    if (!trimmed) {
      this.error = 'Please enter your email.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      this.error = 'Please enter a valid email.';
      return;
    }

    // ✅ For now: store locally. Later you can POST to your backend.
    const key = 'kredi_mizik_notify_emails';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as string[];

    if (!existing.includes(trimmed)) {
      existing.push(trimmed);
      localStorage.setItem(key, JSON.stringify(existing));
    }

    this.email = '';
    this.sent = true;
    this.loadSavedCount();
  }

  private loadSavedCount(): void {
    const key = 'kredi_mizik_notify_emails';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as string[];
    this.savedEmailsCount = existing.length;
  }
}
