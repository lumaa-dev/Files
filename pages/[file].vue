<template>
    <div v-if="file.size > -1" class="file">
        <div class="info section">
            <p class="name">{{ file.name }}</p>
            <div class="list">
                <p>{{ file.shortSize }}</p>
                <a :href="`/api/${file.name}`" download="" target="_blank">Download</a>
            </div>
        </div>
        <div class="content section">
            <button @click="readFile" v-if="!file.isImage">Read File</button>
            <img :src="`/api/${file.name}`" :alt=file.name v-if="file.isImage"/>
            <p v-if="readingError">Couldn't read the file, download the file to read.</p>
        </div>
    </div>
    <div v-else class="loading unint">
        <p>Loading</p>
    </div>
</template>

<style scoped>
.section {
    background-color: #2c2c2c;
    border-radius: 8px;
    padding: 16px;
}

.file .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.file .info .list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
}

.file .info .list p {
    color: #aaaaaa70;
}

.file .name {
    font-size: 1.4em;
    font-weight: 900;
}

.file .content > img, .file .content svg {
    max-width: calc(100vw - 52px);
    height: auto;
    border-radius: 8px;
}

.file .content:has(img), .file .content:has(svg) {
    display: flex;
    justify-content: center;
}
</style>

<script lang="ts" setup>
import fs from "fs"

var file = reactive({ name: "unknown_file", size: -1, shortSize: "-1 bytes", modified: new Date(), isImage: false, isVideo: false });
var readingError = ref(false);

const route = useRoute()

if (route.query.raw == "true") {
    navigateTo(`/api/${route.params.file}`);
}

const { data: res } = await useAsyncData("fileinfo-" + route.params.file, async () => {
    const response: { name: string; size: number; shortSize: string; modified: Date; isImage: boolean, isVideo: boolean }|undefined = await $fetch<any>(`/api/${route.params.file}/info`, {
        method: 'GET'
    });
    return response;
});

if (res.value) {
    file = res.value;

    const event = useRequestEvent()
    if (event) {
        const req = event.node.req
        const res = event.node.res

        const ua = req.headers['user-agent'] || ''
        const isBot = /bot|crawl|spider|slurp|archive|search/i.test(ua)
        if (isBot && (file.isImage || file.isVideo)) {
            try {
                let filePath = `./userfiles/${file.name}`
                const media = fs.readFileSync(filePath);
                if (file.isVideo) {
                    const fileSize = fs.statSync(filePath).size;

                    res.writeHead(200, {    
                        'Content-Length': fileSize,
                    });
                }
                res.end(media)
            } catch (error) {
                console.error(error);
                res.statusCode = 404;
                res.end('File not found');
            }
        } else {
            useSeoMeta({
                title: file.name,
                description: `${file.shortSize}`,
                ogTitle: file.name,
                ogDescription: `${file.shortSize}`,
                ogSiteName: "Files",
                twitterTitle: file.name,
                twitterDescription: `${file.shortSize}`,
                articlePublishedTime: new Date(file.modified).toISOString()
            })
        }
    }
}

async function readFile() {
    if (file.isImage) {
        let img = document.createElement("img")
        img.src = `/api/${route.params.file}`
        img.alt = file.name

        if (document.querySelector('.content')) {
            document.querySelector('.content')!.append(img);
        } else {
            console.error("Couldn't add img element to .content");
        }
        // image
    } else {
        const { data: res }: any = await useAsyncData("filecontent" + route.params.file, async () => {
            const response: any = await $fetch<any>(`/api/${route.params.file}`, {
                method: 'GET'
            });
            return response;
        })
        
        if (isPlainTextContent(res.value)) {
            if (file.name.endsWith("svg")) {
                document.querySelector('.content')!.innerHTML = `${res.value}`;

                let svg: HTMLElement|null = document.querySelector('.content svg');
                if (svg) {
                    let sw = svg.getAttribute("width");
                    let sh = svg.getAttribute("height");

                    if (sw && sh) {
                        svg.setAttribute("viewBox", `0 0 ${sw} ${sh}`);

                        svg.removeAttribute("width");
                        svg.removeAttribute("height");

                        svg.style.width = `100%`;
                        svg.style.height = `auto`;
                    }
                }
            } else {
                let pre = document.createElement("pre")
                pre.innerText = res.value

                document.querySelector('.content')!.appendChild(pre);
            }
        } else {
            let iframe = document.createElement("iframe")
            iframe.style.width = `100%`;
            iframe.style.height = `70vh`;
            iframe.src = `/api/${route.params.file}`

            document.querySelector('.content')!.appendChild(iframe);

            iframe.onerror = () => {
                readingError.value = true;
                iframe.remove()
            };

            // window.open(`http://localhost:3000/api/${route.params.file}`,'_blank');
        }
    }

    document.querySelector(".content button")?.remove();
}

function isPlainTextContent(content: string|null): boolean {
  if (!content) return false;
  
  const length = content.length
  if (length === 0) return true

  let suspicious = 0
  const maxScan = Math.min(length, 512)

  for (let i = 0; i < maxScan; i++) {
    const charCode = content.charCodeAt(i)

    // NULL character is a strong sign of binary
    if (charCode === 0x00) return false

    // Control characters outside common whitespace
    if (
      charCode < 7 ||
      (charCode > 13 && charCode < 32) ||
      charCode > 127 // likely binary if lots of high ASCII
    ) {
      suspicious++
      if (suspicious / maxScan > 0.1) return false
    }
  }

  return true
}
</script>