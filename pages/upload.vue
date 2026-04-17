<template>
    <div class="upload section">
        <span class="h">
            <h1>Upload File</h1>
            <span v-if="route.query.to">
                <Folder />
                <p>{{ route.query.to }}</p>
            </span>
        </span>
        <div class="form section">
            <label for="upload">Select files</label>
            <input id="upload" type="file" name="file" multiple required @change="checkFiles" />
            <button class="circle" type="submit" @click="sendFiles" :disabled="!hasFiles || uploading">
                <Upload :color="hasFiles && !uploading ? '#ffffff' : '#bbbbbb'" :size="16" />
            </button>
        </div>
        <ul v-if="selectedFiles.length > 0" class="file-list">
            <li v-for="(file, index) in selectedFiles" :key="index" class="file-card">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatSize(file.size) }}</span>
            </li>
        </ul>
    </div>
    <Prompt v-if="!authed" :onSuccess="authenticated"/>
</template>

<style scoped>
.h, .h > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.h > h1 {
    margin-right: 20px;
}

.form {
    display: flex;
    flex-direction: row;
    gap: 10px;
    background-color: #060b14;
    border-radius: 8px;
    padding: 16px;
    margin: 20px 20vw;
}

.form button, .form label[for="upload"] {
    width: fit-content;
    height: fit-content;
    text-align: center;
    padding: 12px;
}

label[for="upload"] {
    background: var(--brand);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.8em;
}

label[for="upload"]:hover {
    filter: brightness(0.9);
}

input[type="file"] {
    display: none;
}

.file-list {
    list-style: none;
    padding: 0;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 20px 20vw;
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
    position: relative; 
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
</style>

<script lang="ts" setup>
import { Upload, Folder } from '@lucide/vue';
import Prompt from '~/components/Prompt.vue';

const auth = useCookie("auth");
const authed = ref(false);
const hasFiles = ref(false);
const uploading = ref(false);
const selectedFiles = ref<File[]>([]);

const route = useRoute();

$fetch("/api/admin", {
    method: "GET",
    headers: auth.value ? { "Authorization": auth.value } : undefined
})
.then((response) => {
    authed.value = response;
})
.catch(error => {
    console.error("Error:", error);
    alert("Error when authenticating.");
    useRouter().push("/");
});

function checkFiles() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = fileInput.files ? Array.from(fileInput.files) : [];
    selectedFiles.value = files;
    hasFiles.value = files.length > 0;
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

async function sendFiles() {
    if (selectedFiles.value.length === 0) {
        alert("Please select at least one file to upload.");
        return;
    }

    const to = route.query.to as string | undefined;
    const url = to ? `/api/upload?to=${encodeURIComponent(to)}` : "/api/upload";

    uploading.value = true;

    try {
        const formData = new FormData();
        for (const file of selectedFiles.value) {
            formData.append("files", file, file.name);
        }

        await $fetch(url, {
            method: "POST",
            body: formData,
            headers: auth.value ? { "Authorization": auth.value } : undefined
        });

        useRouter().push("/");
    } catch (error) {
        console.error("Error:", error);
        alert("File upload failed.");
    } finally {
        uploading.value = false;
    }
}

function authenticated() {
    authed.value = true;
}
</script>