<template>
    <div class="upload section">
        <h1>Upload File</h1>
        <div class="form section">
            <label for="upload">Upload files</label>
            <input id="upload" type="file" name="file" required />
            <button type="submit" @click="sendFiles">Upload</button>
        </div>
    </div>
    <Prompt v-if="!authed" :onSuccess="authenticated"/>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #2c2c2c;
    border-radius: 8px;
    padding: 16px;
}

.form button, .form label[for="upload"] {
    width: fit-content;
    text-align: center;
}

label[for="upload"] {
    background: var(--brand);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
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
import Prompt from '~/components/Prompt.vue';

const auth = useCookie("auth");
const authed = ref(false);

$fetch("/api/admin", {
    method: "GET",
    headers: {
        "Authorization": auth.value
    }
})
.then((response) => {
    authed.value = response;
})
.catch(error => {
    console.error("Error:", error);
    alert("Error when authenticating.");
    useRouter().push("/");
});

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
        headers: {
            "Authorization": auth.value
        }
    })
    .then(response => {
        console.log("Success:", response);

        let path: string = Array.isArray(response) ? "/" : `/${response["name"]}`;
        useRouter().push(path);
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