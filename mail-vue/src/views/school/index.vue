<template>
  <main class="school-page">
    <section class="school-hero" aria-label="Pannonian University portal">
      <picture class="hero-media">
        <img src="/pannonian-campus-hero.webp" alt="Pannonian University campus in Novi Sad" />
      </picture>
      <div class="hero-shade" aria-hidden="true"></div>

      <div class="hero-shell">
        <nav class="portal-nav" aria-label="Pannonian University portal links">
          <a class="brand-lockup" href="https://pu.edu.rs" target="_blank" rel="noopener">
            <img src="/pannonian-mark.svg" alt="Pannonian University mark" />
            <span>
              <strong>Pannonian University</strong>
              <small>pu.edu.rs</small>
            </span>
          </a>
          <div class="nav-actions">
            <button type="button" @click="goMail">
              <Icon icon="mdi:email-outline" width="19" height="19" />
              <span>Mailbox</span>
            </button>
            <a href="https://pu.edu.rs" target="_blank" rel="noopener">
              <Icon icon="mdi:web" width="19" height="19" />
              <span>Website</span>
            </a>
          </div>
        </nav>

        <div class="hero-content">
          <p class="eyebrow">Official university mail portal</p>
          <h1>Pannonian University</h1>
          <p class="hero-lead">
            A secure access point for PU mail, student services, admissions contact, and the public university website.
          </p>
          <div class="hero-actions">
            <button class="primary-action" type="button" @click="goMail">
              <Icon icon="mdi:mailbox-outline" width="20" height="20" />
              <span>Enter mailbox</span>
            </button>
            <a class="secondary-action" href="https://pu.edu.rs" target="_blank" rel="noopener">
              <Icon icon="mdi:open-in-new" width="20" height="20" />
              <span>Open pu.edu.rs</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="portal-band" aria-label="Pannonian University quick links">
      <div class="portal-grid">
        <a class="portal-card" href="mailto:admissions@pu.edu.rs">
          <Icon icon="mdi:account-school-outline" width="24" height="24" />
          <span>Admissions</span>
          <strong>admissions@pu.edu.rs</strong>
        </a>
        <a class="portal-card" href="mailto:registrar@pu.edu.rs">
          <Icon icon="mdi:file-document-outline" width="24" height="24" />
          <span>Registrar</span>
          <strong>registrar@pu.edu.rs</strong>
        </a>
        <a class="portal-card" href="mailto:research@pu.edu.rs">
          <Icon icon="mdi:chart-timeline-variant" width="24" height="24" />
          <span>Research</span>
          <strong>research@pu.edu.rs</strong>
        </a>
        <button class="portal-card" type="button" @click="goMail">
          <Icon icon="mdi:shield-key-outline" width="24" height="24" />
          <span>Identity</span>
          <strong>Use your PU mailbox</strong>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import router from '@/router'
import {Icon} from '@iconify/vue'

const goMail = () => router.push('/inbox')
</script>

<style scoped>
.school-page {
  min-height: 100dvh;
  background: #f6f1e8;
  color: #202326;
}

.school-hero {
  position: relative;
  min-height: 72dvh;
  overflow: hidden;
}

.hero-media,
.hero-media img,
.hero-shade {
  position: absolute;
  inset: 0;
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-shade {
  background:
    linear-gradient(90deg, rgba(12, 33, 31, 0.76), rgba(12, 33, 31, 0.38) 48%, rgba(12, 33, 31, 0.14)),
    linear-gradient(180deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.32));
}

.hero-shell {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 1180px);
  min-height: 72dvh;
  display: grid;
  grid-template-rows: auto 1fr;
  margin: 0 auto;
  padding: 1rem 0 4.2rem;
}

.portal-nav {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-lockup,
.nav-actions,
.nav-actions a,
.nav-actions button,
.hero-actions,
.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
}

.brand-lockup {
  gap: 0.75rem;
  color: #fffdf8;
  text-decoration: none;
}

.brand-lockup img {
  width: 52px;
  height: 52px;
}

.brand-lockup strong,
.brand-lockup small {
  display: block;
}

.brand-lockup strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.18rem;
}

.brand-lockup small {
  margin-top: 0.1rem;
  color: rgba(255, 253, 248, 0.78);
}

.nav-actions {
  gap: 0.65rem;
}

.nav-actions a,
.nav-actions button,
.primary-action,
.secondary-action {
  min-height: 44px;
  justify-content: center;
  gap: 0.45rem;
  border: 1px solid rgba(255, 253, 248, 0.32);
  border-radius: 8px;
  padding: 0.72rem 0.9rem;
  color: #fffdf8;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}

.nav-actions a,
.nav-actions button,
.secondary-action {
  background: rgba(255, 253, 248, 0.12);
  backdrop-filter: blur(12px);
}

.nav-actions a:hover,
.nav-actions button:hover,
.primary-action:hover,
.secondary-action:hover,
.portal-card:hover {
  transform: translateY(-2px);
}

.hero-content {
  align-self: end;
  max-width: 720px;
  padding-bottom: 1rem;
}

.eyebrow {
  margin: 0 0 0.8rem;
  color: #d8b660;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0 0 1rem;
  color: #fffdf8;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3rem, 8vw, 5.7rem);
  line-height: 0.98;
  letter-spacing: 0;
}

.hero-lead {
  max-width: 620px;
  margin: 0;
  color: rgba(255, 253, 248, 0.88);
  font-size: 1.18rem;
  line-height: 1.65;
}

.hero-actions {
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.primary-action {
  background: #8f3a2f;
  border-color: #8f3a2f;
}

.secondary-action {
  color: #fffdf8;
}

.portal-band {
  width: min(100% - 2rem, 1180px);
  margin: -3.2rem auto 0;
  padding-bottom: 3.5rem;
  position: relative;
  z-index: 2;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.portal-card {
  min-height: 132px;
  display: grid;
  align-content: space-between;
  gap: 0.7rem;
  border: 1px solid rgba(31, 111, 100, 0.16);
  border-radius: 8px;
  padding: 1rem;
  background: rgba(255, 253, 248, 0.92);
  color: #202326;
  box-shadow: 0 16px 34px rgba(32, 35, 38, 0.12);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.portal-card svg {
  color: #1f6f64;
}

.portal-card span {
  color: #8f3a2f;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.portal-card strong {
  color: #123f39;
  line-height: 1.32;
  overflow-wrap: anywhere;
}

@media (max-width: 900px) {
  .portal-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .portal-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .hero-shell,
  .portal-band {
    width: min(100% - 1.2rem, 1180px);
  }

  .school-hero,
  .hero-shell {
    min-height: 76dvh;
  }

  .nav-actions,
  .hero-actions,
  .primary-action,
  .secondary-action {
    width: 100%;
  }

  .nav-actions a,
  .nav-actions button {
    flex: 1;
  }

  .hero-lead {
    font-size: 1rem;
  }

  .portal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
