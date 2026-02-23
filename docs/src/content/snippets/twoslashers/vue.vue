<script setup>
import { onMounted, ref } from 'vue'
//                   ^?

// Reactive state.
const count = ref(0)

// Functions that mutate state and trigger updates.
function increment() {
  count.value++
}

// Lifecycle hooks.
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">
    Count is: {{ count }}
  </button>
</template>