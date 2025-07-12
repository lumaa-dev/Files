<template>
    <div class="section md">
        <ContentRenderer :value="page" />
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { data: page } = await useAsyncData(route.path + "-md", () => queryCollection("content").path(route.path).first());
</script>