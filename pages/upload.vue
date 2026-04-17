<template>
    <div class="upload section">
        <h1>Upload File</h1>
        <div class="form section">
            <label for="upload">Select files</label>
            <input id="upload" type="file" name="file" required @change="checkFiles" />
            <button class="circle" type="submit" @click="sendFiles" :disabled="!hasFiles"><Upload :color="hasFiles ? '#ffffff' : '#bbbbbb'" :size="16" /></button>
        </div>
    </div>
    <Prompt v-if="!authed" :onSuccess="authenticated"/>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: row;
    gap: 10px;
    background-color: #060b14;
    border-radius: 8px;
    padding: 16px;
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
</style>

<script lang="ts" setup>
import { Upload } from '@lucide/vue';
import Prompt from '~/components/Prompt.vue';

const auth = useCookie("auth");
const authed = ref(false);
const hasFiles = ref(false);

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
    hasFiles.value = fileInput.files !== null && fileInput.files.length > 0;
}

function sendFiles() {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    } else {
        alert("Please select a file to upload.");
        return;
    }

    $fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: auth.value ? { "Authorization": auth.value } : undefined
    })
    .then(response => {
        console.log("Success:", response);

        useRouter().push("/");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("File upload failed.");
    });
}

function authenticated() {
    authed.value = true;
}
</script>