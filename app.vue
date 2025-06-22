<script setup lang="ts">
import VanishingInput from "./components/ui/vanishing-input/VanishingInput.vue";
import { LoaderCircle } from "lucide-vue-next";
const inputValue = ref("http://localhost:5174/");

const showResults = ref(false);
const pending = ref(false);

const { data, execute } = await useLazyFetch("/api/audit", {
  immediate: false, // don't fetch right away
  query: {
    url: inputValue.value, // your audit target
  },
});

const handleSubmit = async () => {
  pending.value = true;
  await execute();
  showResults.value = true;
  pending.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center h-full w-full justify-center">
    <TheHeader />
    <div class="grow">
      <TheHero />
      <TheFeatures />

      <div v-if="pending">
        <LoaderCircle class="animate-spin" />
      </div>

      <div
        v-if="!pending && showResults"
        class="container mx-auto overflow-x-auto rounded-lg shadow-md mt-6 mb-6">
        <table class="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead
            class="bg-gray-100 text-xs uppercase tracking-wider text-gray-600 border-b">
            <tr>
              <th class="px-4 py-3">Check</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(result, index) in data?.results"
              :key="index"
              class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ result.check }}
              </td>
              <td
                class="px-4 py-3 font-semibold"
                :class="
                  result.status.startsWith('✅')
                    ? 'text-green-600'
                    : 'text-red-600'
                ">
                {{ result.status }}
              </td>
              <td class="px-4 py-3">
                <ul
                  v-if="result.details?.length"
                  class="list-disc list-inside text-xs space-y-1 text-gray-600">
                  <li v-for="(detail, i) in result.details" :key="i">
                    <code class="break-all">{{ detail }}</code>
                  </li>
                </ul>
                <span v-else class="text-gray-400 italic text-sm">
                  No details
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <VanishingInput
        v-model="inputValue"
        :placeholders="['Is your website accessible?']"
        @submit="handleSubmit" />
    </div>
    <TheFooter />
  </div>
</template>
