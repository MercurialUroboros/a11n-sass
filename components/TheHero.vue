<script setup>
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, Play, Zap, Shield, Palette } from "lucide-vue-next";
</script>

<template>
  <section
    class="relative w-full flex items-center bg-white py-5 md:py-12 lg:py-20">
    <div class="container mx-auto px-5 md:px-10">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Digital Background"
          class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gray-900/80"></div>
      </div>

      <div class="relative flex flex-col lg:flex-row items-center gap-20">
        <!-- Left Content -->
        <div class="flex flex-col justify-center space-y-10 flex-1">
          <div class="space-y-4">
            <div
              class="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
              <Rocket class="mr-2 h-4 w-4" />
              Launch Your Project
            </div>
            <h1
              class="text-4xl font-bold tracking-tighter text-white sm:text-5xl xl:text-7xl/none">
              Create
              <span
                class="bg-gradient-to-r from-sky-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
                Beautiful
              </span>
              Digital Experiences
            </h1>
            <p class="max-w-[600px] text-gray-200 md:text-xl">
              Transform your ideas into reality with our powerful design tools
              and expert guidance. Start building your dream project today.
            </p>
          </div>
          <div class="flex flex-col gap-2 min-[400px]:flex-row">
            <Button class="bg-white text-gray-900 hover:bg-gray-100">
              <Sparkles class="mr-2 h-4 w-4" />
              Get Started
            </Button>
            <Button class="border border-white/20 text-white hover:bg-white/10">
              <Play class="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div
              class="flex items-center space-x-4 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div
                class="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Zap class="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <h3 class="text-white">Lightning Fast</h3>
              </div>
            </div>
            <div
              class="flex items-center space-x-4 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div
                class="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Shield class="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 class="text-white">Secure by Default</h3>
              </div>
            </div>
            <div
              class="flex items-center space-x-4 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div
                class="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Palette class="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 class="text-white">Easy to customize</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div class="flex-1 relative">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div class="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
                  alt="Coding"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </div>
              <div class="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop"
                  alt="Design"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div class="space-y-4 mt-8">
              <div class="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                  alt="Analytics"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </div>
              <div class="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop"
                  alt="Technology"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
