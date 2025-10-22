import SignCanvasPlus from 'sign-canvas-plus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SignCanvasPlus)
})