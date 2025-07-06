<template>
  <span>
    <Header />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <p class="footer">© Lumaa 2025</p>
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
  background: #1e1e1e;
  color: #fff;
}

body :has(.unint:not(.hidden)) {
  pointer-events: none;
  user-select: none;
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
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
}

button:hover {
  filter: brightness(0.9);
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
  color: #ffffff33;
  text-align: center;
  margin: 20px 0;
}
</style>