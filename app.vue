<script setup lang="ts">
import VanishingInput from "./components/ui/vanishing-input/VanishingInput.vue";

const inputValue = ref("http://localhost:5174/");

const { data, execute, pending } = await useFetch("/api/audit", {
  immediate: false, // don't fetch right away
  query: {
    url: inputValue.value, // your audit target
  },
});

const handleSubmit = async () => {
  await execute();
  console.log(data.value);
};
</script>

<template>
  <div class="flex flex-col items-center h-full w-full justify-center">
    <TheHeader />
    <div class="grow">
      <TheHero />
      <TheFeatures />
      Pending: {{ pending }}

      <span>{{ data }}</span>
      <VanishingInput
        v-model="inputValue"
        :placeholders="['Is your website accessible?']"
        @submit="handleSubmit" />
    </div>
    <TheFooter />
  </div>
</template>
