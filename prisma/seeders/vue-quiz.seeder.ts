import { PrismaClient } from '@prisma/client';

export interface VueQuizQuestionSeed {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const VUE_100_QUIZ_BANK: VueQuizQuestionSeed[] = [
  // =========================================================================
  // SECTION 1: VUE 3.5 FUNDAMENTALS & SETUP (101 - 115)
  // =========================================================================
  {
    id: 101,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'How do you create and mount a modern Vue 3 application instance in main.ts?',
    codeSnippet: `// Option comparison:\n1. new Vue({ el: '#app', render: h => h(App) });\n2. const app = createApp(App); app.use(router).use(pinia).mount('#app');`,
    options: [
      'new Vue({ el: "#app" }) using the Vue 2 constructor.',
      'createApp(App).use(router).use(pinia).mount("#app") using the createApp factory.',
      'mountApplication("#app", App).',
      'ReactDOM.createRoot(document.getElementById("app")).render(<App />).'
    ],
    correctIndex: 1,
    explanation: 'Vue 3 applications use createApp(RootComponent) to create an isolated application context before mounting plugins and DOM targets.'
  },
  {
    id: 102,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'What is the primary advantage of `<script setup>` in Single File Components (SFCs)?',
    options: [
      'It compiles components to WebAssembly.',
      'It provides concise syntax where top-level bindings (variables, functions, imports) are automatically exposed to the template without manual return statements.',
      'It eliminates the need for CSS.',
      'It disables TypeScript checking.'
    ],
    correctIndex: 1,
    explanation: '<script setup> is the recommended compile-time syntactic sugar for Composition API inside SFCs, eliminating boilerplate return objects.'
  },
  {
    id: 103,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'In Vue 3.5, what major improvement was added to `defineProps`?',
    codeSnippet: `// Vue 3.5 syntax:\nconst { count = 0, title = 'Default' } = defineProps<{ count?: number; title?: string }>();\n// Is count reactive when parent updates?`,
    options: [
      'Reactive Props Destructuring is now natively supported; destructured variables retain reactivity and support default values without withDefaults().',
      'defineProps was removed from Vue 3.5.',
      'Props must now be written as global variables.',
      'Destructuring props causes a compile error in Vue 3.5.'
    ],
    correctIndex: 0,
    explanation: 'Vue 3.5 introduces stable Reactive Props Destructure, allowing direct destructuring with default values while maintaining full reactivity.'
  },
  {
    id: 104,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'How do you declare component options (like `inheritAttrs: false` or component name) inside `<script setup>` in Vue 3.3+?',
    codeSnippet: `<script setup lang="ts">\ndefineOptions({\n  name: 'CustomModal',\n  inheritAttrs: false\n});\n</script>`,
    options: [
      'Use the `defineOptions()` macro directly inside `<script setup>`.',
      'Create a second separate `<script>` block with `export default { ... }`.',
      'Pass options into createApp().',
      'Set options on window.Vue.'
    ],
    correctIndex: 0,
    explanation: 'defineOptions() allows declaring component metadata (name, inheritAttrs) directly within <script setup> without extra script blocks.'
  },
  {
    id: 105,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'How do you provide a reactive dependency from an ancestor component to deeply nested descendants using provide/inject?',
    codeSnippet: `// In Ancestor:\nconst activeTheme = ref('dark');\nprovide('theme', activeTheme);\n\n// In Descendant:\nconst theme = inject<Ref<string>>('theme', ref('light'));`,
    options: [
      'provide(key, refValue) in ancestor and inject(key, defaultValue) in descendant.',
      'Pass props down through 10 intermediate components manually.',
      'Save the value in a global window variable.',
      'Use document.querySelector.'
    ],
    correctIndex: 0,
    explanation: 'provide/inject allows dependency injection across the component tree without prop-drilling, preserving reactivity when passing refs.'
  },
  {
    id: 106,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the modern Vue 3.5 way to create a template ref for a DOM element without magic string matching?',
    codeSnippet: `<script setup lang="ts">\nimport { useTemplateRef, onMounted } from 'vue';\n\nconst inputRef = useTemplateRef<HTMLInputElement>('mainInput');\nonMounted(() => inputRef.value?.focus());\n</script>\n<template>\n  <input ref="mainInput" type="text" />\n</template>`,
    options: [
      'Use `useTemplateRef("mainInput")` introduced in Vue 3.5 for typed, robust template ref binding.',
      'Use `document.getElementById("mainInput")`.',
      'Use `this.$refs.mainInput`.',
      'Template refs are deprecated in Vue 3.'
    ],
    correctIndex: 0,
    explanation: 'Vue 3.5 introduces useTemplateRef() which cleanly decouples variable naming from the ref attribute string in templates.'
  },
  {
    id: 107,
    category: 'FUNDAMENTALS',
    difficulty: 'ADVANCED',
    question: 'How do you register a cleanup callback when a component or composable unmounts or effect scope disposes?',
    codeSnippet: `import { onUnmounted, onScopeDispose } from 'vue';\n\n// Inside a custom composable:\nonScopeDispose(() => {\n  window.removeEventListener('resize', handleResize);\n});`,
    options: [
      'Use `onScopeDispose()` in composables or `onUnmounted()` inside component setup.',
      'Rely on browser garbage collection without cleanup.',
      'Call window.location.reload().',
      'Use setTimeout.'
    ],
    correctIndex: 0,
    explanation: 'onScopeDispose() registers cleanup callbacks that fire when the active effect scope (or component instance) is disposed.'
  },
  {
    id: 108,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'How do you bind dynamic classes `:class` conditionally in a Vue template?',
    options: [
      '`<div :class="{ \'bg-primary\': isActive, \'opacity-50\': isDisabled }">`',
      '`<div class="isActive ? bg-primary : \'\'">`',
      '`<div (class)="isActive">`',
      '`<div [class]="isActive">`'
    ],
    correctIndex: 0,
    explanation: '`:class="{ className: condition }"` evaluates truthiness to add or remove classes dynamically.'
  },
  {
    id: 109,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the purpose of `<slot>` fallback content in a reusable Card component?',
    codeSnippet: `<div class="card-footer">\n  <slot name="actions">\n    <button class="btn-default">Close</button>\n  </slot>\n</div>`,
    options: [
      'It renders `<button class="btn-default">Close</button>` only if the parent component does NOT provide content for the `actions` slot.',
      'It hides the slot completely.',
      'It creates an error if slot is empty.',
      'It runs on server side only.'
    ],
    correctIndex: 0,
    explanation: 'Slot fallback content is displayed as a default whenever the consumer component does not pass any elements to that slot.'
  },
  {
    id: 110,
    category: 'FUNDAMENTALS',
    difficulty: 'ADVANCED',
    question: 'How do you pass data from a child component back up to the parent slot template (Scoped Slots)?',
    codeSnippet: `<!-- Child Component List.vue -->\n<li v-for="item in items" :key="item.id">\n  <slot :item="item" :index="index" />\n</li>\n\n<!-- Parent Consumer -->\n<List :items="products" v-slot="{ item, index }">\n  <span>{{ index }}: {{ item.name }}</span>\n</List>`,
    options: [
      'Bind props on the `<slot :item="item">` tag and consume via `v-slot="{ item }"` in the parent.',
      'Emit an event on every mouseover.',
      'Store data in local storage.',
      'Scoped slots are not supported in Vue 3.'
    ],
    correctIndex: 0,
    explanation: 'Scoped slots allow child components to pass data into the parent slot render scope using slot props.'
  },
  {
    id: 111,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'How do you define typed emitted events in `<script setup>` using TypeScript?',
    codeSnippet: `const emit = defineEmits<{\n  (e: 'change', value: string): void;\n  (e: 'delete', id: number): void;\n}>();`,
    options: [
      'Using type-based `defineEmits<{ (e: eventName, ...args): returnType }>()`.',
      'Using `this.$emit()` inside template.',
      'Declaring `new EventEmitter()`.',
      'Creating global CustomEvent.'
    ],
    correctIndex: 0,
    explanation: 'defineEmits<T>() provides compile-time type checking and IDE autocomplete for emitted component events.'
  },
  {
    id: 112,
    category: 'FUNDAMENTALS',
    difficulty: 'ADVANCED',
    question: 'What is an `EffectScope` in Vue 3 and why is it used in libraries like VueUse and Pinia?',
    options: [
      'An API (`effectScope()`) that groups reactive effects and computed signals together so they can be disposed of in a single `.stop()` call.',
      'A CSS styling container.',
      'A WebGL rendering context.',
      'A tool to bundle npm modules.'
    ],
    correctIndex: 0,
    explanation: 'EffectScope allows capturing and bulk-disposing of all reactive effects created during a composable or store lifecycle.'
  },
  {
    id: 113,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'What happens when you pass an object with reactive getters to `defineProps` with defaults in Vue 3.5?',
    options: [
      'Defaults are evaluated lazily only when the prop is undefined, preserving full reactivity.',
      'The component crashes on mount.',
      'The prop becomes non-reactive.',
      'Default props cannot be used with TypeScript.'
    ],
    correctIndex: 0,
    explanation: 'Vue 3.5 compiler converts destructured default prop values into lazy getters that preserve reactivity.'
  },
  {
    id: 114,
    category: 'FUNDAMENTALS',
    difficulty: 'EXPERT',
    question: 'How do you configure CSS Modules or Scoped CSS inside a Vue 3 SFC?',
    options: [
      '`<style scoped>` isolates styles to the component via data attributes (`data-v-xxx`), while `<style module>` exposes a `$style` class object.',
      'CSS cannot be written inside Vue SFCs.',
      'You must write all CSS in JavaScript objects.',
      'By using inline style attributes on every tag.'
    ],
    correctIndex: 0,
    explanation: '<style scoped> scopes CSS via unique post-processed attributes, whereas <style module> generates unique hash classes.'
  },
  {
    id: 115,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'What directive is used for two-way data binding on form inputs in Vue?',
    options: [
      '`v-model="username"`',
      '`[(ngModel)]="username"`',
      '`bind:value="username"`',
      '`v-bind:input="username"`'
    ],
    correctIndex: 0,
    explanation: 'v-model provides two-way data binding, combining value prop binding with input event listeners.'
  },

  // =========================================================================
  // SECTION 2: VUE 3.5 REACTIVITY & STATE MANAGEMENT (116 - 130)
  // =========================================================================
  {
    id: 116,
    category: 'REACTIVITY',
    difficulty: 'INTERMEDIATE',
    question: 'You have a product list ref `products` and a search filter ref `searchQuery`. How do you compute the live filtered list?',
    codeSnippet: `const products = ref<Product[]>([]);\nconst searchQuery = ref('');\n\n// How to declare filteredProducts?\nconst filteredProducts = computed(() => {\n  const q = searchQuery.value.toLowerCase();\n  return products.value.filter(p => p.name.toLowerCase().includes(q));\n});`,
    options: [
      'Use `computed(() => ...)` which tracks both refs and caches the result until dependencies change.',
      'Use a method called in the template on every re-render.',
      'Use `watchEffect` to mutate a third global variable.',
      'Use `reactive(products.value.filter(...))`.'
    ],
    correctIndex: 0,
    explanation: 'computed() derives state with automatic dependency tracking and lazy memoized caching.'
  },
  {
    id: 117,
    category: 'REACTIVITY',
    difficulty: 'INTERMEDIATE',
    question: 'What is the difference between `ref()` and `reactive()` in Vue 3?',
    options: [
      'ref() holds primitives or objects accessed via `.value` (auto-unwrapped in templates); reactive() only accepts objects/arrays and provides deep proxying without `.value`.',
      'ref() is deprecated; reactive() is the only API in Vue 3.5.',
      'reactive() works with numbers and strings; ref() does not.',
      'There is no difference.'
    ],
    correctIndex: 0,
    explanation: 'ref wraps any value in a RefImpl container with .value, whereas reactive() wraps objects directly in JavaScript Proxies.'
  },
  {
    id: 118,
    category: 'REACTIVITY',
    difficulty: 'ADVANCED',
    question: 'What happens if you destructure properties from a `reactive()` object without `toRefs()`?',
    codeSnippet: `const state = reactive({ count: 0, name: 'Alice' });\nconst { count, name } = state;\n// If state.count++ is called, does count update?`,
    options: [
      'Reactivity is LOST because destructuring extracts plain primitive values from the Proxy; use `toRefs(state)` to maintain reactivity.',
      'Reactivity is preserved automatically.',
      'JavaScript throws a TypeError.',
      'The browser reloads.'
    ],
    correctIndex: 0,
    explanation: 'Destructuring a reactive() object copies plain primitives. Wrapping with toRefs(state) turns each property into a reactive ref.'
  },
  {
    id: 119,
    category: 'REACTIVITY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you perform a side-effect (e.g. fetching API data) immediately on mount AND whenever `userId` changes using `watchEffect`?',
    codeSnippet: `const userId = ref('123');\nwatchEffect(async () => {\n  const data = await fetchUserData(userId.value);\n  userProfile.value = data;\n});`,
    options: [
      'Use `watchEffect(callback)` which runs immediately on setup and automatically tracks any reactive ref accessed inside it.',
      'Use `onMounted()` with a 500ms setInterval loop.',
      'Use `watch(userId, callback)` without immediate option.',
      'watchEffect cannot run asynchronous code.'
    ],
    correctIndex: 0,
    explanation: 'watchEffect runs immediately and automatically tracks all reactive dependencies read synchronously during execution.'
  },
  {
    id: 120,
    category: 'REACTIVITY',
    difficulty: 'ADVANCED',
    question: 'How do you create a custom two-way bound component prop using `defineModel()` in Vue 3.4+ / 3.5?',
    codeSnippet: `<!-- Child: Counter.vue -->\n<script setup lang="ts">\nconst count = defineModel<number>({ default: 0 });\n</script>\n<template>\n  <button @click="count++">Count: {{ count }}</button>\n</template>\n\n<!-- Parent Usage: -->\n<Counter v-model="parentCount" />`,
    options: [
      'Declare `const model = defineModel<T>()` in the child component; it automatically syncs with `v-model` in the parent.',
      'Declare @Input() and @Output() EventEmitter.',
      'Use global Pinia store for all two-way bindings.',
      'defineModel was removed in Vue 3.5.'
    ],
    correctIndex: 0,
    explanation: 'defineModel() simplifies two-way binding by declaring a ref that auto-synchronizes with the parent component v-model.'
  },
  {
    id: 121,
    category: 'REACTIVITY',
    difficulty: 'ADVANCED',
    question: 'What is `shallowRef()` and when should you use it for performance optimization?',
    codeSnippet: `// Example: Storing a massive GeoJSON dataset or Monocle editor instance\nconst chartInstance = shallowRef(null);`,
    options: [
      'It creates a ref that only tracks `.value` reassignment without deeply converting nested object properties into reactive proxies.',
      'It creates a ref that cannot hold numbers.',
      'It saves data into session storage.',
      'It runs only on mobile browsers.'
    ],
    correctIndex: 0,
    explanation: 'shallowRef avoids deep reactive proxy overhead for large immutable datasets or external library instances (e.g. Three.js, Leaflet).'
  },
  {
    id: 122,
    category: 'REACTIVITY',
    difficulty: 'ADVANCED',
    question: 'How do you force a `shallowRef` to notify its watchers after mutating a nested property in-place?',
    codeSnippet: `const largeList = shallowRef(['A', 'B']);\nlargeList.value.push('C');\n// How to trigger reactivity?\ntriggerRef(largeList);`,
    options: [
      'Call `triggerRef(largeList)` to explicitly notify dependents.',
      'Recreate the entire browser window.',
      'shallowRef cannot be updated.',
      'Call largeList.update().'
    ],
    correctIndex: 0,
    explanation: 'triggerRef(ref) forces dependent effects and computed properties of a shallowRef to re-evaluate.'
  },
  {
    id: 123,
    category: 'REACTIVITY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you watch a specific property inside an object using `watch()` without triggering on unrelated properties?',
    codeSnippet: `const user = reactive({ id: 1, profile: { name: 'Alex', age: 28 } });\n\n// How to watch only user.profile.name?\nwatch(() => user.profile.name, (newName, oldName) => {\n  console.log(\`Name changed from \${oldName} to \${newName}\`);\n});`,
    options: [
      'Pass a getter function `() => user.profile.name` as the first argument to `watch()`.',
      'Pass the string `"user.profile.name"`.',
      'Pass `user.profile.name` directly as a bare value.',
      'Use `watchObject()`.'
    ],
    correctIndex: 0,
    explanation: 'Passing a getter function (() => target) allows watch to track only the returned value with surgical precision.'
  },
  {
    id: 124,
    category: 'REACTIVITY',
    difficulty: 'EXPERT',
    question: 'Why does mutating a reactive state variable directly inside a `computed()` getter violate Vue architecture?',
    options: [
      'Computed getters must remain pure derivations of state without side-effects to prevent infinite reactive evaluation loops.',
      'JavaScript restricts assignments inside arrow functions.',
      'It triggers an immediate database lock.',
      'Computed getters only run on the server.'
    ],
    correctIndex: 0,
    explanation: 'Computed properties should be pure side-effect-free calculations. Side effects belong in watchers or event listeners.'
  },
  {
    id: 125,
    category: 'REACTIVITY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you access the previous value of a ref inside `watch()`?',
    codeSnippet: `const count = ref(0);\nwatch(count, (newVal, oldVal) => {\n  console.log(\`Count changed from \${oldVal} to \${newVal}\`);\n});`,
    options: [
      'The watch callback receives `(newValue, oldValue)` as its arguments.',
      'You must manually store the old value in a separate variable.',
      'Previous values are not accessible in Vue 3.',
      'Read `count.previous`.'
    ],
    correctIndex: 0,
    explanation: 'watch callbacks provide both the current new value and the previous old value.'
  },
  {
    id: 126,
    category: 'REACTIVITY',
    difficulty: 'ADVANCED',
    question: 'What is the `flush: "post"` option in `watch()` or `watchEffect()` used for?',
    options: [
      'It delays the watcher callback until AFTER the component DOM has updated and re-rendered.',
      'It sends an HTTP POST request automatically.',
      'It clears component memory.',
      'It runs the watcher before setup.'
    ],
    correctIndex: 0,
    explanation: 'flush: "post" (or watchPostEffect) ensures the watcher executes after DOM patches so you can read updated element sizes/refs.'
  },
  {
    id: 127,
    category: 'REACTIVITY',
    difficulty: 'BEGINNER',
    question: 'How do you update a ref `const count = ref(0)` inside a `<script setup>` function?',
    options: [
      '`count.value++`',
      '`count++`',
      '`count.set(1)`',
      '`count = 1`'
    ],
    correctIndex: 0,
    explanation: 'In JavaScript/TypeScript code, refs must be accessed and mutated via their `.value` property (in templates, .value is auto-unwrapped).'
  },
  {
    id: 128,
    category: 'REACTIVITY',
    difficulty: 'ADVANCED',
    question: 'What is the purpose of `toRef()` in Vue 3.3+ / 3.5?',
    codeSnippet: `// Extracting a reactive ref from an optional prop:\nconst titleRef = toRef(props, 'title');\n// Or normalizing a value/getter/ref into a Ref:\nconst normalized = toRef(() => props.foo + props.bar);`,
    options: [
      'It converts a property, getter, or existing ref into a normalized reactive Ref object.',
      'It converts a ref to a string.',
      'It deletes a ref.',
      'It stores data in IndexedDB.'
    ],
    correctIndex: 0,
    explanation: 'toRef() normalizes values, getters, or object properties into reactive refs, ideal for composable arguments.'
  },
  {
    id: 129,
    category: 'REACTIVITY',
    difficulty: 'EXPERT',
    question: 'In Vue 3.5, how does the reactivity engine achieve up to 56% faster memory performance compared to Vue 3.4?',
    options: [
      'A complete rewrite of the dependency tracking engine using doubly-linked list nodes and bitwise versioning, eliminating memory bloat during deep state shifts.',
      'By removing TypeScript support.',
      'By switching to React under the hood.',
      'By disabling watchers.'
    ],
    correctIndex: 0,
    explanation: 'Vue 3.5 revamped its reactivity system with optimized doubly-linked graph nodes, reducing memory overhead and speeding up dependency tracking.'
  },
  {
    id: 130,
    category: 'REACTIVITY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you create a writable computed property that supports both getting and setting?',
    codeSnippet: `const firstName = ref('John');\nconst lastName = ref('Doe');\n\nconst fullName = computed({\n  get: () => \`\${firstName.value} \${lastName.value}\`,\n  set: (newVal) => {\n    [firstName.value, lastName.value] = newVal.split(' ');\n  }\n});`,
    options: [
      'Pass an object with `get()` and `set()` functions into `computed({ get, set })`.',
      'Pass two arrow functions into computed(fn1, fn2).',
      'Writable computed properties are not possible in Vue.',
      'Use a watch instead.'
    ],
    correctIndex: 0,
    explanation: 'computed({ get, set }) creates a writable computed ref with getter and setter handlers.'
  },

  // =========================================================================
  // SECTION 3: ARCHITECTURE, COMPOSABLES & PINIA (131 - 145)
  // =========================================================================
  {
    id: 131,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What naming and design convention defines a clean Vue 3 Composable function?',
    options: [
      'Named starting with `useXxx` (e.g. `useCart`, `useAuth`), encapsulates reactive state and methods, and returns a plain object of refs/functions.',
      'Named `handleXxx` and returns a class instance.',
      'Must inherit from VueComposable base class.',
      'Must be placed in the public/ folder.'
    ],
    correctIndex: 0,
    explanation: 'Composables follow the useCamelCase convention, encapsulating stateful logic and returning reactive state and action handlers.'
  },
  {
    id: 132,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'In Feature-Atomic Architecture (FAOS), can `src/features/users/` directly import components from `src/features/posts/`?',
    options: [
      'No! Features must remain isolated; shared logic or presentational components must be located in `src/shared/` or `src/core/`.',
      'Yes, relative cross-imports across any features are encouraged.',
      'Only if approved in package.json.',
      'Only on Fridays.'
    ],
    correctIndex: 0,
    explanation: 'FAOS enforces strict feature isolation to prevent circular dependencies and allow independent feature refactoring or removal.'
  },
  {
    id: 133,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the recommended modern syntax for defining a Pinia store in Vue 3?',
    codeSnippet: `export const useAuthStore = defineStore('auth', () => {\n  const user = ref<User | null>(null);\n  const isAuthenticated = computed(() => !!user.value);\n  function login(userData: User) { user.value = userData; }\n  return { user, isAuthenticated, login };\n});`,
    options: [
      'Setup Stores using `defineStore("id", () => { ... })` with Composition API refs, computeds, and functions.',
      'Options Stores using mutations and actions from Vuex 3.',
      'Global window variables.',
      'Redux reducers.'
    ],
    correctIndex: 0,
    explanation: 'Setup Stores in Pinia mirror the Composition API structure, providing full TypeScript inference and composable ergonomics.'
  },
  {
    id: 134,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you destructure reactive state and getters from a Pinia store without losing reactivity?',
    codeSnippet: `const authStore = useAuthStore();\n// How to destructure user and isAuthenticated?\nconst { user, isAuthenticated } = storeToRefs(authStore);\nconst { login } = authStore; // actions can be destructured directly`,
    options: [
      'Use `storeToRefs(store)` for state and getters; destructure actions directly from the store.',
      'Directly destructure `const { user } = authStore;` without helper.',
      'Pinia stores cannot be destructured.',
      'Use JSON.parse.'
    ],
    correctIndex: 0,
    explanation: 'storeToRefs() wraps store state and getters into individual refs, preserving reactivity upon destructuring.'
  },
  {
    id: 135,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the distinction between Container (Smart) and Presentational (Dumb) components in Vue?',
    options: [
      'Container views handle routing, state stores, and API calls; Presentational components receive props via defineProps and emit events via defineEmits.',
      'Smart components use CSS; Dumb components do not.',
      'Smart components are written in JSX; Dumb components in HTML.',
      'There is no distinction in Vue.'
    ],
    correctIndex: 0,
    explanation: 'Separating smart container views from reusable dumb UI components maximizes UI testability, portability, and storybook development.'
  },
  {
    id: 136,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'You want a composable `useLocalStorage(key, defaultValue)` that automatically synchronizes a reactive ref with window.localStorage. What does it return?',
    codeSnippet: `export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {\n  const data = ref<T>(loadStored() ?? initialValue) as Ref<T>;\n  watch(data, (newVal) => localStorage.setItem(key, JSON.stringify(newVal)), { deep: true });\n  return data;\n}`,
    options: [
      'A reactive `Ref<T>` that updates localStorage on write and updates memory when read.',
      'A Promise.',
      'A string only.',
      'A Vue directive.'
    ],
    correctIndex: 0,
    explanation: 'Custom composables return refs that abstract browser APIs seamlessly behind standard reactive interfaces.'
  },
  {
    id: 137,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'Where should application-wide singleton services (like Axios/Fetch HTTP client and token storage) be placed?',
    options: [
      '`/src/shared/api/` or `/src/core/`',
      '`/src/features/`',
      '`/public/`',
      '`/node_modules/`'
    ],
    correctIndex: 0,
    explanation: 'Core networking, authentication token handlers, and global infrastructure belong in shared or core layers.'
  },
  {
    id: 138,
    category: 'ARCHITECTURE',
    difficulty: 'EXPERT',
    question: 'How do you design a high-performance DataGrid in Vue 3 that renders 20,000 rows without crashing the browser DOM?',
    options: [
      'Implement Virtual Scrolling (e.g. `vue-virtual-scroller` or custom virtual list) to render only the visible viewport elements.',
      'Render 20,000 `<tr v-for>` tags directly.',
      'Convert the table to a PNG image.',
      'Set `display: none` on 19,980 rows.'
    ],
    correctIndex: 0,
    explanation: 'Virtual scrolling dynamically calculates scroll offsets and renders only the ~30 DOM rows visible in the viewport.'
  },
  {
    id: 139,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you implement an empty state fallback when rendering a list in Vue?',
    codeSnippet: `<template>\n  <div v-if="items.length > 0" class="grid">\n    <ProductCard v-for="item in items" :key="item.id" :product="item" />\n  </div>\n  <div v-else class="empty-state">No products found.</div>\n</template>`,
    options: [
      'Use `v-if="items.length > 0"` on the list container and `v-else` on the empty state placeholder.',
      'Use `v-empty` directive.',
      'Write an alert box.',
      'Leave the screen blank.'
    ],
    correctIndex: 0,
    explanation: 'v-if / v-else conditionally renders the list or the fallback empty state card cleanly.'
  },
  {
    id: 140,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'How do you implement a global Toast / Notification system in Vue 3?',
    options: [
      'A Pinia toast store managing an array of active toast objects, rendered by a top-level `<ToastContainer />` in App.vue.',
      'Using `window.alert()` popups everywhere.',
      'Creating 50 separate modal components on every page.',
      'Using jQuery toast.'
    ],
    correctIndex: 0,
    explanation: 'A central store or composable managing reactive toast items enables dispatching notifications from anywhere in the app.'
  },
  {
    id: 141,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'In multi-tenant SaaS architectures, how should Vue frontend requests identify the tenant to the Express backend?',
    options: [
      'By attaching the `x-tenant-id: vue-v3` header in a global HTTP fetch/axios interceptor.',
      'By asking the user to type the tenant slug on every page.',
      'By appending `?tenant=vue-v3` to all URLs.',
      'By hardcoding database queries in the frontend.'
    ],
    correctIndex: 0,
    explanation: 'Centralizing tenant headers in HTTP interceptors guarantees all outgoing requests are properly tenant-scoped.'
  },
  {
    id: 142,
    category: 'ARCHITECTURE',
    difficulty: 'EXPERT',
    question: 'How do you structure theme toggling (Light / Dark mode) with Tailwind CSS in Vue 3?',
    options: [
      'Toggle the `.dark` class on `document.documentElement` (`<html>`) using a reactive `useTheme()` composable or `@vueuse/core useDark()`.',
      'Hardcode hex colors in inline style attributes.',
      'Reload the entire webpage with a different CSS stylesheet.',
      'Build two separate applications.'
    ],
    correctIndex: 0,
    explanation: 'Toggling the .dark class on the root HTML element activates Tailwind\'s dark: variant classes instantaneously.'
  },
  {
    id: 143,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the role of `src/router/guards.ts` in an enterprise Vue application?',
    options: [
      'To enforce navigation guards (`router.beforeEach`) that verify authentication tokens and RBAC permissions before granting route access.',
      'To encrypt HTML files.',
      'To validate CSS styles.',
      'To compile TypeScript.'
    ],
    correctIndex: 0,
    explanation: 'Router guards intercept navigation, redirecting unauthenticated or unauthorized users before views render.'
  },
  {
    id: 144,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'How should you organize views versus sub-components inside a feature directory in FAOS architecture?',
    codeSnippet: `src/features/users/\n├── components/     # Feature-specific reusable UI (UserCard, UserFilters)\n├── composables/    # Feature state and business logic (useUsers)\n└── views/          # Routable screens (UsersView.vue, UserDetailView.vue)`,
    options: [
      'Keep routable screens in `views/` and modular feature components in `components/`.',
      'Put all 40 files in a single flat folder.',
      'Put all HTML in index.html.',
      'Keep everything in main.ts.'
    ],
    correctIndex: 0,
    explanation: 'Separating routable views from sub-components maintains clean router configurations and modular component design.'
  },
  {
    id: 145,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'Why should you avoid using the global Pinia store for transient local UI state (like dropdown open/close flags)?',
    options: [
      'Transient UI state should remain local to the component using `ref(false)` to avoid polluting global state and causing unnecessary store bloat.',
      'Pinia cannot store boolean values.',
      'Global stores make dropdowns invisible.',
      'Pinia is only for database queries.'
    ],
    correctIndex: 0,
    explanation: 'Component-local state belongs in local refs; global stores should be reserved for shared domain state (user, cart, auth).'
  },

  // =========================================================================
  // SECTION 4: VUE ROUTER & NAVIGATION (146 - 155)
  // =========================================================================
  {
    id: 146,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you configure a route in `src/router/index.ts` to lazy-load a view chunk on-demand?',
    codeSnippet: `const routes = [\n  {\n    path: '/dashboard',\n    name: 'dashboard',\n    component: () => import('@/features/dashboard/views/DashboardView.vue'),\n    meta: { requiresAuth: true }\n  }\n];`,
    options: [
      'Use dynamic import syntax `component: () => import("./DashboardView.vue")`.',
      'Import the component eagerly at the top of the file: `component: DashboardView`.',
      'Set `lazy: true` in route options.',
      'Use `<iframe src="/dashboard">`.'
    ],
    correctIndex: 0,
    explanation: 'Dynamic import() statements enable Vite to split routes into separate lazy JavaScript chunks downloaded only when visited.'
  },
  {
    id: 147,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you access route parameters `/products/:id` inside `<script setup>` in Vue 3?',
    codeSnippet: `import { useRoute } from 'vue-router';\n\nconst route = useRoute();\nconst productId = computed(() => route.params.id as string);`,
    options: [
      'Inject the route with `const route = useRoute()` and access `route.params.id`.',
      'Read `window.location.pathname` with regex.',
      'Use `this.$route.params.id` in `<script setup>`.',
      'Pass params via window.global.'
    ],
    correctIndex: 0,
    explanation: 'useRoute() provides reactive access to the current route\'s params, query params, path, and meta information.'
  },
  {
    id: 148,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'How do you protect private routes so unauthenticated users are redirected to `/login` with a `redirect` query parameter?',
    codeSnippet: `router.beforeEach((to) => {\n  const authStore = useAuthStore();\n  if (to.meta.requiresAuth && !authStore.isAuthenticated) {\n    return { name: 'login', query: { redirect: to.fullPath } };\n  }\n});`,
    options: [
      'Return a redirect location object `{ name: "login", query: { redirect: to.fullPath } }` from `router.beforeEach`.',
      'Call window.location.href inside index.html.',
      'Disable routing.',
      'Delete the login route.'
    ],
    correctIndex: 0,
    explanation: 'Returning a route location from beforeEach redirects navigation cleanly while storing the intended destination.'
  },
  {
    id: 149,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'A user is editing a form. If they try to navigate away with unsaved edits, which Vue Router lifecycle hook should you use to confirm?',
    codeSnippet: `import { onBeforeRouteLeave } from 'vue-router';\n\nonBeforeRouteLeave((to, from) => {\n  if (isDirty.value) {\n    const answer = window.confirm('Discard unsaved changes?');\n    if (!answer) return false;\n  }\n});`,
    options: [
      'Use `onBeforeRouteLeave((to, from) => ...)` inside the component.',
      'Use `onMounted`.',
      'Use `onUnmounted`.',
      'Use `watchEffect`.'
    ],
    correctIndex: 0,
    explanation: 'onBeforeRouteLeave allows intercepting and canceling route departure if the user has unsaved edits.'
  },
  {
    id: 150,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you configure a wildcard fallback route that catches all unmatched URLs and redirects to `/dashboard`?',
    options: [
      '`{ path: "/:pathMatch(.*)*", redirect: "/dashboard" }` as the last route definition.',
      '`{ path: "*", redirect: "/dashboard" }`',
      '`{ path: "404", redirect: "/dashboard" }`',
      'Wildcards are not supported in Vue Router 4.'
    ],
    correctIndex: 0,
    explanation: 'Vue Router 4 uses dynamic custom regex param `/:pathMatch(.*)*` for catch-all wildcard routes.'
  },
  {
    id: 151,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you programmatically navigate to `/users` with query parameters in Vue 3?',
    codeSnippet: `import { useRouter } from 'vue-router';\n\nconst router = useRouter();\nrouter.push({ path: '/users', query: { page: '1', sort: 'asc' } });`,
    options: [
      'Call `router.push({ path: "/users", query: { page: "1", sort: "asc" } })` using `useRouter()`.',
      'Set `window.location = "/users?page=1"`.',
      'Call `router.navigate()`.',
      'Use `<a href="/users">`.'
    ],
    correctIndex: 0,
    explanation: 'router.push() pushes a new entry onto the history stack programmatically with structured query objects.'
  },
  {
    id: 152,
    category: 'ROUTING',
    difficulty: 'BEGINNER',
    question: 'How do you render navigation links with automatic active CSS classes in Vue?',
    options: [
      '`<RouterLink to="/dashboard" active-class="bg-primary text-white">Dashboard</RouterLink>`',
      '`<a href="/dashboard" active="true">Dashboard</a>`',
      '`<Link to="/dashboard" />`',
      '`<NavLink href="/dashboard" />`'
    ],
    correctIndex: 0,
    explanation: '<RouterLink> automatically adds the active-class and exact-active-class CSS classes when matching the current URL.'
  },
  {
    id: 153,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'How do you automatically pass route parameters as props to a component without coupling to `useRoute()`?',
    codeSnippet: `// In router definition:\n{\n  path: '/user/:id',\n  component: UserProfile,\n  props: true // passes route.params as component props!\n}\n\n// In UserProfile.vue:\nconst { id } = defineProps<{ id: string }>();`,
    options: [
      'Set `props: true` on the route record definition in `routes.ts`.',
      'Pass props manually in index.html.',
      'It cannot be done in Vue Router.',
      'Use `provide/inject`.'
    ],
    correctIndex: 0,
    explanation: 'Setting `props: true` on a route record automatically maps route.params into component props, decoupling components from the router.'
  },
  {
    id: 154,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'Where is the active route component rendered inside the application layout?',
    options: [
      'Inside the `<RouterView />` tag.',
      'Inside `<div id="router">`.',
      'Inside `<component is="route" />`.',
      'Inside `<slot name="router" />`.'
    ],
    correctIndex: 0,
    explanation: '<RouterView /> is the outlet component that renders the matching component for the current URL route.'
  },
  {
    id: 155,
    category: 'ROUTING',
    difficulty: 'EXPERT',
    question: 'How do you configure smooth scroll behavior so the page scrolls to the top on new route navigation but restores previous position on back/forward buttons?',
    codeSnippet: `export const router = createRouter({\n  history: createWebHistory(),\n  routes,\n  scrollBehavior(to, from, savedPosition) {\n    if (savedPosition) return savedPosition;\n    return { top: 0, behavior: 'smooth' };\n  }\n});`,
    options: [
      'Provide a `scrollBehavior(to, from, savedPosition)` function returning `savedPosition` or `{ top: 0 }`.',
      'Call window.scrollTo() on every button click.',
      'Disable scrolling in CSS.',
      'Scroll restoration is not possible in SPAs.'
    ],
    correctIndex: 0,
    explanation: 'scrollBehavior handles scroll positioning across history traversals and route navigations cleanly.'
  },

  // =========================================================================
  // SECTION 5: FORMS & ZOD VALIDATION (156 - 165)
  // =========================================================================
  {
    id: 156,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'You are validating a user registration form with Zod in Vue. How do you parse and extract validation errors for each field?',
    codeSnippet: `const RegisterSchema = z.object({\n  email: z.string().email('Invalid email address'),\n  password: z.string().min(8, 'Must be at least 8 chars'),\n});\n\nconst result = RegisterSchema.safeParse(formData.value);\nif (!result.success) {\n  errors.value = result.error.flatten().fieldErrors;\n}`,
    options: [
      'Use `schema.safeParse(formData)` and extract field errors with `result.error.flatten().fieldErrors`.',
      'Use try/catch with JSON.parse().',
      'Write 50 if statements manually.',
      'Validate only on the backend.'
    ],
    correctIndex: 0,
    explanation: 'Zod safeParse() returns a structured error tree that can be flattened into a type-safe Record<string, string[]> map.'
  },
  {
    id: 157,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the purpose of `v-model.trim` and `v-model.number` modifiers in Vue?',
    options: [
      '`.trim` automatically removes leading/trailing whitespace; `.number` typecasts the input value to a JavaScript number.',
      'They encrypt form fields.',
      'They translate text into Spanish.',
      'They prevent form submission.'
    ],
    correctIndex: 0,
    explanation: 'v-model modifiers automatically sanitize inputs (.trim strips whitespace, .number parses floats/ints, .lazy syncs on change).'
  },
  {
    id: 158,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'How do you implement cross-field password confirmation validation using Zod?',
    codeSnippet: `const PasswordsSchema = z.object({\n  password: z.string().min(8),\n  confirmPassword: z.string()\n}).refine(data => data.password === data.confirmPassword, {\n  message: "Passwords must match",\n  path: ["confirmPassword"]\n});`,
    options: [
      'Use the `.refine()` method on the Zod object with a custom `path: ["confirmPassword"]`.',
      'Validate in the template with `v-if`.',
      'Check passwords in local storage.',
      'Cross-field validation is not possible in Zod.'
    ],
    correctIndex: 0,
    explanation: 'Zod .refine() validates multi-field dependencies and maps the resulting error message directly to the target field path.'
  },
  {
    id: 159,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'When should validation error messages be displayed under an input field for the best user experience?',
    options: [
      'When the field has been touched/blurred (`touched.email`) or on form submit attempt, AND validation fails.',
      'Immediately when the blank form renders.',
      'Never show error messages.',
      'Only in console.log.'
    ],
    correctIndex: 0,
    explanation: 'Checking touched || submitted prevents showing aggressive error messages on fresh, untouched forms.'
  },
  {
    id: 160,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'How do you manage dynamic FormArrays (e.g. adding/removing multiple invoice items) in Vue 3?',
    codeSnippet: `const items = ref([{ title: '', price: 0 }]);\n\nfunction addItem() {\n  items.value.push({ title: '', price: 0 });\n}\nfunction removeItem(index: number) {\n  items.value.splice(index, 1);\n}`,
    options: [
      'Maintain a reactive array ref with helper methods `.push()` and `.splice()`.',
      'Create 50 hardcoded refs (item1, item2, item3...).',
      'Use HTML tables without reactivity.',
      'Dynamic arrays cannot be rendered in Vue.'
    ],
    correctIndex: 0,
    explanation: 'Managing dynamic form rows with reactive array methods provides flexible, variable-length form lists.'
  },
  {
    id: 161,
    category: 'FORMS',
    difficulty: 'BEGINNER',
    question: 'How do you prevent the browser from reloading the page when a `<form>` is submitted in Vue?',
    options: [
      '`<form @submit.prevent="onSubmit">`',
      '`<form (submit)="onSubmit">`',
      '`<form onsubmit="return false">`',
      '`<form prevent>`'
    ],
    correctIndex: 0,
    explanation: 'The event modifier `@submit.prevent` automatically calls `event.preventDefault()` before executing the handler.'
  },
  {
    id: 162,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'The backend returns a 422 Unprocessable Entity with `{ errors: { email: ["Email already taken"] } }`. How do you display this in the form?',
    options: [
      'Catch the error in your API composable/mutation and merge the backend error object into your local `errors` ref.',
      'Alert the user with alert().',
      'Wipe the form completely.',
      'Reload the page.'
    ],
    correctIndex: 0,
    explanation: 'Mapping backend field errors into the local form errors state displays contextual inline errors next to the affected inputs.'
  },
  {
    id: 163,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'How do you disable the submit button while an asynchronous form submission is in flight?',
    codeSnippet: `<button type="submit" :disabled="isSubmitting">\n  <span v-if="isSubmitting">Saving...</span>\n  <span v-else>Save Changes</span>\n</button>`,
    options: [
      'Bind `:disabled="isSubmitting"` using a reactive boolean loading ref.',
      'Delete the button during submission.',
      'Disable the internet connection.',
      'Use setTimeout.'
    ],
    correctIndex: 0,
    explanation: 'Binding :disabled to the mutation\'s loading state prevents accidental duplicate submissions.'
  },
  {
    id: 164,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'How do you build an asynchronous username uniqueness validator with debouncing in Vue?',
    codeSnippet: `import { watchDebounced } from '@vueuse/core';\n\nwatchDebounced(username, async (newVal) => {\n  if (!newVal) return;\n  isChecking.value = true;\n  const isTaken = await checkUsernameApi(newVal);\n  isChecking.value = false;\n  usernameError.value = isTaken ? 'Username is already taken' : '';\n}, { debounce: 400 });`,
    options: [
      'Use a debounced watcher (`watchDebounced` from VueUse or setTimeout) that calls the API after typing pauses.',
      'Call the API on every single keystroke without debounce.',
      'Check username in the template.',
      'Async validation cannot be done in Vue.'
    ],
    correctIndex: 0,
    explanation: 'Debouncing ensures network requests fire only after the user stops typing (e.g. 400ms), avoiding API flooding.'
  },
  {
    id: 165,
    category: 'FORMS',
    difficulty: 'BEGINNER',
    question: 'How do you reset a reactive form object back to its initial state in Vue 3?',
    codeSnippet: `const initialForm = { email: '', name: '', role: 'user' };\nconst form = reactive({ ...initialForm });\n\nfunction reset() {\n  Object.assign(form, initialForm);\n}`,
    options: [
      'Use `Object.assign(form, initialForm)` to reset reactive properties in-place.',
      'Set `form = initialForm` (breaks reactive proxy reference).',
      'Delete the form object.',
      'Restart the browser.'
    ],
    correctIndex: 0,
    explanation: 'Object.assign(form, initial) mutates the existing reactive proxy back to initial values without losing its reference.'
  },

  // =========================================================================
  // SECTION 6: HTTP, TANSTACK VUE QUERY & ASYNC (166 - 175)
  // =========================================================================
  {
    id: 166,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'You create a new post via a POST mutation in TanStack Vue Query. What should you do on success to update cached lists?',
    codeSnippet: `const queryClient = useQueryClient();\nconst { mutate } = useMutation({\n  mutationFn: (newPost) => api.createPost(newPost),\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: ['posts'] });\n  }\n});`,
    options: [
      'Call `queryClient.invalidateQueries({ queryKey: ["posts"] })` to mark the cache stale and trigger auto-refetching.',
      'Call `window.location.reload()`.',
      'Do nothing.',
      'Clear all browser storage.'
    ],
    correctIndex: 0,
    explanation: 'Invalidating queries by queryKey instructs TanStack Query to refetch fresh server data in the background automatically.'
  },
  {
    id: 167,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you execute an asynchronous data query using TanStack Vue Query (`@tanstack/vue-query`)?',
    codeSnippet: `import { useQuery } from '@tanstack/vue-query';\n\nconst { data: posts, isLoading, isError, error } = useQuery({\n  queryKey: ['posts'],\n  queryFn: () => fetchPostsApi(),\n  staleTime: 1000 * 60 * 5\n});`,
    options: [
      'Use `useQuery({ queryKey, queryFn })` which returns reactive `data`, `isLoading`, `isError` refs.',
      'Use `fetch()` inside a template `v-for`.',
      'Write synchronous XMLHttpRequest in setup.',
      'Use jQuery.ajax.'
    ],
    correctIndex: 0,
    explanation: 'useQuery() manages caching, refetch on window focus, loading state, error state, and retry logic seamlessly.'
  },
  {
    id: 168,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'How do you cancel an in-flight HTTP request when a user types a new character in an autocomplete search box?',
    codeSnippet: `let controller: AbortController | null = null;\n\nasync function search(query: string) {\n  controller?.abort();\n  controller = new AbortController();\n  return fetch(\`/api/search?q=\${query}\`, { signal: controller.signal });\n}`,
    options: [
      'Use an `AbortController` and pass its `signal` into the fetch/axios request, calling `controller.abort()` before new requests.',
      'Close the browser tab.',
      'Set timeout to 0.',
      'In-flight requests cannot be canceled in JavaScript.'
    ],
    correctIndex: 0,
    explanation: 'AbortController allows canceling in-flight HTTP network requests immediately when superseded by newer user input.'
  },
  {
    id: 169,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you implement automatic retries for transient 500/network failures in TanStack Query?',
    options: [
      'Set `retry: 3` and `retryDelay: (attempt) => Math.min(attempt * 1000, 3000)` in query options.',
      'Write a while loop around fetch.',
      'Ask the user to click 3 times.',
      'Retries are handled by the operating system.'
    ],
    correctIndex: 0,
    explanation: 'TanStack Query provides configurable exponential retry options out of the box.'
  },
  {
    id: 170,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'A dashboard polls `/api/metrics` every 5 seconds. You introduce real-time Socket.IO events. What is the recommended production architecture?',
    options: [
      'Use Socket.IO events for instant cache updates (`queryClient.setQueryData`) and retain slow background polling (60s) as a resilient fallback.',
      'Keep 5-second polling and ignore WebSockets.',
      'Remove all data fetching completely.',
      'Reload the whole page on every socket event.'
    ],
    correctIndex: 0,
    explanation: 'Real-time WebSocket events provide instant updates while a slow background poll guarantees eventual consistency on disconnect.'
  },
  {
    id: 171,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'How should an HTTP fetch interceptor handle a 401 Unauthorized response globally in Vue?',
    options: [
      'Clear the auth store, remove expired tokens, and redirect to `/login?redirect=...` via `router.push()`.',
      'Show an alert and crash the app.',
      'Delete the backend database.',
      'Ignore the 401 response.'
    ],
    correctIndex: 0,
    explanation: 'Global 401 handling clears invalid sessions and routes users back to login cleanly.'
  },
  {
    id: 172,
    category: 'HTTP_QUERY',
    difficulty: 'EXPERT',
    question: 'How do you implement an Optimistic UI update when a user clicks "Like" on a post before the backend responds?',
    codeSnippet: `const { mutate } = useMutation({\n  mutationFn: likePostApi,\n  onMutate: async (postId) => {\n    await queryClient.cancelQueries({ queryKey: ['posts'] });\n    const prevPosts = queryClient.getQueryData(['posts']);\n    queryClient.setQueryData(['posts'], (old: any) => old.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));\n    return { prevPosts };\n  },\n  onError: (_err, _vars, context) => {\n    queryClient.setQueryData(['posts'], context?.prevPosts);\n  }\n});`,
    options: [
      'Update the query cache in `onMutate`, store the previous snapshot, and roll back in `onError` if the network request fails.',
      'Wait 3 seconds before updating the heart icon.',
      'Never show likes until page refresh.',
      'Optimistic updates are not supported in Vue.'
    ],
    correctIndex: 0,
    explanation: 'Optimistic mutations provide instant UI updates with automatic rollback capabilities if server errors occur.'
  },
  {
    id: 173,
    category: 'HTTP_QUERY',
    difficulty: 'BEGINNER',
    question: 'How do you pass query parameters `?page=1&limit=10` using URLSearchParams in fetch requests?',
    options: [
      '`const params = new URLSearchParams({ page: "1", limit: "10" }); fetch(\`/api/users?\${params}\`);`',
      '`fetch("/api/users", { body: { page: 1, limit: 10 } });`',
      '`fetch.params({ page: 1 });`',
      '`fetch("/api/users", { params: true });`'
    ],
    correctIndex: 0,
    explanation: 'URLSearchParams encodes structured key-value query parameters into standard URI query strings.'
  },
  {
    id: 174,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'How do you create a custom composable `useApi<T>(url)` for typed data fetching with loading and error state?',
    codeSnippet: `export function useApi<T>(url: string) {\n  const data = ref<T | null>(null);\n  const isLoading = ref(true);\n  const error = ref<Error | null>(null);\n  onMounted(async () => {\n    try {\n      data.value = await http.get<T>(url);\n    } catch (e: any) {\n      error.value = e;\n    } finally {\n      isLoading.value = false;\n    }\n  });\n  return { data, isLoading, error };\n}`,
    options: [
      'Encapsulate data, isLoading, and error refs inside a reusable composable function.',
      'Write duplicate fetch code inside every single SFC.',
      'Store all responses in window.data.',
      'Use global eval().'
    ],
    correctIndex: 0,
    explanation: 'Custom API composables centralize loading, error, and data ref lifecycles.'
  },
  {
    id: 175,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'What is the purpose of `staleTime` in TanStack Vue Query?',
    options: [
      'The duration (in milliseconds) that cached data is considered fresh before background refetching is triggered on mount/focus.',
      'The timeout before deleting the database.',
      'The time a user can stay logged in.',
      'The CSS animation delay.'
    ],
    correctIndex: 0,
    explanation: 'staleTime prevents excessive refetches by treating recently loaded data as fresh for the configured time window.'
  },

  // =========================================================================
  // SECTION 7: PERFORMANCE & OPTIMIZATION (176 - 185)
  // =========================================================================
  {
    id: 176,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'A page contains a heavy 3D chart component that is below the fold. How do you lazy-load it on-demand in Vue 3?',
    codeSnippet: `import { defineAsyncComponent } from 'vue';\n\nconst HeavyChart = defineAsyncComponent(() =>\n  import('@/features/dashboard/components/HeavyChart.vue')\n);`,
    options: [
      'Use `defineAsyncComponent(() => import("./HeavyChart.vue"))` to load the chunk only when rendered.',
      'Import the chart at the top of main.ts.',
      'Convert the chart to an image.',
      'Use `setTimeout`.'
    ],
    correctIndex: 0,
    explanation: 'defineAsyncComponent creates an async component that is split into a separate JavaScript bundle loaded on demand.'
  },
  {
    id: 177,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'Why is providing a unique `:key` mandatory in `v-for` loops rendering lists?',
    codeSnippet: `<tr v-for="user in users" :key="user.id">\n  <td>{{ user.name }}</td>\n</tr>`,
    options: [
      'The `:key` allows Vue\'s Virtual DOM diffing algorithm to identify and track elements, moving existing DOM nodes rather than destroying and recreating them.',
      'Keys make CSS colors brighter.',
      'Keys are required by HTML5 specification.',
      'Keys prevent TypeScript errors only.'
    ],
    correctIndex: 0,
    explanation: 'Unique stable keys enable efficient Virtual DOM reconciliation during array sorting, insertions, and deletions.'
  },
  {
    id: 178,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'What is the purpose of the `<KeepAlive>` built-in component in Vue 3?',
    codeSnippet: `<RouterView v-slot="{ Component }">\n  <KeepAlive include="DashboardView,PostsView">\n    <component :is="Component" />\n  </KeepAlive>\n</RouterView>`,
    options: [
      'It caches inactive component instances in memory without destroying them, preserving their state when switching between views.',
      'It keeps the network connection alive.',
      'It prevents the browser tab from sleeping.',
      'It backs up files to disk.'
    ],
    correctIndex: 0,
    explanation: '<KeepAlive> caches component DOM and reactive state in memory so switching back does not trigger fresh mount lifecycles.'
  },
  {
    id: 179,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the `<Teleport>` component used for in Vue 3?',
    codeSnippet: `<Teleport to="body">\n  <div v-if="isOpen" class="modal-overlay">\n    <div class="modal-content">Modal Content</div>\n  </div>\n</Teleport>`,
    options: [
      'It renders a component\'s template subtree into a different DOM node (like `document.body`) outside of its parent component hierarchy.',
      'It teleports data across servers.',
      'It translates languages.',
      'It is deprecated in Vue 3.'
    ],
    correctIndex: 0,
    explanation: '<Teleport to="selector"> moves modal overlays, popovers, and tooltips into target DOM nodes (like <body>) cleanly.'
  },
  {
    id: 180,
    category: 'PERFORMANCE',
    difficulty: 'EXPERT',
    question: 'What is the `v-memo` directive introduced in Vue 3.2+ used for?',
    codeSnippet: `<div v-for="item in list" :key="item.id" v-memo="[item.id === selectedId]">\n  <p>{{ item.name }} - {{ item.status }}</p>\n</div>`,
    options: [
      'It memoizes a sub-tree of the template, skipping VDOM diffing completely unless the specified dependency array values change.',
      'It stores data in browser memory.',
      'It saves notes to a database.',
      'It is an alias for computed().'
    ],
    correctIndex: 0,
    explanation: 'v-memo skips Virtual DOM updates for large lists unless watched values change, optimizing table rendering performance.'
  },
  {
    id: 181,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'What does the `v-once` directive do?',
    options: [
      'It renders an element or component once and treats it as static on subsequent re-renders, skipping all diffing.',
      'It runs a function once on startup.',
      'It limits user clicks to 1.',
      'It is deprecated.'
    ],
    correctIndex: 0,
    explanation: 'v-once treats elements as static content after initial render, reducing Virtual DOM diffing overhead.'
  },
  {
    id: 182,
    category: 'PERFORMANCE',
    difficulty: 'EXPERT',
    question: 'How do you inspect bundle size and identify bloated packages in a Vite Vue 3 project?',
    options: [
      'Install `rollup-plugin-visualizer` in vite.config.ts to generate an interactive chunk footprint visualizer map.',
      'Count the number of .vue files in src/.',
      'Check the size of node_modules folder.',
      'Ask the browser console.'
    ],
    correctIndex: 0,
    explanation: 'rollup-plugin-visualizer produces an interactive treemap diagram of bundle chunks and dependencies.'
  },
  {
    id: 183,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'What is `<Suspense>` in Vue 3?',
    codeSnippet: `<Suspense>\n  <template #default>\n    <AsyncUserProfile />\n  </template>\n  <template #fallback>\n    <LoadingSkeleton />\n  </template>\n</Suspense>`,
    options: [
      'A built-in component that coordinates async component loading and displays fallback loading UI while async dependencies resolve.',
      'A tool to pause JavaScript execution.',
      'A CSS animation library.',
      'A router guard.'
    ],
    correctIndex: 0,
    explanation: '<Suspense> coordinates async component resolution (top-level await in <script setup>) with fallback skeleton slots.'
  },
  {
    id: 184,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'Why does calling a method directly in template interpolation `{{ computeTotal(item) }}` harm performance?',
    options: [
      'The method executes on EVERY single component re-render; using `computed()` or memoized composables avoids redundant recalculations.',
      'Methods cannot return numbers in templates.',
      'It throws a compile-time error.',
      'It causes database locks.'
    ],
    correctIndex: 0,
    explanation: 'Template methods re-run on every render pass. Computed properties are cached and only recalculate when dependencies change.'
  },
  {
    id: 185,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you create a custom Vue directive (e.g. `v-focus`) to automatically focus an input element upon mount?',
    codeSnippet: `const vFocus = {\n  mounted: (el: HTMLElement) => el.focus()\n};`,
    options: [
      'Declare an object with lifecycle hooks (`mounted: (el) => el.focus()`) prefixed with `v` (e.g. `vFocus`).',
      'Use `document.focus()`.',
      'Use `v-model`.',
      'Directives cannot access DOM elements.'
    ],
    correctIndex: 0,
    explanation: 'Custom directives provide low-level DOM access hooks (created, mounted, updated, unmounted).'
  },

  // =========================================================================
  // SECTION 8: TESTING & QUALITY (186 - 190)
  // =========================================================================
  {
    id: 186,
    category: 'TESTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you mount a Vue component in unit tests using `@vue/test-utils` and Vitest?',
    codeSnippet: `import { mount } from '@vue/test-utils';\nimport Counter from '@/components/Counter.vue';\n\ntest('increments count on click', async () => {\n  const wrapper = mount(Counter, { props: { initial: 5 } });\n  await wrapper.find('button').trigger('click');\n  expect(wrapper.text()).toContain('Count: 6');\n});`,
    options: [
      'Use `mount(Component, { props, global })` and interact using `wrapper.find().trigger()`.',
      'Use `document.createElement()`.',
      'Unit tests cannot test Vue components.',
      'Use `console.assert()` in main.ts.'
    ],
    correctIndex: 0,
    explanation: 'mount() from @vue/test-utils renders a component in a test environment with DOM querying and event trigger helpers.'
  },
  {
    id: 187,
    category: 'TESTING',
    difficulty: 'ADVANCED',
    question: 'How do you test a Pinia store action in isolation without mounting UI components?',
    codeSnippet: `import { setActivePinia, createPinia } from 'pinia';\nimport { useCounterStore } from './counter';\n\nbeforeEach(() => {\n  setActivePinia(createPinia());\n});\n\ntest('increments count', () => {\n  const store = useCounterStore();\n  store.increment();\n  expect(store.count).toBe(1);\n});`,
    options: [
      'Initialize Pinia with `setActivePinia(createPinia())` in `beforeEach` and call store actions directly.',
      'Pinia stores cannot be tested without a browser.',
      'Mock all JavaScript memory.',
      'Use Cypress.'
    ],
    correctIndex: 0,
    explanation: 'setActivePinia() creates a clean, isolated Pinia context for headless store testing.'
  },
  {
    id: 188,
    category: 'TESTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you mock an HTTP API call inside a Vue composable test using Vitest?',
    codeSnippet: `import { vi } from 'vitest';\nimport * as api from '@/shared/api/http';\n\nvi.spyOn(api.http, 'get').mockResolvedValue([{ id: 1, name: 'Test' }]);`,
    options: [
      'Use `vi.spyOn(http, "get").mockResolvedValue(mockData)` to intercept the call.',
      'Delete the API file.',
      'Disable internet access.',
      'Mocking is not supported in Vitest.'
    ],
    correctIndex: 0,
    explanation: 'vi.spyOn().mockResolvedValue() intercepts asynchronous module methods and returns mock fixtures.'
  },
  {
    id: 189,
    category: 'TESTING',
    difficulty: 'BEGINNER',
    question: 'Why must you `await` event triggers when testing Vue components (e.g. `await button.trigger("click")`)?',
    options: [
      'Vue updates the DOM asynchronously on the next tick; awaiting the trigger ensures DOM re-rendering is complete before assertions run.',
      'JavaScript functions are all async by default.',
      'To make tests slower.',
      'Awaiting is not required.'
    ],
    correctIndex: 0,
    explanation: 'Awaiting trigger() waits for Vue\'s nextTick DOM update cycle to complete before running assertions.'
  },
  {
    id: 190,
    category: 'TESTING',
    difficulty: 'ADVANCED',
    question: 'How do you test a custom composable with reactive effects outside a component using `withSetup`?',
    codeSnippet: `export function withSetup(composable: () => any) {\n  let result: any;\n  const app = createApp({\n    setup() {\n      result = composable();\n      return () => {};\n    }\n  });\n  app.mount(document.createElement('div'));\n  return { result, app };\n}`,
    options: [
      'Create a test harness component with `createApp` that invokes the composable inside its `setup()` context.',
      'Call the composable in index.html.',
      'Composables cannot use provide/inject in tests.',
      'Use eval().'
    ],
    correctIndex: 0,
    explanation: 'A test harness executes composables inside a valid Vue app context, enabling provide/inject and lifecycle testing.'
  },

  // =========================================================================
  // SECTION 9: SECURITY & AUTH (191 - 195)
  // =========================================================================
  {
    id: 191,
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    question: 'Why should JWT authentication session tokens be stored in HTTP-Only, Secure, SameSite cookies rather than localStorage?',
    options: [
      'HTTP-Only cookies cannot be read or stolen by malicious JavaScript code in the event of an XSS (Cross-Site Scripting) vulnerability.',
      'localStorage has a 5MB limit.',
      'Cookies are faster to read than RAM.',
      'localStorage is deprecated.'
    ],
    correctIndex: 0,
    explanation: 'HTTP-Only cookies prevent XSS token theft because the browser handles cookies automatically without JavaScript API exposure.'
  },
  {
    id: 192,
    category: 'SECURITY',
    difficulty: 'INTERMEDIATE',
    question: 'Why is using `v-html` dangerous when rendering user-submitted text, and how should it be secured?',
    options: [
      '`v-html` renders raw HTML without escaping, exposing the app to XSS attacks; sanitize input with DOMPurify before rendering.',
      'v-html causes memory leaks.',
      'v-html cannot render colors.',
      'v-html only works in Chrome.'
    ],
    correctIndex: 0,
    explanation: 'v-html executes scripts if untrusted input is injected. Use standard {{ interpolations }} or sanitize with DOMPurify.'
  },
  {
    id: 193,
    category: 'SECURITY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you implement Role-Based Access Control (RBAC) in Vue Router navigation guards?',
    codeSnippet: `router.beforeEach((to) => {\n  const auth = useAuthStore();\n  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {\n    return { name: 'unauthorized' };\n  }\n});`,
    options: [
      'Check `to.meta.roles` in `router.beforeEach` against the authenticated user\'s role and redirect unauthorized users.',
      'Hide buttons with CSS `opacity: 0`.',
      'Check roles in index.html.',
      'Store passwords in client code.'
    ],
    correctIndex: 0,
    explanation: 'Route meta properties paired with beforeEach guards enforce server-synchronized authorization rules.'
  },
  {
    id: 194,
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    question: 'Why does the backend Express server reject requests with custom headers like `x-tenant-id` if CORS middleware does not allowlist them?',
    options: [
      'Browsers send an HTTP OPTIONS preflight; if `Access-Control-Allow-Headers` lacks `x-tenant-id`, the browser terminates the request.',
      'Because Node.js cannot read headers with dashes.',
      'PostgreSQL does not support headers.',
      'Because Express only allows GET.'
    ],
    correctIndex: 0,
    explanation: 'Cross-origin requests with custom headers trigger CORS preflights; the server must allowlist them in Access-Control-Allow-Headers.'
  },
  {
    id: 195,
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    question: 'How do you sanitize user-supplied URLs before binding them to `<a :href="userUrl">` to prevent `javascript:` payload execution?',
    options: [
      'Validate that the URL starts with `https://` or `http://` using regex or URL constructor before binding.',
      'Allow all URLs freely.',
      'Convert URLs to lowercase.',
      'HTML links are always safe.'
    ],
    correctIndex: 0,
    explanation: 'Validating URL protocols prevents malicious `javascript:alert(1)` payloads from executing on click.'
  },

  // =========================================================================
  // SECTION 10: DEBUGGING & PRODUCTION SCENARIOS (196 - 200)
  // =========================================================================
  {
    id: 196,
    category: 'DEBUGGING',
    difficulty: 'INTERMEDIATE',
    question: 'A developer updates a ref `count = 5` inside `<script setup>`, but the template does not update. What is the bug?',
    options: [
      'The developer assigned directly to `count` instead of mutating its value `count.value = 5`.',
      'Vue requires restarting Vite.',
      'The computer needs a reboot.',
      'Browser cache is full.'
    ],
    correctIndex: 0,
    explanation: 'Inside script tags, refs are RefImpl objects whose reactive state must be updated via `.value`.'
  },
  {
    id: 197,
    category: 'DEBUGGING',
    difficulty: 'ADVANCED',
    question: 'You configured a route with `component: () => import("./UsersView.vue")`, but bundle inspection shows `UsersView` is bundled into `index.js`. What is the cause?',
    options: [
      'Another eager component (like App.vue or router/index.ts) directly imported `import UsersView from "./UsersView.vue"` statically.',
      'Vue does not support lazy loading.',
      'Vite has a bug.',
      'TypeScript caused the leak.'
    ],
    correctIndex: 0,
    explanation: 'A static eager import anywhere in the build tree overrides dynamic imports, bundling the component into the main chunk.'
  },
  {
    id: 198,
    category: 'DEBUGGING',
    difficulty: 'ADVANCED',
    question: 'A watcher triggers an infinite loop error: "Maximum recursive updates exceeded". What is the architectural cause?',
    codeSnippet: `// Buggy pattern:\nwatch(user, () => {\n  user.lastUpdated = Date.now(); // Mutating watched dependency inside its own watcher!\n}, { deep: true });`,
    options: [
      'The watcher callback mutates the exact same reactive dependency it is watching with deep: true, triggering itself recursively.',
      'Vue cannot watch objects.',
      'Date.now() causes memory leaks.',
      'The CPU ran out of memory.'
    ],
    correctIndex: 0,
    explanation: 'Mutating a deep watched object inside its own callback triggers an infinite recursive watcher cycle.'
  },
  {
    id: 199,
    category: 'DEBUGGING',
    difficulty: 'INTERMEDIATE',
    question: 'A component receives a prop `user`, but when the parent updates `user.name`, the child does NOT update. The child starts with `const { name } = props.user`. What is the bug?',
    options: [
      'Destructuring plain properties from a prop object breaks the reactive proxy connection in Vue < 3.5 without `toRefs()`.',
      'Props cannot contain objects.',
      'Vue does not support child components.',
      'The parent component is broken.'
    ],
    correctIndex: 0,
    explanation: 'Directly destructuring nested properties copies values as plain JavaScript primitives, severing the reactive chain.'
  },
  {
    id: 200,
    category: 'DEBUGGING',
    difficulty: 'EXPERT',
    question: 'You deployed a Vue 3 SPA with Vue Router (HTML5 history mode) to NGINX. Users report that refreshing `/users` yields an NGINX "404 Not Found". How do you fix this?',
    options: [
      'Add `try_files $uri $uri/ /index.html;` to the NGINX configuration so unmatched routes fallback to `index.html` for client-side routing.',
      'Switch back to Hash history mode (#/users).',
      'Tell users to never refresh.',
      'Remove routing from the application.'
    ],
    correctIndex: 0,
    explanation: 'HTML5 history mode requires server fallback routing (try_files) to serve index.html for all deep client-side URLs.'
  }
];

export async function seedVueQuizQuestions(prisma: PrismaClient) {
  console.log('Seeding 100 Vue 3.5 Project-Building Quiz Questions into PostgreSQL...');

  const vueTenant = await prisma.tenant.findUnique({
    where: { slug: 'vue-v3' }
  });

  for (const q of VUE_100_QUIZ_BANK) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        codeSnippet: q.codeSnippet || null,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        tenantId: vueTenant?.id || null,
      },
      create: {
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        codeSnippet: q.codeSnippet || null,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        tenantId: vueTenant?.id || null,
      }
    });
  }

  console.log(`✅ Successfully seeded ${VUE_100_QUIZ_BANK.length} Vue 3.5 Questions into PostgreSQL!`);
}
