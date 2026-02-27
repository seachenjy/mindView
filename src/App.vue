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
  mindmap.addNode('Node 2')
  mindmap.addNode('Node 3')
  console.log(mindmap.toJson())
})
</script>
