<template>
    <div class="header">
        <NuxtLink to="/">
            <h1>Files</h1>
        </NuxtLink>
        <NuxtLink to="/upload">
            <p>Upload</p>
        </NuxtLink>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: var(--header-height);
    background-color: #00000060;
    color: #fff;
}
</style>