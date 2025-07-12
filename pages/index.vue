<template>
    <div class="section">
        <h1>All Files</h1>
        <div class="files">
            <div v-for="file in files" :key="file.name" class="file">
                <NuxtLink :to="`/${encodeURIComponent(file.name)}`">
                    <div class="file-card">
                        <p class="name">{{ file.name }}</p>
                        <span>
                            <p class="size">{{ file.shortSize }}</p>
                            <p class="modified">{{ new Date(file.modified).toLocaleString() }}</p>
                        </span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.file-card {
    background-color: #2c2c2c;
    border-radius: 8px;
    padding: 16px;
    margin: 8px 0;
    color: #fff;
    transition: background-color 0.3s ease;
}

.file-card :not(.name) {
    font-size: 0.9em;
    color: #aaaaaa70;
    font-weight: 500;
}
</style>

<script lang="ts" setup>
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