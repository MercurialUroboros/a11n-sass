import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "shadcn-nuxt",
    "nuxt-vue3-google-signin",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  googleSignIn: {
    clientId:
      "860651393541-ugbjudghg8g4pqattjkm8dq8rv195vsp.apps.googleusercontent.com",
  },
});
