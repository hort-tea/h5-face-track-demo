<template>
    <pageState :type="type"></pageState>
</template>
<script setup>
const route = useRoute();
const query = route.query;
const type = query.type;
</script>
