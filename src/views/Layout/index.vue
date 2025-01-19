<template>
    <LayoutSticky />
    <LayoutStatus />
    <LayoutHeader />
    <LayoutNav />
    <RouterView />
    <LayoutFooter />
</template>

<script setup>
import LayoutSticky from './components/LayoutSticky.vue'
import LayoutStatus from './components/LayoutStatus.vue'
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
</script>

<style lang="scss" scoped></style>
