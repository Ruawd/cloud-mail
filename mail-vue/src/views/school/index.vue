<template>
  <div class="school-landing">
    <header class="site-header">
      <div class="container brand">
        <div class="brand-left">
          <img class="logo" src="/School Emblem.png" alt="School Emblem" />
          <div class="titles">
            <h1 class="name">Progreso University</h1>
            <p class="tagline">Along the Sava River, Serbia</p>
          </div>
        </div>
        <div class="brand-actions">
          <a class="card mini action" @click.prevent="goMail" href="#">进入邮箱</a>
          <a class="card mini action" href="https://pu.edu.rs" target="_blank" rel="noopener">学校官网</a>
          <a class="card mini action" href="https://student.frp.gs" target="_blank" rel="noopener">学生证生成</a>
        </div>
      </div>
    </header>

    <section class="hero">
      <img class="hero-image" src="/school.png" alt="School" />
      <div class="hero-overlay"></div>
      <div class="container hero-inner">
        <p class="pill">欢迎 · Welcome</p>
        <h2 class="hero-title">学校导航 School Navigation</h2>
        <p class="lead">常用入口：邮箱、学校官网、学生证生成</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import router from '@/router'
const goMail = () => router.push({ name: 'email' })
</script>

<style scoped>
:root { color-scheme: light; }

.school-landing { display: block; }

.container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 16px; }

.site-header { border-bottom: 1px solid var(--el-border-color); background: var(--el-bg-color); }
.brand { display:flex; align-items:center; justify-content: space-between; gap: 16px; padding: 16px 0; }
.brand-left { display:flex; align-items:center; gap: 12px; }
.logo { width: 56px; height: 56px; object-fit: contain; }
.titles .name { margin: 0; font-size: 20px; line-height: 1.2; }
.titles .tagline { margin: 2px 0 0; color: var(--el-text-color-secondary); font-size: 13px; }
.brand-actions { display:flex; gap: 10px; }
.card.mini.action { display:inline-block; cursor:pointer; background: rgba(255,255,255,.92); backdrop-filter: saturate(180%) blur(16px); border: 1px solid var(--el-border-color); border-radius: 12px; padding: 10px 12px; color:#222; text-decoration:none; font-weight: 600; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; white-space: nowrap; }
.card.mini.action:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,.16); border-color: rgba(0,0,0,.1); }

/* Full‑bleed hero */
.hero { position: relative; width: 100vw; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; overflow: hidden; }
.hero-image { width: 100vw; height: clamp(560px, 82vh, 920px); object-fit: cover; object-position: center; display: block; }
.hero-overlay { position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.50), rgba(0,0,0,.35)); pointer-events:none; }
.hero-inner { position: absolute; inset: 0; display:flex; flex-direction:column; justify-content:center; }
.pill { align-self:flex-start; margin-left: 16px; display:inline-block; padding: 4px 10px; border-radius: 999px; background: rgba(0,0,0,.55); color:#fff; border: 1px solid rgba(255,255,255,.5); font-size: 12px; font-weight: 600; letter-spacing: .3px; text-shadow: 0 1px 1px rgba(0,0,0,.4); }
.hero-title { margin: 10px 16px 8px; font-size: 44px; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.45); }
.lead { margin: 0 16px 18px; font-size: 16px; opacity: .95; max-width: 720px; color: #fff; }

@media (max-width: 900px) {
  .brand { flex-wrap: wrap; gap: 12px; }
  .logo { width: 44px; height: 44px; }
  .titles .name { font-size: 18px; }
  .titles .tagline { font-size: 12px; }
  .brand-actions { order: 3; width: 100%; display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 6px; }
  .card.mini.action { padding: 8px 10px; font-size: 13px; }
  .hero-title { font-size: 32px; }
}

@media (max-width: 600px) {
  .container { padding: 0 12px; }
  .brand { align-items: flex-start; }
  .hero { width: 100%; left: 0; right: 0; margin: 0; }
  .hero-image { width: 100%; height: clamp(300px, 60vh, 520px); }
  .pill { margin-left: 12px; font-size: 11px; padding: 3px 9px; }
  .hero-title { margin: 8px 12px 6px; font-size: 26px; }
  .lead { margin: 0 12px 14px; font-size: 14px; }
}
</style>
