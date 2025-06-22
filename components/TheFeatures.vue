<script setup lang="ts">
import {
  Rocket,
  Sparkles,
  ShieldCheck,
  Users,
  PiggyBank,
  HeartHandshake,
} from "lucide-vue-next";

const features = [
  {
    title: "Fast Performance",
    description:
      "Optimized Vue 3 components for lightning-fast loading times. Our components are designed for maximum speed and efficiency.",
    icon: Rocket,
  },
  {
    title: "Innovative Solutions",
    description:
      "Modern technologies and advanced features. We integrate the latest developments for future-proof applications.",
    icon: Sparkles,
  },
  {
    title: "Highest Quality",
    description:
      "Carefully tested and optimized code. Each component undergoes rigorous quality controls for maximum reliability.",
    icon: ShieldCheck,
  },
  {
    title: "User-Friendly",
    description:
      "Intuitive operation and accessible design. Our components are easy to understand and use for all users.",
    icon: Users,
  },
  {
    title: "Cost-Effective",
    description:
      "Fair prices for first-class quality. Save time and resources with our pre-built, optimized components.",
    icon: PiggyBank,
  },
  {
    title: "Personal Support",
    description:
      "Dedicated support for all questions. Our team is here to help you - fast, competent, and reliable.",
    icon: HeartHandshake,
  },
];
</script>

<template>
  <section
    class="relative w-full flex items-center bg-white py-8 md:py-16 lg:py-24">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 max-w-3xl mx-auto">
        <p class="text-sm font-medium text-primary mb-4">Core Features</p>
        <h2 class="text-4xl font-bold tracking-tighter sm:text-5xl">
          Our Core
          <span class="text-primary">Competencies</span>
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Discover the powerful features that make our platform stand out from
          the rest
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
        <div
          v-for="(feature, idx) in features"
          :key="idx"
          class="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
          <!-- Icon Container -->
          <div class="mb-6">
            <div
              class="inline-flex items-center justify-center size-14 rounded-xl bg-primary/10 group-hover:bg-primary transition-colors duration-300">
              <component
                :is="feature.icon"
                class="size-7 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
          </div>

          <!-- Content -->
          <div>
            <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
            <p class="text-muted-foreground">{{ feature.description }}</p>
          </div>

          <!-- Hover Effect Line -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </section>
</template>
