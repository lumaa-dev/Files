<template>
    <div class="section">
        <h1>All Files</h1>
        <div class="files">
            <div v-for="file in files" :key="file.name" class="file">
                <div class="file-card">
                    <span>
                        <File color="#cee5ff" :size="26" />
                        <p class="name">{{ file.name }}</p>
                    </span>
                    <span class="unhover">
                        <p class="size">{{ file.shortSize }}</p>
                    </span>
                    <span class="hover">
                        <a class="circle" :href="`/f/${encodeURIComponent(file.name)}`" target="_blank"><Download color="#ffffff" :size="14" /></a>
                        <a class="circle" :href="`/p/${encodeURIComponent(file.name)}`" target="_blank"><Eye color="#ffffff" :size="14" /></a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.files {
    margin: 0 20vw;
    border-radius: 8px;
    background-color: #060b14;
}

.file-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    user-select: none;

    padding: 12px;
    color: #cee5ff;
    transition: background-color 0.3s ease;
    position: relative; /* needed for absolute children */
}

.file-card p:not(.name) {
    color: #26313b;
}

.file-card > span {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

/* Both swapping spans stack on top of each other, right-aligned */
.file-card > span.unhover,
.file-card > span.hover {
    position: absolute;
    right: 16px; /* match card's padding */
    transition: opacity 0.25s ease-out, transform 0.25s ease-out, visibility 0.25s;
}

/* hover span: hidden by default */
.file-card > span.hover {
    visibility: hidden;
    opacity: 0;
    transform: translateX(20px);
}

/* unhover span: visible by default */
.file-card > span.unhover {
    visibility: visible;
    opacity: 1;
}

/* on hover: swap them */
.file-card:hover > span.hover {
    visibility: visible;
    opacity: 1;
    transform: translateX(0px);
}

.file-card:hover > span.unhover {
    visibility: hidden;
    opacity: 0;
}
</style>

<script lang="ts" setup>
import { File, Eye, Download } from '@lucide/vue';

var files: { name: string; size: number; shortSize: string; modified: Date; isImage: boolean }[] = reactive([]);

const { data: res } = await useAsyncData("fileinfo", async () => {
    const response: { name: string; size: number; shortSize: string; modified: Date; isImage: boolean }[]|undefined = await $fetch<any>(`/api/files`, {
        method: 'GET'
    });
    return response;
});

if (res.value) {
    files = res.value;
}
</script>