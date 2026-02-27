<template>
  <div ref="mindmapContainer" id="mindmap-container"></div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import MindMap from '../mide/index'
const mindmapContainer = ref<HTMLDivElement>()
onMounted(() => {
  const mindmap = new MindMap(mindmapContainer.value || document.body)
  mindmap.addNode('Node 1')
  console.log(mindmap.toJson())
})
</script>
