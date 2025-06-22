<script setup>
import {
  Boxes,
  Heart,
  ScrollText,
  Shield,
  Compass,
  CreditCard,
  Store,
  Sparkles,
  Puzzle,
  Zap,
  HelpCircle,
  DollarSign,
  Megaphone,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-vue-next";

const sections = [
  {
    title: "Discover",
    links: [
      { name: "Overview", href: "#", icon: Compass },
      { name: "Pricing", href: "#", icon: CreditCard },
      { name: "Shop", href: "#", icon: Store },
      { name: "Features", href: "#", icon: Sparkles },
      { name: "Extensions", href: "#", icon: Puzzle },
      { name: "Updates", href: "#", icon: Zap },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#", icon: Boxes },
      { name: "Team", href: "#", icon: Heart },
      { name: "Blog", href: "#", icon: ScrollText },
      { name: "Careers", href: "#", icon: Sparkles },
      { name: "Contact", href: "#", icon: HelpCircle },
      { name: "Privacy", href: "#", icon: Shield },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help", href: "#", icon: HelpCircle },
      { name: "Sales", href: "#", icon: DollarSign },
      { name: "Advertising", href: "#", icon: Megaphone },
    ],
  },
  {
    title: "Social Media",
    links: [
      { name: "Twitter", href: "#", icon: Twitter },
      { name: "Instagram", href: "#", icon: Instagram },
      { name: "LinkedIn", href: "#", icon: Linkedin },
    ],
  },
];
</script>

<template>
  <section class="py-20">
    <div class="container">
      <footer>
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div class="col-span-2 mb-8 lg:mb-0">
            <div class="flex items-center space-x-2 mb-4">
              <div class="size-8 rounded-lg bg-primary/10" />
              <span class="text-xl font-bold">Brand</span>
            </div>
            <p class="font-bold">Building the future with Vue components.</p>
          </div>
          <div v-for="(section, sectionIdx) in sections" :key="sectionIdx">
            <h3 class="mb-4 font-bold">{{ section.title }}</h3>
            <ul class="space-y-4 text-muted-foreground">
              <li
                v-for="(link, linkIdx) in section.links"
                :key="linkIdx"
                class="font-medium hover:text-primary group">
                <a :href="link.href" class="flex items-center gap-2">
                  <component
                    :is="link.icon"
                    class="size-4 group-hover:opacity-100 transition-opacity" />
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
          <p>2024 Your Company. All rights reserved.</p>
          <ul class="flex gap-4">
            <li class="underline hover:text-primary">
              <a href="#" class="flex items-center gap-1">
                <ScrollText class="size-4" />
                Terms of Service
              </a>
            </li>
            <li class="underline hover:text-primary">
              <a href="#" class="flex items-center gap-1">
                <Shield class="size-4" />
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  </section>
</template>
