import { PrismaClient } from '@prisma/client';

export interface AngularQuizQuestionSeed {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Backward compatibility alias
export type QuizQuestionSeed = AngularQuizQuestionSeed;

export const ANGULAR_100_QUIZ_BANK: AngularQuizQuestionSeed[] = [
  // SECTION 1: ANGULAR FUNDAMENTALS
  {
    id: 1,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'You are setting up a new Angular 19 production project from scratch. What is the recommended bootstrapping method in main.ts?',
    codeSnippet: `// Option comparison\n1. platformBrowserDynamic().bootstrapModule(AppModule);\n2. bootstrapApplication(AppComponent, appConfig);`,
    options: [
      'Use platformBrowserDynamic().bootstrapModule(AppModule) with an NgModule.',
      'Use bootstrapApplication(AppComponent, appConfig) with standalone components and providers.',
      'Mount the component manually with document.getElementById("root").',
      'Use platformServer().bootstrapApplication(AppComponent).'
    ],
    correctIndex: 1,
    explanation: 'Modern Angular 19 applications bootstrap standalone root components directly using bootstrapApplication() with an ApplicationConfig object.'
  },
  {
    id: 2,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'You are building a reusable ButtonComponent. How should you accept an optional variant string that defaults to "primary"?',
    codeSnippet: `@Component({ standalone: true, ... })\nexport class ButtonComponent {\n  // How to declare variant?\n}`,
    options: [
      'readonly variant = input<"primary" | "secondary">("primary");',
      '@Input() variant: string = "primary";',
      'readonly variant = signal<string>("primary");',
      'readonly variant = prop("primary");'
    ],
    correctIndex: 0,
    explanation: 'input<T>(defaultValue) is the modern Signal-based input API that provides reactive, type-safe inputs with default fallback values.'
  },
  {
    id: 3,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'A ProductCard component needs to emit an event containing the product ID when the user clicks "Add to Cart". What is the modern syntax?',
    codeSnippet: `export class ProductCardComponent {\n  readonly addToCart = output<string>();\n\n  onButtonClick(id: string) {\n    // How to emit?\n  }\n}`,
    options: [
      'this.addToCart.next(id);',
      'this.addToCart.emit(id);',
      'this.addToCart.dispatch(id);',
      'this.addToCart.set(id);'
    ],
    correctIndex: 1,
    explanation: 'The output<T>() API returns an OutputEmitterRef that emits values using .emit(value) without the RxJS Subject overhead of legacy EventEmitter.'
  },
  {
    id: 4,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'You are building a modal card component with header, body, and action footer slots. How do you implement multi-slot projection in Angular?',
    codeSnippet: `<div class="modal">\n  <div class="header"><ng-content select="[modal-header]" /></div>\n  <div class="body"><ng-content /></div>\n  <div class="footer"><ng-content select="[modal-actions]" /></div>\n</div>`,
    options: [
      'Using <slot name="modal-header" /> like Web Components.',
      'Using <ng-content select="[modal-header]"> with CSS attribute or class selectors.',
      'Passing HTML strings into @Input() innerHTML.',
      'Using <router-outlet name="header" />.'
    ],
    correctIndex: 1,
    explanation: 'Multi-slot content projection in Angular uses the `select` attribute on <ng-content> to match specific selectors (e.g. [modal-header] or .actions).'
  },
  {
    id: 5,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'How do you query a child DOM element or component signal-reactively in Angular 19 without @ViewChild?',
    codeSnippet: `@Component({\n  template: \`<input #searchInput type="text" />\`\n})\nexport class SearchBarComponent {\n  // How to access searchInput?\n}`,
    options: [
      'readonly searchInput = viewChild.required<ElementRef>("searchInput");',
      '@ViewChild("searchInput") searchInput!: ElementRef;',
      'readonly searchInput = document.querySelector("#searchInput");',
      'readonly searchInput = injectChild("searchInput");'
    ],
    correctIndex: 0,
    explanation: 'viewChild() and viewChild.required() are modern Signal queries that return a Signal containing the queried element or component instance.'
  },
  {
    id: 6,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'You want your CustomCardComponent to automatically apply the CSS class "border-rounded" and a role attribute to its host DOM element. How should you configure it?',
    codeSnippet: `@Component({\n  selector: 'app-custom-card',\n  standalone: true,\n  // Which host configuration?\n})`,
    options: [
      'host: { class: "border-rounded", role: "region" } in the @Component decorator metadata.',
      'Using document.body.classList.add("border-rounded").',
      'Wrapping the template in an extra <div> with classes.',
      'Writing CSS global selectors :root { border-rounded: true; }.'
    ],
    correctIndex: 0,
    explanation: 'The `host` property in @Component decorator is the recommended, declarative way to bind classes, styles, attributes, and event listeners to the host element.'
  },
  {
    id: 7,
    category: 'FUNDAMENTALS',
    difficulty: 'ADVANCED',
    question: 'You are setting up an interval timer inside a shared service. How do you ensure the timer is automatically cleaned up when the service or injection scope is destroyed?',
    codeSnippet: `@Injectable({ providedIn: 'root' })\nexport class HeartbeatService {\n  constructor() {\n    const timer = setInterval(() => this.ping(), 5000);\n    // How to clean up without ngOnDestroy?\n  }\n}`,
    options: [
      'inject(DestroyRef).onDestroy(() => clearInterval(timer));',
      'window.addEventListener("unload", () => clearInterval(timer));',
      'Services are never destroyed, so cleanup is not needed.',
      'Call this.destroy() inside constructor.'
    ],
    correctIndex: 0,
    explanation: 'inject(DestroyRef).onDestroy(() => ...) registers cleanup callbacks in any injection context (services, components, directives) cleanly.'
  },
  {
    id: 8,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'In an Angular 19 standalone component, which imports are required in the `imports: [...]` array to use DatePipe and ReactiveFormsModule?',
    options: [
      'Only NgModule in app.module.ts.',
      'Directly import DatePipe and ReactiveFormsModule in the component decorator imports array.',
      'Pipes and forms do not need to be imported in standalone components.',
      'Import them in index.html.'
    ],
    correctIndex: 1,
    explanation: 'Standalone components explicitly import every component, directive, pipe, and form module they use directly in their own `@Component({ imports: [...] })` array.'
  },
  {
    id: 9,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the purpose of `providedIn: "root"` on an `@Injectable()` service in modern enterprise applications?',
    options: [
      'It creates a new service instance for every component that injects it.',
      'It provides an application-wide singleton that is automatically tree-shaken by bundlers if never referenced.',
      'It executes the service in the Node.js root server process.',
      'It prevents other services from injecting this service.'
    ],
    correctIndex: 1,
    explanation: 'providedIn: "root" registers a singleton provider at the root level while enabling compiler tree-shaking for dead-code elimination.'
  },
  {
    id: 10,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'How do you bind a dynamic CSS class `bg-emerald-500` to a card when the signal `isActive()` is true?',
    options: [
      '<div [class.bg-emerald-500]="isActive()">',
      '<div class="isActive() ? bg-emerald-500 : \'\'">',
      '<div (class)="isActive()">',
      '<div [style.class]="isActive()">'
    ],
    correctIndex: 0,
    explanation: '`[class.class-name]="condition"` evaluates the expression and adds or removes the specified class.'
  },
  {
    id: 11,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'You want to create an InjectionToken for an API Base URL with a default value. How do you define it?',
    options: [
      'export const API_URL = new InjectionToken<string>("API_URL", { providedIn: "root", factory: () => "https://api.example.com" });',
      'export const API_URL = "https://api.example.com";',
      'export const API_URL = createToken("https://api.example.com");',
      'export const API_URL = provideToken("API_URL");'
    ],
    correctIndex: 0,
    explanation: 'new InjectionToken<T>("description", { providedIn: "root", factory: () => ... }) defines a tree-shakeable typed token with a default factory.'
  },
  {
    id: 12,
    category: 'FUNDAMENTALS',
    difficulty: 'ADVANCED',
    question: 'What happens if a service is provided in a Component\'s `providers: [LocalService]` array instead of `providedIn: "root"`?',
    options: [
      'The service becomes a global singleton shared by all routes.',
      'A new instance of LocalService is created for each component instance and destroyed when the component is destroyed.',
      'Angular throws a NullInjectorError at compile time.',
      'The service cannot inject HttpClient.'
    ],
    correctIndex: 1,
    explanation: 'Component-level providers create an isolated instance bounded to that component\'s lifecycle and injector sub-tree.'
  },
  {
    id: 13,
    category: 'FUNDAMENTALS',
    difficulty: 'INTERMEDIATE',
    question: 'Why should you avoid mutating arrays or objects in-place when updating Angular signals?',
    codeSnippet: `// Example:\nconst list = signal<string[]>(['Apple']);\n// Why is list().push('Banana') bad?`,
    options: [
      'Signals use Object.is referential equality; mutating the same array in-place will not trigger downstream computed or template updates.',
      'JavaScript arrays cannot store strings in signals.',
      'It throws a syntax error.',
      'It crashes the Node.js backend.'
    ],
    correctIndex: 0,
    explanation: 'Signals compare new vs previous values by reference (Object.is). In-place mutation keeps the same reference, so listeners will not be notified.'
  },
  {
    id: 14,
    category: 'FUNDAMENTALS',
    difficulty: 'EXPERT',
    question: 'You are migrating a legacy Angular app with Zone.js to Angular 19 Zoneless. What core architectural change must all components adopt?',
    options: [
      'All component state and template bindings must be driven by Signals or OnPush change detection to notify the scheduler of state changes.',
      'Every function must return a Promise.',
      'All templates must be written in JSX.',
      'Components must avoid using TypeScript.'
    ],
    correctIndex: 0,
    explanation: 'In Zoneless Angular, the framework no longer relies on monkey-patched DOM events; Signals notify the scheduler directly when state updates occur.'
  },
  {
    id: 15,
    category: 'FUNDAMENTALS',
    difficulty: 'BEGINNER',
    question: 'How do you format a raw ISO date string `2026-09-01T15:00:00Z` as "Sep 1, 2026" in an Angular template?',
    options: [
      '{{ dateString | date:\'mediumDate\' }}',
      '{{ dateString.format(\'MMM D, YYYY\') }}',
      '{{ formatDate(dateString) }}',
      '{{ dateString | toDate }}'
    ],
    correctIndex: 0,
    explanation: 'DatePipe with format string `mediumDate` formats the date according to locale rules (e.g. Sep 1, 2026).'
  },

  // SECTION 2: SIGNALS & STATE MANAGEMENT
  {
    id: 16,
    category: 'SIGNALS',
    difficulty: 'INTERMEDIATE',
    question: 'You have a product list signal `products` and a search query signal `searchQuery`. How should you compute the live filtered list?',
    codeSnippet: `readonly products = signal<Product[]>([]);\nreadonly searchQuery = signal<string>('');\n\n// How to declare filteredProducts?`,
    options: [
      'readonly filteredProducts = computed(() => { const q = this.searchQuery().toLowerCase(); return this.products().filter(p => p.name.toLowerCase().includes(q)); });',
      'readonly filteredProducts = effect(() => this.products().filter(p => p.name === this.searchQuery()));',
      'readonly filteredProducts = signal(this.products().filter(...));',
      'Use a template function getFilteredProducts() called on every change detection pass.'
    ],
    correctIndex: 0,
    explanation: 'computed() derives state from multiple signals, recalculating automatically whenever either dependency changes with memoized efficiency.'
  },
  {
    id: 17,
    category: 'SIGNALS',
    difficulty: 'INTERMEDIATE',
    question: 'In an e-commerce cart, you need to calculate `totalPrice` = `subtotal()` - `discount()` + `tax()`. What happens when only `discount()` changes?',
    options: [
      'Angular re-runs the entire component constructor.',
      'computed() re-evaluates totalPrice with glitch-free reactivity and updates only the specific DOM nodes reading totalPrice().',
      'You must manually call this.totalPrice.set().',
      'All HTTP requests are refetched.'
    ],
    correctIndex: 1,
    explanation: 'Angular Signals use a dependency graph that dynamically recalculates derived values and surgically updates affected DOM elements.'
  },
  {
    id: 18,
    category: 'SIGNALS',
    difficulty: 'ADVANCED',
    question: 'You have a parent component and a child CounterComponent that must synchronize a `count` value with two-way binding `[(count)]="parentCount"`. How is the child property defined?',
    codeSnippet: `@Component({ standalone: true, ... })\nexport class CounterComponent {\n  // How to declare count in child?\n}`,
    options: [
      'readonly count = model<number>(0);',
      '@Input() count = 0; @Output() countChange = new EventEmitter<number>();',
      'readonly count = signal<number>(0);',
      'readonly count = input.required<number>();'
    ],
    correctIndex: 0,
    explanation: 'model() creates a two-way signal binding that automatically defines both the input and the matching output event under the hood.'
  },
  {
    id: 19,
    category: 'SIGNALS',
    difficulty: 'INTERMEDIATE',
    question: 'You are receiving an RxJS Observable `user$` from an external auth library. How do you bridge it to an Angular Signal with a default null value?',
    options: [
      'readonly user = toSignal(this.authLib.user$, { initialValue: null });',
      'readonly user = signal(this.authLib.user$);',
      'readonly user = this.authLib.user$.toSignal();',
      'readonly user = fromObservable(this.authLib.user$);'
    ],
    correctIndex: 0,
    explanation: 'toSignal(observable$, { initialValue }) from @angular/core/rxjs-interop converts an Observable into a Signal with automatic subscription management.'
  },
  {
    id: 20,
    category: 'SIGNALS',
    difficulty: 'ADVANCED',
    question: 'You want an effect() to synchronize cart items to localStorage whenever `cartItems()` updates, but you do NOT want it to trigger when reading an analytics session ID signal. How do you exclude the session ID from tracking?',
    codeSnippet: `effect(() => {\n  const items = this.cartItems();\n  const sessionId = untracked(() => this.analyticsSessionId());\n  localStorage.setItem('cart', JSON.stringify({ items, sessionId }));\n});`,
    options: [
      'Use untracked(() => this.analyticsSessionId()) around the signal read.',
      'Remove the analytics signal.',
      'Use ignoreSignal(this.analyticsSessionId).',
      'Effects cannot read multiple signals.'
    ],
    correctIndex: 0,
    explanation: 'untracked(callback) executes the callback without registering any signal reads inside it as dependencies in the enclosing reactive context.'
  },
  {
    id: 21,
    category: 'SIGNALS',
    difficulty: 'ADVANCED',
    question: 'What is the purpose of `linkedSignal()` introduced in Angular 19?',
    codeSnippet: `// Scenario: When selectedCourseId() changes, selectedLessonId resets to the first lesson\nreadonly selectedLessonId = linkedSignal({\n  source: this.selectedCourseId,\n  computation: (courseId) => this.getFirstLessonId(courseId)\n});`,
    options: [
      'It creates a writable signal whose value automatically resets or recomputes when a source signal updates, while still allowing manual user writes.',
      'It creates a WebSocket link between client and server.',
      'It links two HTML input tags.',
      'It is an alias for computed().'
    ],
    correctIndex: 0,
    explanation: 'linkedSignal() provides writable state that resets to a fresh computation whenever its source dependency changes.'
  },
  {
    id: 22,
    category: 'SIGNALS',
    difficulty: 'BEGINNER',
    question: 'How do you append a new item "Task 1" to a signal array `tasks = signal<string[]>([])`?',
    options: [
      'this.tasks.update(prev => [...prev, "Task 1"]);',
      'this.tasks().push("Task 1");',
      'this.tasks.set("Task 1");',
      'this.tasks.add("Task 1");'
    ],
    correctIndex: 0,
    explanation: 'this.tasks.update(prev => [...prev, newItem]) creates a new immutable array reference and notifies all reactive subscribers.'
  },
  {
    id: 23,
    category: 'SIGNALS',
    difficulty: 'EXPERT',
    question: 'You notice an infinite loop error: "NG0600: Writing to signals is not allowed inside computed()". What is the architectural reason for this restriction?',
    options: [
      'Computed signals must be pure derivations of state without side effects to guarantee glitch-free execution and prevent infinite cycles.',
      'JavaScript memory limit.',
      'Prisma database locks.',
      'Browser security policies.'
    ],
    correctIndex: 0,
    explanation: 'computed() signals are strictly read-only and pure. Side effects and state mutations must be handled in event listeners or effects.'
  },
  {
    id: 24,
    category: 'SIGNALS',
    difficulty: 'ADVANCED',
    question: 'How do you declare an effect() outside of a component constructor (e.g. inside a dynamically invoked helper method)?',
    options: [
      'Pass the current Injector explicitly: effect(() => { ... }, { injector: this.injector });',
      'Effects can never be created outside constructors.',
      'Use global effect().',
      'Use setTimeout().'
    ],
    correctIndex: 0,
    explanation: 'If an effect() is created outside an active injection context, you must pass `{ injector: inject(Injector) }` in its options.'
  },
  {
    id: 25,
    category: 'SIGNALS',
    difficulty: 'INTERMEDIATE',
    question: 'How do you convert an Angular Signal `searchTerm` into an RxJS Observable with debounceTime for API queries?',
    codeSnippet: `const query$ = toObservable(this.searchTerm).pipe(\n  debounceTime(300),\n  distinctUntilChanged(),\n  switchMap(term => this.api.search(term))\n);`,
    options: [
      'Use `toObservable(this.searchTerm)` from `@angular/core/rxjs-interop`.',
      'Use `this.searchTerm.asObservable()`.',
      'Use `fromSignal(this.searchTerm)`.',
      'Use `new Observable(this.searchTerm)`.'
    ],
    correctIndex: 0,
    explanation: 'toObservable(mySignal) converts any signal into an RxJS stream that emits whenever the signal updates.'
  },
  {
    id: 26,
    category: 'SIGNALS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the return type of `computed(() => this.users().length)`?',
    options: [
      'Signal<number> (read-only signal)',
      'WritableSignal<number>',
      'Observable<number>',
      'number'
    ],
    correctIndex: 0,
    explanation: 'computed() returns a read-only Signal<T> without .set() or .update() methods.'
  },
  {
    id: 27,
    category: 'SIGNALS',
    difficulty: 'ADVANCED',
    question: 'You have a signal containing a complex object `selectedItem = signal<Item>(item, { equal: customCompare })`. Why would you provide a custom `equal` comparator?',
    options: [
      'To prevent unnecessary re-computations when the object is replaced with a new instance that has the exact same ID and content.',
      'To sort items alphabetically.',
      'To format the object to JSON.',
      'To encrypt the signal value.'
    ],
    correctIndex: 0,
    explanation: 'A custom equality function allows you to customize when a signal considers values equal (e.g. comparing by ID rather than memory reference).'
  },
  {
    id: 28,
    category: 'SIGNALS',
    difficulty: 'BEGINNER',
    question: 'How do you read a signal value named `currentUser` inside an HTML template?',
    options: [
      '<span>{{ currentUser()?.name }}</span>',
      '<span>{{ currentUser.name }}</span>',
      '<span>{{ currentUser | async }}</span>',
      '<span>{{ *currentUser.name }}</span>'
    ],
    correctIndex: 0,
    explanation: 'Signals are getter functions in TypeScript/HTML templates; invoking `currentUser()` reads the reactive value.'
  },
  {
    id: 29,
    category: 'SIGNALS',
    difficulty: 'EXPERT',
    question: 'What is the modern Angular 19 experimental primitive for declarative asynchronous data fetching directly linked to signals?',
    codeSnippet: `readonly userProfile = resource({\n  request: () => ({ id: this.userId() }),\n  loader: async ({ request }) => fetchUser(request.id)\n});`,
    options: [
      '`resource()` or `rxResource()` from `@angular/core`',
      '`asyncSignal()`',
      '`fetchSignal()`',
      '`querySignal()`'
    ],
    correctIndex: 0,
    explanation: 'Angular 19 introduces resource() and rxResource() to manage async requests as first-class reactive signal resources.'
  },
  {
    id: 30,
    category: 'SIGNALS',
    difficulty: 'INTERMEDIATE',
    question: 'How can you reset a signal `count` back to 0 when clicking a Reset button in the template?',
    options: [
      '<button (click)="count.set(0)">Reset</button>',
      '<button (click)="count = 0">Reset</button>',
      '<button (click)="count.reset()">Reset</button>',
      '<button (click)="count(0)">Reset</button>'
    ],
    correctIndex: 0,
    explanation: 'Calling `.set(0)` directly updates writable signals to the new value.'
  },

  // SECTION 3: COMPONENTS & ARCHITECTURE
  {
    id: 31,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'In Feature-Atomic Architecture (FAOS), you are building `/features/orders` and `/features/products`. Can `orders-view.component.ts` directly import internal components from `/features/products/components/`?',
    options: [
      'No! Feature isolation guarantees modules are decoupled; shared logic and components must be moved to `/shared` or `/core`.',
      'Yes, relative imports across any folder are encouraged.',
      'Only if both features are authored by the same engineer.',
      'Only if declared in angular.json.'
    ],
    correctIndex: 0,
    explanation: 'Strict feature isolation ensures features can be added, deleted, or refactored independently without breaking cross-feature circular dependencies.'
  },
  {
    id: 32,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the architectural distinction between "Smart (Container)" and "Dumb (Presentational)" components in Angular?',
    options: [
      'Smart components inject services, fetch data, and manage state; Dumb components only receive data via `input()` and emit events via `output()`.',
      'Smart components use TypeScript; Dumb components use JavaScript.',
      'Smart components have CSS; Dumb components have no styling.',
      'Dumb components are deprecated in Angular 19.'
    ],
    correctIndex: 0,
    explanation: 'Separating Smart view containers from reusable dumb UI components maximizes UI testability, reusability, and maintenance.'
  },
  {
    id: 33,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'Where should application-wide singleton services (like AuthService, AppConfig, and AuthInterceptor) be placed in a clean project structure?',
    options: [
      '`/src/app/core/`',
      '`/src/app/features/`',
      '`/src/app/shared/ui/`',
      '`/src/assets/`'
    ],
    correctIndex: 0,
    explanation: '`/core/` houses singleton infrastructure services, guards, and interceptors that are instantiated once for the entire application.'
  },
  {
    id: 34,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'You want to build a custom Form Control component `<app-rating-picker>` that works with `[formControl]` and `[(ngModel)]`. What interface must your component implement?',
    options: [
      'ControlValueAccessor with NG_VALUE_ACCESSOR provider.',
      'FormInterface',
      'InputAccessor',
      'ValueHandler'
    ],
    correctIndex: 0,
    explanation: 'ControlValueAccessor bridges custom UI components to Angular Reactive Forms via writeValue, registerOnChange, and registerOnTouched.'
  },
  {
    id: 35,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'Why should reusable UI components in `/shared/ui/` avoid injecting feature-specific services?',
    options: [
      'To ensure shared UI components remain generic, portable, and reusable across multiple features and projects.',
      'Because shared components cannot use dependency injection.',
      'To prevent HTML parsing errors.',
      'To reduce TypeScript compilation speed.'
    ],
    correctIndex: 0,
    explanation: 'Shared UI components should be pure presentational blocks that receive state via inputs and communicate via outputs.'
  },
  {
    id: 36,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'How do you configure a component to disable Angular\'s scoped CSS attribute encapsulation if you need global third-party library styling?',
    options: [
      'encapsulation: ViewEncapsulation.None in @Component decorator.',
      'encapsulation: ViewEncapsulation.ShadowDom',
      'Use global HTML link tags.',
      'Delete the CSS file.'
    ],
    correctIndex: 0,
    explanation: 'ViewEncapsulation.None applies component styles globally without adding Angular scoping attributes (`_ngcontent-xxx`).'
  },
  {
    id: 37,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the recommended approach for managing a global responsive sidebar state across multiple layout components?',
    options: [
      'A singleton UI state service with a writable signal `isSidebarOpen = signal(false)` and helper methods `toggle()` / `close()`.',
      'Using window.localStorage polling on a 500ms interval.',
      'Directly accessing parent DOM elements using document.getElementById().',
      'Passing props through 15 component levels.'
    ],
    correctIndex: 0,
    explanation: 'A lightweight UI state service with signals provides reactive, decoupled state sharing between headers, sidebars, and overlays.'
  },
  {
    id: 38,
    category: 'ARCHITECTURE',
    difficulty: 'EXPERT',
    question: 'You are building a high-performance DataGrid component that renders 10,000 rows. How should you design it to avoid rendering 10,000 DOM nodes simultaneously?',
    options: [
      'Use CDK Virtual Scrolling (`cdk-virtual-scroll-viewport`) to render only the visible viewport rows.',
      'Use standard @for with no pagination.',
      'Set display: none on non-visible rows.',
      'Convert the table to an image.'
    ],
    correctIndex: 0,
    explanation: 'Virtual scrolling dynamically renders only the rows currently visible inside the viewport, reducing DOM nodes from 10,000 to ~20.'
  },
  {
    id: 39,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you implement an empty state fallback when iterating over a task list in modern Angular?',
    codeSnippet: `@for (task of tasks(); track task.id) {\n  <app-task-card [task]="task" />\n} @empty {\n  <div class="empty-state">No tasks found.</div>\n}`,
    options: [
      'Use the native `@empty` block directly inside the `@for` loop.',
      'Wrap the `@for` in an `@if (tasks().length === 0)` check.',
      'Use *ngIf on a separate element.',
      'Render an empty string in the component.'
    ],
    correctIndex: 0,
    explanation: 'The native `@empty` block renders automatically whenever the iterated collection is empty or null.'
  },
  {
    id: 40,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'In an enterprise application with multi-tenancy, what is the best practice for ensuring all outgoing HTTP requests include the tenant slug?',
    options: [
      'A global HttpInterceptorFn that automatically attaches the `x-tenant-id` header to every request.',
      'Manually adding `{ headers: { "x-tenant-id": "xxx" } }` to every `http.get()` call in every component.',
      'Appending `?tenant=xxx` query param to every URL.',
      'Storing the tenant ID in window.global.'
    ],
    correctIndex: 0,
    explanation: 'Functional HTTP interceptors centralize tenant identification, authentication tokens, and correlation IDs in one maintainable pipeline.'
  },
  {
    id: 41,
    category: 'ARCHITECTURE',
    difficulty: 'BEGINNER',
    question: 'What is the main benefit of Standalone Components in Angular 19 compared to legacy NgModules?',
    options: [
      'They declare their own dependencies directly, eliminating confusing module declarations, reducing bundle chunk sizes, and speeding up compilation.',
      'They do not use TypeScript.',
      'They can only be rendered on mobile phones.',
      'They eliminate HTML templates.'
    ],
    correctIndex: 0,
    explanation: 'Standalone components simplify the mental model by explicitly importing exactly what they use with zero NgModule boilerplate.'
  },
  {
    id: 42,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you create a type-safe Toast/Notification system in Angular 19?',
    options: [
      'A singleton ToastService storing an array of active toasts in a signal `toasts = signal<Toast[]>([])`, rendered by a global `<app-toast-container>`.',
      'Using window.alert() popups.',
      'Creating 50 separate components on every page.',
      'Using jQuery toast plugins.'
    ],
    correctIndex: 0,
    explanation: 'A signal-driven ToastService provides centralized dispatching (`show()`, `dismiss()`) and reactive rendering in a top-level container.'
  },
  {
    id: 43,
    category: 'ARCHITECTURE',
    difficulty: 'EXPERT',
    question: 'You are designing a design system with light and dark theme support. How should you structure CSS variables and Tailwind classes for clean switching?',
    options: [
      'Define semantic CSS variables on `:root` and `.dark` classes (e.g. `--background`, `--foreground`), toggling the `.dark` class on `<html>` via a ThemeService.',
      'Hardcode hex colors directly in inline HTML style attributes.',
      'Reload the entire browser page with a new CSS file link.',
      'Create two completely separate Angular applications.'
    ],
    correctIndex: 0,
    explanation: 'Semantic CSS variables mapped to HSL tokens allow instant runtime theme switching without flashing or duplicate stylesheets.'
  },
  {
    id: 44,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'What is the role of `Environment` files in modern Angular applications?',
    options: [
      'To provide environment-specific configuration constants (e.g. production API endpoints, feature flags) replaced during `ng build`.',
      'To store server-side database passwords.',
      'To run shell scripts.',
      'To install npm dependencies.'
    ],
    correctIndex: 0,
    explanation: 'Environment files provide build-target configurations (development vs staging vs production API URLs).'
  },
  {
    id: 45,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'How should you organize feature views versus sub-components inside a feature directory in FAOS architecture?',
    codeSnippet: `/src/app/features/users/\n├── components/       # Feature-specific reusable UI (user-card, user-filter)\n├── services/         # Feature API and state services\n└── views/            # Routable screen views (users-view, user-detail-view)`,
    options: [
      'Separate routable screen pages in `views/` and smaller feature sub-components in `components/`.',
      'Put all 50 files in a single flat folder.',
      'Put all HTML in index.html.',
      'Put all components in node_modules.'
    ],
    correctIndex: 0,
    explanation: 'Separating routable views from smaller sub-components provides clean navigation routes and modular component boundaries.'
  },

  // SECTION 4: ROUTING & LAZY LOADING
  {
    id: 46,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you configure a route in `app.routes.ts` to lazy-load a standalone `DashboardViewComponent` chunk on-demand?',
    options: [
      '{ path: "dashboard", loadComponent: () => import("./features/dashboard/dashboard.component").then(m => m.DashboardViewComponent) }',
      '{ path: "dashboard", component: DashboardViewComponent }',
      '{ path: "dashboard", lazy: true }',
      '{ path: "dashboard", module: () => DashboardModule }'
    ],
    correctIndex: 0,
    explanation: '`loadComponent` with dynamic `import()` enables automatic code splitting, downloading the JavaScript chunk only when the user navigates to `/dashboard`.'
  },
  {
    id: 47,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'A user navigates to `/products/:id`. How can the `ProductDetailComponent` automatically receive the `id` parameter as a signal input?',
    codeSnippet: `// 1. In app.config.ts:\nprovideRouter(routes, withComponentInputBinding());\n\n// 2. In ProductDetailComponent:\nexport class ProductDetailComponent {\n  readonly id = input.required<string>();\n}`,
    options: [
      'Enable `withComponentInputBinding()` in `provideRouter()`; the route param binds directly to `id = input<string>()`.',
      'Manually subscribe to ActivatedRoute.params inside ngOnInit().',
      'Read window.location.pathname with regex.',
      'Pass the ID as a global variable.'
    ],
    correctIndex: 0,
    explanation: '`withComponentInputBinding()` automatically maps URL route parameters, query parameters, and route data directly into matching `input()` signals.'
  },
  {
    id: 48,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'You want to protect an admin route `/admin` so unauthenticated visitors are redirected to `/login`. How do you write a modern functional `CanActivateFn` guard?',
    codeSnippet: `export const authGuard: CanActivateFn = () => {\n  const auth = inject(AuthService);\n  const router = inject(Router);\n  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);\n};`,
    options: [
      'A functional `CanActivateFn` returning a boolean or `UrlTree` for redirection.',
      'An @Injectable() class implementing the deprecated CanActivate interface.',
      'A global window.location redirect inside index.html.',
      'Writing an Express middleware in frontend code.'
    ],
    correctIndex: 0,
    explanation: 'Functional guards (`CanActivateFn`) use inject() directly and return `UrlTree` instances for safe, synchronous redirection.'
  },
  {
    id: 49,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'A user is editing a form on `/settings`. If they attempt to navigate away with unsaved changes, you want to show a confirmation dialog. Which guard should you use?',
    options: [
      'CanDeactivateFn',
      'CanActivateFn',
      'CanMatchFn',
      'ResolveFn'
    ],
    correctIndex: 0,
    explanation: 'CanDeactivateFn checks if the active component allows navigation away, prompting users to confirm discarding unsaved edits.'
  },
  {
    id: 50,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you handle 404 or unknown URLs by redirecting all unmatched paths to the `/dashboard` route?',
    options: [
      '{ path: "**", redirectTo: "dashboard" } placed as the LAST item in the routes array.',
      '{ path: "*", redirectTo: "dashboard" } placed at the top of the routes array.',
      '{ path: "404", component: NotFoundComponent } without wildcard.',
      'Handling 404 in server nginx configuration only.'
    ],
    correctIndex: 0,
    explanation: 'The wildcard route `{ path: "**", redirectTo: "..." }` matches any unhandled path and must be placed at the very end of the routes array.'
  },
  {
    id: 51,
    category: 'ROUTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you navigate programmatically with query parameters `/products?category=electronics&sort=asc` in modern Angular?',
    options: [
      'this.router.navigate(["/products"], { queryParams: { category: "electronics", sort: "asc" } });',
      'this.router.navigate(["/products?category=electronics&sort=asc"]);',
      'window.location.search = "category=electronics";',
      'this.router.setQuery("category", "electronics");'
    ],
    correctIndex: 0,
    explanation: 'The `queryParams` property in NavigationExtras allows passing structured query parameters safely.'
  },
  {
    id: 52,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'You want to prefetch critical product details before rendering the route component to prevent UI layout shifts. Which routing feature should you use?',
    options: [
      'ResolveFn (Route Resolvers)',
      'CanActivateChildFn',
      'PreloadAllModules',
      'RouterOutlet'
    ],
    correctIndex: 0,
    explanation: 'A functional `ResolveFn` resolves required data before completing navigation, passing the data into the activated route snapshot.'
  },
  {
    id: 53,
    category: 'ROUTING',
    difficulty: 'ADVANCED',
    question: 'How do you configure Angular Router to prefetch all lazy-loaded chunks in the background after the initial page loads?',
    options: [
      'provideRouter(routes, withPreloading(PreloadAllModules)) in app.config.ts',
      'Set lazy: false on all routes.',
      'Import all components in main.ts.',
      'Use HTML <link rel="preload"> for all JavaScript files.'
    ],
    correctIndex: 0,
    explanation: '`withPreloading(PreloadAllModules)` downloads lazy route chunks during idle network periods after initial boot for instant future navigations.'
  },
  {
    id: 54,
    category: 'ROUTING',
    difficulty: 'BEGINNER',
    question: 'How do you highlight an active navigation link in your sidebar with the CSS class "bg-primary text-white"?',
    options: [
      '<a routerLink="/dashboard" routerLinkActive="bg-primary text-white">Dashboard</a>',
      '<a routerLink="/dashboard" [class.active]="true">Dashboard</a>',
      '<a href="/dashboard" activeClass="bg-primary">Dashboard</a>',
      '<a (click)="navigate()" class="active">Dashboard</a>'
    ],
    correctIndex: 0,
    explanation: 'The `routerLinkActive` directive automatically applies the specified CSS classes whenever its matching `routerLink` URL is active.'
  },
  {
    id: 55,
    category: 'ROUTING',
    difficulty: 'EXPERT',
    question: 'You want to conditionally match a route `/feature` based on whether an experimental feature flag signal is enabled. Which guard is most suitable?',
    options: [
      'CanMatchFn (skips the route configuration entirely if the flag is false, allowing fallback routes)',
      'CanActivateFn',
      'CanDeactivateFn',
      'ResolveFn'
    ],
    correctIndex: 0,
    explanation: 'CanMatchFn determines whether a route can even be matched, allowing different components to be rendered on the exact same path based on runtime conditions.'
  },

  // SECTION 5: REACTIVE FORMS & VALIDATION
  {
    id: 56,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'You are building a production registration form. Why should you use a strict regex pattern validator for emails instead of basic `Validators.email`?',
    options: [
      'Validators.email adheres to the loose HTML5 specification, which allows local hostnames without domain extensions like "test@localhost" or "user@domain".',
      'Validators.email is deprecated in Angular 19.',
      'Validators.email only works with Gmail.',
      'Regex is required by browser security.'
    ],
    correctIndex: 0,
    explanation: 'Strict enterprise validation uses `Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/)` to enforce valid TLD extensions.'
  },
  {
    id: 57,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'You need to validate that a "password" and "confirmPassword" field match in a FormGroup. How do you implement this custom validator?',
    codeSnippet: `export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {\n  const password = control.get('password')?.value;\n  const confirmPassword = control.get('confirmPassword')?.value;\n  return password === confirmPassword ? null : { passwordMismatch: true };\n};`,
    options: [
      'Apply the validator at the FormGroup level: `new FormGroup({ ... }, { validators: passwordMatchValidator })`.',
      'Apply it to each FormControl individually.',
      'Compare values in the template with `*ngIf`.',
      'Check values only on the Node.js backend.'
    ],
    correctIndex: 0,
    explanation: 'Cross-field validation that compares two sibling controls must be attached as a validator on the parent FormGroup.'
  },
  {
    id: 58,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'You are building an invoice form where users can dynamically add or remove line items. What Reactive Forms structure should you use?',
    options: [
      'FormArray containing FormGroups for each line item.',
      'An array of plain strings in local component state.',
      'Creating 50 hardcoded FormControls (item1, item2, item3...).',
      'A plain HTML table.'
    ],
    correctIndex: 0,
    explanation: 'FormArray manages dynamic, variable-length lists of FormControls or FormGroups with methods like `.push()`, `.removeAt()`, and `.length`.'
  },
  {
    id: 59,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'You want to check if a username is already taken by calling a backend API as the user types. How do you implement this?',
    codeSnippet: `function usernameAsyncValidator(userService: UserService): AsyncValidatorFn {\n  return (control: AbstractControl): Observable<ValidationErrors | null> => {\n    return timer(400).pipe(\n      switchMap(() => userService.checkUsername(control.value)),\n      map(isTaken => isTaken ? { usernameTaken: true } : null),\n      catchError(() => of(null))\n    );\n  };\n}`,
    options: [
      'Pass the debounced async validator function as the 3rd argument (asyncValidators) when creating the FormControl.',
      'Call the API inside an input (change) event listener.',
      'Check the username in an effect().',
      'Async validation cannot be done in Reactive Forms.'
    ],
    correctIndex: 0,
    explanation: 'Async validators return Observable<ValidationErrors | null> and are passed as the asyncValidators parameter on FormControl.'
  },
  {
    id: 60,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the difference between `form.setValue(data)` and `form.patchValue(data)`?',
    options: [
      'setValue() strictly requires values for all controls in the form structure; patchValue() safely updates only the specified subset of fields.',
      'patchValue() is asynchronous while setValue() is synchronous.',
      'setValue() cannot set strings.',
      'There is no functional difference.'
    ],
    correctIndex: 0,
    explanation: 'setValue() throws an error if any field is missing from the payload object, while patchValue() allows partial updates.'
  },
  {
    id: 61,
    category: 'FORMS',
    difficulty: 'BEGINNER',
    question: 'When should validation error messages be displayed under an input field for the best user experience?',
    options: [
      'When the control has been interacted with (`control.touched` or `control.dirty`) AND is invalid (`control.invalid`).',
      'Immediately when the page loads before user interaction.',
      'Only when the backend crashes.',
      'Never show error messages.'
    ],
    correctIndex: 0,
    explanation: 'Checking `touched && invalid` prevents flashing intrusive error messages on clean, untouched forms.'
  },
  {
    id: 62,
    category: 'FORMS',
    difficulty: 'INTERMEDIATE',
    question: 'A user clicks "Submit" without filling out any fields. How do you programmatically trigger all validation errors to display in the UI?',
    options: [
      '`this.myForm.markAllAsTouched();`',
      '`this.myForm.reset();`',
      '`this.myForm.updateValueAndValidity();`',
      '`this.myForm.touch();`'
    ],
    correctIndex: 0,
    explanation: '`form.markAllAsTouched()` recursively marks all descendant controls as touched, causing template error conditions to trigger.'
  },
  {
    id: 63,
    category: 'FORMS',
    difficulty: 'ADVANCED',
    question: 'The backend returns a 422 Unprocessable Entity with `{ errors: { email: ["Email already exists"] } }`. How do you attach this error directly to the `email` FormControl?',
    options: [
      '`this.myForm.get("email")?.setErrors({ serverError: "Email already exists" });`',
      '`this.myForm.value.email.error = "Email already exists";`',
      '`this.myForm.reset();`',
      '`window.alert("Email exists");`'
    ],
    correctIndex: 0,
    explanation: '`control.setErrors({ customKey: message })` manually sets validation errors on specific form controls.'
  },
  {
    id: 64,
    category: 'FORMS',
    difficulty: 'BEGINNER',
    question: 'How do you disable a submit button while any field in a Reactive Form is invalid?',
    options: [
      '<button type="submit" [disabled]="myForm.invalid">Save</button>',
      '<button type="submit" [disabled]="myForm.valid">Save</button>',
      '<button type="submit" (disable)="myForm.errors">Save</button>',
      '<button type="submit" [hidden]="myForm.invalid">Save</button>'
    ],
    correctIndex: 0,
    explanation: 'Binding `[disabled]="myForm.invalid"` keeps the button disabled until all synchronous and asynchronous validators pass.'
  },
  {
    id: 65,
    category: 'FORMS',
    difficulty: 'EXPERT',
    question: 'How do you convert a FormControl\'s `valueChanges` observable into an Angular Signal with automatic unsubscription?',
    options: [
      'readonly emailValue = toSignal(this.myForm.controls.email.valueChanges, { initialValue: "" });',
      'readonly emailValue = signal(this.myForm.controls.email.value);',
      'readonly emailValue = this.myForm.controls.email.valueChanges.toSignal();',
      'readonly emailValue = fromObservable(this.myForm);'
    ],
    correctIndex: 0,
    explanation: '`toSignal(control.valueChanges, { initialValue })` bridges form changes to a reactive Signal safely.'
  },

  // SECTION 6: HTTP, TANSTACK QUERY & RXJS
  {
    id: 66,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'You create a new order via a POST request mutation. What should your Angular application do immediately after the mutation succeeds to ensure cached order lists update?',
    codeSnippet: `const mutation = injectMutation(() => ({\n  mutationFn: (newOrder: Order) => createOrderApi(newOrder),\n  onSuccess: () => {\n    // What should happen here?\n  }\n}));`,
    options: [
      'Call `this.queryClient.invalidateQueries({ queryKey: ["orders"] })` to mark the cache stale and trigger auto-refetching.',
      'Force reload the entire browser page with window.location.reload().',
      'Do nothing and wait 10 minutes.',
      'Clear all browser localStorage.'
    ],
    correctIndex: 0,
    explanation: 'Invalidating queries by queryKey marks active cached data as stale, causing TanStack Query to refetch fresh data automatically.'
  },
  {
    id: 67,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'A user types in a live autocomplete search bar. How do you cancel any previous in-flight HTTP request when a new character is typed?',
    codeSnippet: `this.searchControl.valueChanges.pipe(\n  debounceTime(300),\n  distinctUntilChanged(),\n  // Which flattening operator cancels prior in-flight requests?\n  switchMap(query => this.http.get(\`/api/search?q=\${query}\`))\n);`,
    options: [
      'Use `switchMap()` which unsubscribes and cancels previous in-flight HTTP requests upon new emissions.',
      'Use `mergeMap()` which runs all requests in parallel.',
      'Use `concatMap()` which queues requests sequentially.',
      'Use `exhaustMap()` which ignores subsequent requests.'
    ],
    correctIndex: 0,
    explanation: 'switchMap cancels previous inner observables/requests whenever a new value is emitted, avoiding race conditions.'
  },
  {
    id: 68,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'You are writing an `HttpInterceptorFn` that adds a Bearer authorization token. Why must you clone the request with `req.clone()` instead of modifying `req.headers` directly?',
    options: [
      'HttpRequest objects in Angular are strictly immutable; headers cannot be mutated directly in-place.',
      'To make requests run faster.',
      'For TypeScript linting reasons.',
      'Because JavaScript objects cannot store strings.'
    ],
    correctIndex: 0,
    explanation: 'HttpRequest instances are immutable. `req.clone({ setHeaders: { ... } })` creates an updated copy safely.'
  },
  {
    id: 69,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you handle transient network failures by retrying failed GET requests up to 2 times with a 1-second delay in RxJS?',
    options: [
      '`this.http.get("/api/data").pipe(retry({ count: 2, delay: 1000 }));`',
      '`this.http.get("/api/data", { retry: 2 });`',
      '`this.http.get("/api/data").repeat(2);`',
      '`this.http.retry(2);`'
    ],
    correctIndex: 0,
    explanation: 'The `retry({ count, delay })` operator automatically resubscribes to the request stream upon encountering errors.'
  },
  {
    id: 70,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'An admin dashboard currently polls `/api/orders` every 5 seconds. You introduce real-time Socket.IO events (`order.created`, `order.updated`). What is the recommended production architecture?',
    options: [
      'Use Socket.IO events to update signal state or invalidate queries immediately in real-time, while retaining slow polling (e.g. 60s) as a resilient recovery fallback.',
      'Keep 5-second polling and ignore WebSocket events.',
      'Remove all data fetching completely.',
      'Reload the entire webpage on every socket event.'
    ],
    correctIndex: 0,
    explanation: 'Combining real-time WebSockets with slow background synchronization provides instant UI updates with resilient recovery.'
  },
  {
    id: 71,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you register a functional HTTP interceptor in `app.config.ts` in Angular 19?',
    options: [
      '`provideHttpClient(withInterceptors([authInterceptor, tenantInterceptor]))`',
      '`providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]`',
      '`app.use(authInterceptor)`',
      '`HttpClient.add(authInterceptor)`'
    ],
    correctIndex: 0,
    explanation: '`provideHttpClient(withInterceptors([...]))` is the modern tree-shakeable mechanism for functional interceptors.'
  },
  {
    id: 72,
    category: 'HTTP_QUERY',
    difficulty: 'ADVANCED',
    question: 'How should an HTTP interceptor handle a 401 Unauthorized response globally?',
    codeSnippet: `return next(req).pipe(\n  catchError((err: HttpErrorResponse) => {\n    if (err.status === 401) {\n      authService.logout();\n      router.navigate(['/login']);\n    }\n    return throwError(() => err);\n  })\n);`,
    options: [
      'Catch the error in `catchError()`, call `authService.logout()`, and redirect to `/login` via `Router.navigate()`.',
      'Ignore the error and return null.',
      'Show an alert popup and freeze the application.',
      'Delete the backend database.'
    ],
    correctIndex: 0,
    explanation: 'Catching 401 in a global interceptor clears stale credentials and routes the user to the login screen cleanly.'
  },
  {
    id: 73,
    category: 'HTTP_QUERY',
    difficulty: 'INTERMEDIATE',
    question: 'What is the primary benefit of TanStack Angular Query\'s `injectQuery()` over manual `http.get().subscribe()` calls?',
    options: [
      'Automated background caching, request deduplication, retry handling, and reactive `data()`, `isLoading()`, `isError()` signals without subscription leak risks.',
      'It converts REST endpoints to GraphQL automatically.',
      'It eliminates the need for a backend server.',
      'It allows running SQL queries in the browser.'
    ],
    correctIndex: 0,
    explanation: 'TanStack Query provides robust server-state caching and reactive signal wrappers with zero subscription maintenance overhead.'
  },
  {
    id: 74,
    category: 'HTTP_QUERY',
    difficulty: 'EXPERT',
    question: 'How do you implement optimistic UI updates for a "Like" button before the backend API responds?',
    options: [
      'Update the local signal immediately on click, then send the API mutation; if the API call fails, revert the signal to its previous value in the error callback.',
      'Wait 5 seconds before showing the like icon.',
      'Never show the like icon until the user refreshes the page.',
      'Optimistic updates cannot be done in Angular.'
    ],
    correctIndex: 0,
    explanation: 'Optimistic updates provide instant UI feedback with automatic rollback on network error.'
  },
  {
    id: 75,
    category: 'HTTP_QUERY',
    difficulty: 'BEGINNER',
    question: 'How do you send query parameters `?page=1&limit=10` using Angular HttpClient?',
    options: [
      'const params = new HttpParams().set("page", 1).set("limit", 10); this.http.get(url, { params });',
      'this.http.get(url, { body: { page: 1, limit: 10 } });',
      'this.http.get(url, { headers: { page: 1 } });',
      'this.http.params({ page: 1, limit: 10 });'
    ],
    correctIndex: 0,
    explanation: 'HttpParams creates immutable query parameter collections passed in the request options.'
  },

  // SECTION 7: PERFORMANCE & OPTIMIZATION
  {
    id: 76,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'A product marketplace page contains product details, customer reviews, related items, and inventory. The customer reviews section contains heavy charts and 500 comments. What Angular feature should you use to defer loading reviews until they scroll into view?',
    codeSnippet: `@defer (on viewport) {\n  <app-product-reviews [productId]="product().id" />\n} @placeholder {\n  <div class="reviews-placeholder">Scroll to load reviews...</div>\n}`,
    options: [
      '`@defer (on viewport)` block with `@placeholder`',
      '`*ngIf="isScrolled"` with window scroll event listener',
      'CSS `opacity: 0`',
      '`setTimeout(() => loadReviews(), 10000)`'
    ],
    correctIndex: 0,
    explanation: '@defer (on viewport) splits the reviews component into a lazy chunk downloaded only when its placeholder intersects the viewport.'
  },
  {
    id: 77,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'A table rendering 1,000 items becomes slow and flickers when new items are added. The template uses `@for (item of items; track $index)`. What should you change?',
    options: [
      'Change `track $index` to `track item.id` so Angular can track items by unique identity and move DOM nodes instead of destroying and recreating them.',
      'Remove `@for` and use 1,000 hardcoded rows.',
      'Add `ChangeDetectionStrategy.Default`.',
      'Change the CSS font size.'
    ],
    correctIndex: 0,
    explanation: 'Tracking by unique stable ID preserves DOM identity and component state during array insertions, deletions, and sorting.'
  },
  {
    id: 78,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'What is the performance advantage of `ChangeDetectionStrategy.OnPush` on an Angular component?',
    options: [
      'Angular skips checking the component and its children unless an `@Input()` reference changes, a component event fires, or a Signal read in the template notifies.',
      'It moves component computation to a Web Worker thread.',
      'It renders the component on the server only.',
      'It disables JavaScript in the component.'
    ],
    correctIndex: 0,
    explanation: 'OnPush limits change detection passes strictly to when inputs or signals change, eliminating wasteful tree-wide dirty checking passes.'
  },
  {
    id: 79,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'You want to prevent Cumulative Layout Shift (CLS) and automatically generate responsive `srcset` attributes for hero images. Which Angular directive should you use?',
    options: [
      '`<img [ngSrc]="imageUrl" width="800" height="400" priority />` with NgOptimizedImage',
      '`<img [src]="imageUrl" />`',
      '`<picture><img src="..." /></picture>`',
      '`<canvas [image]="imageUrl"></canvas>`'
    ],
    correctIndex: 0,
    explanation: 'NgOptimizedImage (`ngSrc`) enforces aspect ratios to prevent CLS, provides automatic responsive srcset, and optimizes web vitals.'
  },
  {
    id: 80,
    category: 'PERFORMANCE',
    difficulty: 'EXPERT',
    question: 'What is Non-Destructive Client Hydration enabled via `provideClientHydration()` in Angular 19 SSR?',
    options: [
      'The client preserves server-rendered DOM nodes and attaches event listeners/signals seamlessly without destroying and recreating the DOM tree.',
      'It converts server HTML to client canvas.',
      'It downloads the database to the client browser.',
      'It deletes all HTML and rebuilds from scratch.'
    ],
    correctIndex: 0,
    explanation: 'Non-destructive hydration avoids screen flickering and preserves DOM and input state during client startup.'
  },
  {
    id: 81,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you prevent UI flickering when a `@defer` block loads in under 30ms on fast network connections?',
    options: [
      'Use `@loading (minimum 500ms)` to ensure the loading skeleton is displayed for a minimum readable duration.',
      'Add a `setTimeout` in the component.',
      'Throttle the entire backend server.',
      'Remove `@loading` block.'
    ],
    correctIndex: 0,
    explanation: '`@loading (minimum 500ms)` prevents rapid flash-of-loading-content (flickering) on high-speed connections.'
  },
  {
    id: 82,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'Why does calling a function directly inside an HTML template interpolation `{{ computeDiscount(product) }}` harm performance when NOT using Signals?',
    options: [
      'Template functions re-execute on EVERY single change detection cycle across the entire page, causing severe performance degradation.',
      'Functions cannot return strings in templates.',
      'It causes memory leaks.',
      'It fails at compile time.'
    ],
    correctIndex: 0,
    explanation: 'Template functions re-run repeatedly on every change detection pass. Use `computed()` signals or Pure Pipes instead.'
  },
  {
    id: 83,
    category: 'PERFORMANCE',
    difficulty: 'EXPERT',
    question: 'You notice your initial JavaScript bundle is 2.5MB. Which tool and command should you run to analyze exact chunk dependencies?',
    options: [
      'Build with stats `ng build --stats-json` and inspect with `source-map-explorer` or `webpack-bundle-analyzer`.',
      'Check the size of `node_modules` folder.',
      'Count the number of TypeScript files in src.',
      'Ask the browser console.'
    ],
    correctIndex: 0,
    explanation: 'Analyzing stats.json with source-map-explorer reveals heavy third-party packages and un-deferred imports.'
  },
  {
    id: 84,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you prefetch a deferred component bundle when the browser is idle before the user clicks a button?',
    options: [
      '`@defer (on interaction(btn); prefetch on idle)`',
      '`@defer (on idle; load on click)`',
      '`@defer (preload: true)`',
      '`@defer (prefetch: true)`'
    ],
    correctIndex: 0,
    explanation: '`prefetch on idle` downloads the JavaScript bundle in the background so it renders instantly when the interaction trigger fires.'
  },
  {
    id: 85,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'Why are Pure Pipes more performant than calling component methods in templates?',
    options: [
      'Pure pipes cache transformation outputs and only re-execute when their input primitive value or object reference changes.',
      'Pure pipes run in WebAssembly.',
      'Pure pipes do not use JavaScript.',
      'Pure pipes run only on the server.'
    ],
    correctIndex: 0,
    explanation: 'Pure pipes are memoized by input reference, skipping execution when inputs remain unchanged.'
  },

  // SECTION 8: TESTING & QUALITY
  {
    id: 86,
    category: 'TESTING',
    difficulty: 'INTERMEDIATE',
    question: 'You are writing a unit test for a component with a writable signal `count = signal(0)`. How do you verify the template updates after changing the signal?',
    codeSnippet: `it('should update display when count changes', () => {\n  component.count.set(5);\n  fixture.detectChanges();\n  const text = fixture.nativeElement.querySelector('.count-text').textContent;\n  expect(text).toContain('5');\n});`,
    options: [
      'Update the signal with `component.count.set(5)`, call `fixture.detectChanges()`, and assert the DOM text content.',
      'Signals cannot be tested with TestBed.',
      'Wait 10 seconds with setTimeout.',
      'Re-create the TestBed on every assertion.'
    ],
    correctIndex: 0,
    explanation: 'Calling `fixture.detectChanges()` synchronizes signal state changes to the test fixture DOM.'
  },
  {
    id: 87,
    category: 'TESTING',
    difficulty: 'ADVANCED',
    question: 'How do you mock HTTP API requests in Angular unit tests without making actual network calls?',
    options: [
      'Provide `provideHttpClientTesting()` and use `HttpTestingController` to expect and flush mock responses.',
      'Delete the HttpClient provider.',
      'Mock window.fetch with jest.fn().',
      'Disable internet access during tests.'
    ],
    correctIndex: 0,
    explanation: 'HttpTestingController from `@angular/common/http/testing` intercepts HTTP calls and allows flushing mock payloads.'
  },
  {
    id: 88,
    category: 'TESTING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you test a functional `CanActivateFn` guard in isolation?',
    codeSnippet: `it('should block unauthenticated users', () => {\n  TestBed.configureTestingModule({\n    providers: [\n      { provide: AuthService, useValue: { isAuthenticated: () => false } }\n    ]\n  });\n  const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));\n  expect(result).toBeInstanceOf(UrlTree);\n});`,
    options: [
      'Use `TestBed.runInInjectionContext(() => authGuard(route, state))` to execute the guard within a test injection context.',
      'Guards can only be tested using Cypress E2E tests.',
      'Instantiate the guard with new AuthGuard().',
      'Call window.location.href.'
    ],
    correctIndex: 0,
    explanation: '`TestBed.runInInjectionContext()` allows executing functional guards, interceptors, and inject() calls in unit tests.'
  },
  {
    id: 89,
    category: 'TESTING',
    difficulty: 'BEGINNER',
    question: 'How do you simulate a user clicking a button in a component unit test?',
    options: [
      'const button = fixture.debugElement.query(By.css("button")); button.triggerEventHandler("click", null);',
      'button.click(); window.reload();',
      'component.ngOnInit();',
      'fixture.destroy();'
    ],
    correctIndex: 0,
    explanation: '`triggerEventHandler("click", null)` or `element.nativeElement.click()` simulates DOM click events in test fixtures.'
  },
  {
    id: 90,
    category: 'TESTING',
    difficulty: 'ADVANCED',
    question: 'You have a computed signal `totalPrice = computed(() => this.price() * this.qty())`. What should your unit test assert?',
    options: [
      'Assert initial computation, update `price.set()` or `qty.set()`, and assert that `totalPrice()` recalculates the expected product.',
      'Assert that totalPrice is an Observable.',
      'Assert that price is a string.',
      'Computed signals cannot be tested.'
    ],
    correctIndex: 0,
    explanation: 'Testing computed signals involves setting dependencies and verifying the computed getter returns the derived value.'
  },

  // SECTION 9: SECURITY & AUTH
  {
    id: 91,
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    question: 'Why should JWT authentication tokens be stored in HTTP-Only, Secure, SameSite cookies instead of localStorage in enterprise applications?',
    options: [
      'HTTP-Only cookies cannot be accessed or stolen by malicious client-side JavaScript in the event of an XSS (Cross-Site Scripting) vulnerability.',
      'localStorage has a 5MB storage limit.',
      'Cookies are faster to read than JavaScript memory.',
      'localStorage is deprecated in modern browsers.'
    ],
    correctIndex: 0,
    explanation: 'HTTP-Only cookies protect session tokens from XSS theft because the browser automatically attaches them without JavaScript exposure.'
  },
  {
    id: 92,
    category: 'SECURITY',
    difficulty: 'INTERMEDIATE',
    question: 'How does Angular prevent Cross-Site Scripting (XSS) when binding user-submitted text in templates using `{{ userInput }}`?',
    options: [
      'Angular treats all template interpolation values as untrusted and automatically escapes executable HTML tags and script elements.',
      'Angular converts all text to images.',
      'Angular disables JavaScript on the client.',
      'Angular relies on the user to sanitize text.'
    ],
    correctIndex: 0,
    explanation: 'Angular\'s built-in sanitizer automatically escapes dynamic HTML values in interpolations and property bindings.'
  },
  {
    id: 93,
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    question: 'You must render trusted HTML containing custom styles from a verified CMS source using `[innerHTML]`. What service must you use?',
    codeSnippet: `constructor(private sanitizer: DomSanitizer) {}\ngetSafeHtml(rawHtml: string) {\n  return this.sanitizer.bypassSecurityTrustHtml(rawHtml);\n}`,
    options: [
      '`DomSanitizer.bypassSecurityTrustHtml()`',
      '`eval(rawHtml)`',
      '`document.write(rawHtml)`',
      '`JSON.parse(rawHtml)`'
    ],
    correctIndex: 0,
    explanation: '`DomSanitizer.bypassSecurityTrustHtml()` tells Angular to trust the provided HTML string without stripping attributes.'
  },
  {
    id: 94,
    category: 'SECURITY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you implement role-based route access control in a functional `roleGuard`?',
    codeSnippet: `export const roleGuard = (requiredRole: string): CanActivateFn => {\n  return () => {\n    const auth = inject(AuthService);\n    const router = inject(Router);\n    return auth.user()?.role === requiredRole ? true : router.createUrlTree(['/unauthorized']);\n  };\n};`,
    options: [
      'Create a parameterized `CanActivateFn` factory that checks `authService.user()?.role === requiredRole`.',
      'Check the role inside index.html.',
      'Hide the navigation links with CSS display: none.',
      'Hardcode passwords in component files.'
    ],
    correctIndex: 0,
    explanation: 'A guard factory function checks user role claims and returns a redirection UrlTree if permissions are insufficient.'
  },
  {
    id: 95,
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    question: 'Why does the Express backend reject frontend requests with custom headers like `x-tenant-id` if `corsMiddleware` does not allowlist them?',
    options: [
      'Browsers send an HTTP `OPTIONS` preflight request; if `Access-Control-Allow-Headers` does not include `x-tenant-id`, the browser terminates the request.',
      'Because Node.js cannot read headers with dashes.',
      'PostgreSQL does not support custom headers.',
      'Because Express only allows GET requests.'
    ],
    correctIndex: 0,
    explanation: 'CORS specification requires servers to explicitly allow custom request headers in `Access-Control-Allow-Headers` during preflight.'
  },

  // SECTION 10: DEBUGGING & PRODUCTION SCENARIOS
  {
    id: 96,
    category: 'DEBUGGING',
    difficulty: 'INTERMEDIATE',
    question: 'A developer updates a signal `userName.set("Alex")`, but the UI template still displays the old value. What is the most common bug?',
    options: [
      'The template reads `{{ userName }}` without invoking the signal getter parentheses `{{ userName() }}`, or mutated an object without updating reference.',
      'Angular requires restarting the server.',
      'The browser cache is full.',
      'The computer needs a reboot.'
    ],
    correctIndex: 0,
    explanation: 'Missing parentheses `userName` instead of `userName()` references the function object rather than evaluating its current value.'
  },
  {
    id: 97,
    category: 'DEBUGGING',
    difficulty: 'ADVANCED',
    question: 'You configured a route with `loadComponent: () => import("./orders.component")`, but your production bundle analyzer shows `OrdersComponent` is still bundled into `main.js`. What would you investigate?',
    options: [
      'Check if another eagerly-loaded component or service in `main.js` has a direct static `import { OrdersComponent }` statement from that file.',
      'Angular does not support lazy loading.',
      'TypeScript compiler has a bug.',
      'Delete package-lock.json.'
    ],
    correctIndex: 0,
    explanation: 'If a component is directly imported in an eager file (like app.component.ts), the bundler includes it in the main chunk, overriding lazy loading.'
  },
  {
    id: 98,
    category: 'DEBUGGING',
    difficulty: 'ADVANCED',
    question: 'Your `auth.interceptor.ts` attaches `Authorization: Bearer <token>`, but your backend API logs show `req.headers.authorization` is undefined. What is the cause?',
    options: [
      'The interceptor forgot to return `next(req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }))` or was not registered in `provideHttpClient(withInterceptors([authInterceptor]))`.',
      'Backend Express cannot parse Bearer tokens.',
      'JWT tokens cannot be sent over HTTP.',
      'Angular HttpClient strips Authorization headers.'
    ],
    correctIndex: 0,
    explanation: 'The interceptor must clone the request with `setHeaders` and pass the cloned request into `next(clonedReq)`.'
  },
  {
    id: 99,
    category: 'DEBUGGING',
    difficulty: 'INTERMEDIATE',
    question: 'A FormGroup shows `form.invalid === true`, but all visible form inputs are green and contain valid values. How do you diagnose which control is causing the failure?',
    codeSnippet: `// Diagnostic helper:\nconsole.log(Object.keys(this.form.controls).filter(k => this.form.get(k)?.invalid));`,
    options: [
      'Inspect `form.controls` to find hidden or sub-group controls (e.g. unrendered terms checkbox or address sub-control) that remain invalid.',
      'Delete the form and recreate it.',
      'Set form.invalid = false manually.',
      'Restart the development server.'
    ],
    correctIndex: 0,
    explanation: 'FormGroups aggregate validity across all registered controls; non-rendered or disabled controls may hold unresolved validation errors.'
  },
  {
    id: 100,
    category: 'DEBUGGING',
    difficulty: 'EXPERT',
    question: 'You are deploying an Angular 19 SPA to production behind an NGINX reverse proxy. Users report that refreshing any deep URL (e.g. `/users/123`) results in a "404 Not Found" nginx error. How do you resolve this?',
    options: [
      'Configure NGINX `try_files $uri $uri/ /index.html;` so all unmatched routes fallback to `index.html` for client-side routing.',
      'Remove client-side routing and use multi-page HTML.',
      'Tell users to never refresh the page.',
      'Change all route paths to numbers.'
    ],
    correctIndex: 0,
    explanation: 'SPAs require fallback routing (try_files /index.html) so the server returns index.html, allowing the Angular Router to handle deep URLs.'
  }
];

// Backward compatibility aliases
export const ANGULAR_QUIZ_QUESTIONS_DATA = ANGULAR_100_QUIZ_BANK;
export const QUIZ_QUESTIONS_DATA = ANGULAR_100_QUIZ_BANK;

export async function seedAngularQuizQuestions(prisma: PrismaClient) {
  console.log('Seeding 100 Practical Project-Building Angular Quiz Questions into PostgreSQL...');

  const angularTenant = await prisma.tenant.findUnique({
    where: { slug: 'angular-v4' }
  });

  for (const q of ANGULAR_100_QUIZ_BANK) {
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
        tenantId: angularTenant?.id || null,
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
        tenantId: angularTenant?.id || null,
      }
    });
  }

  console.log(`✅ Successfully seeded ${ANGULAR_100_QUIZ_BANK.length} Angular 19 Questions into PostgreSQL!`);
}

// Backward compatibility alias
export const seedQuizQuestions = seedAngularQuizQuestions;

