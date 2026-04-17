<template>
  <span>
    <Header />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <p class="footer">© Lumaa 2025-2026</p>
  </span>
</template>

<style>
:root {
  --brand: #437ddb;
  --header-height: 60px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #02050c;
  color: #cee5ff;
}

body :has(.unint:not(.hidden)) {
  pointer-events: none;
  user-select: none;
}

h1 {
  color: #fff;
}

pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

a {
  color: var(--brand);
  font-weight: 800;
  text-decoration: none;
}

button {
  background: var(--brand);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
}


a.circle, button.circle {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;

  background: var(--brand);
  padding: 6px;
  border-radius: 50%;
}

a.circle:hover:not(:disabled), button:hover:not(:disabled) {
  filter: brightness(0.9);
}

a.circle:disabled, button:disabled {
  background: #2a3b59;
  filter: saturate(0.6);
  cursor: not-allowed;
}

.section {
  margin: 10px 20px;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000cc;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 999;
}

.footer {
  font-size: 0.8em;
  color: #26313b;
  text-align: center;
  margin: 20px 0;
}
</style>