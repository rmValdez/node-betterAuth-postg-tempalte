import { PrismaClient } from '@prisma/client';

export interface FlutterQuizQuestionSeed {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const FLUTTER_100_QUIZ_BANK: FlutterQuizQuestionSeed[] = [
  // =========================================================================
  // SECTION 1: RIVERPOD & MODERN STATE MANAGEMENT (201 - 210)
  // =========================================================================
  {
    id: 201,
    category: 'RIVERPOD',
    difficulty: 'BEGINNER',
    question: 'In Flutter Riverpod, what is the recommended widget to extend when a component needs to read or listen to providers?',
    codeSnippet: `class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider);
    return Text(user.name);
  }
}`,
    options: [
      'StatefulWidget with ProviderStateMixin',
      'ConsumerWidget (or ConsumerStatefulWidget for local state)',
      'InheritedWidget with ProviderScope',
      'StatelessWidget with context.dependOnInheritedWidgetOfExactType()'
    ],
    correctIndex: 1,
    explanation: 'ConsumerWidget provides a WidgetRef parameter directly in its build method, enabling straightforward, reactive provider watching without boilerplate.'
  },
  {
    id: 202,
    category: 'RIVERPOD',
    difficulty: 'INTERMEDIATE',
    question: 'What is the primary difference between ref.watch() and ref.read() in Riverpod?',
    codeSnippet: `// Usage A:
final count = ref.watch(counterProvider);
// Usage B:
ref.read(counterProvider.notifier).increment();`,
    options: [
      'ref.watch() is asynchronous while ref.read() is synchronous.',
      'ref.watch() subscribes to changes and rebuilds the widget; ref.read() obtains the value once without triggering rebuilds.',
      'ref.read() can only be called inside build(), whereas ref.watch() can be used anywhere.',
      'ref.read() creates a new provider instance; ref.watch() reuses an existing one.'
    ],
    correctIndex: 1,
    explanation: 'ref.watch() registers a reactive listener that triggers widget rebuilds when state updates. ref.read() reads the value once and is recommended inside user callbacks (e.g. onPressed).'
  },
  {
    id: 203,
    category: 'RIVERPOD',
    difficulty: 'INTERMEDIATE',
    question: 'How should you gracefully render loading, error, and data states when consuming an AsyncValue from an AsyncNotifierProvider?',
    codeSnippet: `final asyncUser = ref.watch(userProfileProvider);
return asyncUser.when(
  data: (user) => Text(user.name),
  loading: () => const CircularProgressIndicator(),
  error: (err, stack) => Text('Error: $err'),
);`,
    options: [
      'By using if (asyncUser is Data) checks manually in every widget.',
      'By using the pattern-matching `.when()` or `.maybeWhen()` method on AsyncValue.',
      'By converting AsyncValue into a FutureBuilder.',
      'By invoking asyncUser.toWidget().'
    ],
    correctIndex: 1,
    explanation: 'AsyncValue.when() provides exhaustive pattern matching for data, loading, and error states, ensuring compile-time safety and clean UI rendering.'
  },
  {
    id: 204,
    category: 'RIVERPOD',
    difficulty: 'ADVANCED',
    question: 'What does the `.autoDispose` modifier do in Riverpod, and how can a provider temporarily keep its state alive while fetching new data?',
    codeSnippet: `@riverpod
Future<Product> productDetails(Ref ref, String id) async {
  final link = ref.keepAlive();
  final timer = Timer(const Duration(minutes: 5), () => link.close());
  ref.onDispose(() => timer.cancel());
  return fetchProduct(id);
}`,
    options: [
      'It deletes the Flutter engine when unused.',
      'It disposes provider state when there are no active listeners, while ref.keepAlive() can preserve cached state for a specified retention period.',
      'It prevents garbage collection permanently.',
      'It isolates the provider on a separate thread.'
    ],
    correctIndex: 1,
    explanation: 'autoDispose cleans up provider state as soon as all UI listeners unmount. ref.keepAlive() allows fine-grained retention policies (like a 5-minute cache TTL).'
  },
  {
    id: 205,
    category: 'RIVERPOD',
    difficulty: 'INTERMEDIATE',
    question: 'In Riverpod, what modifier or code-gen syntax is used when a provider requires external parameters (e.g. fetching a user by ID)?',
    codeSnippet: `// Code-gen syntax:
@riverpod
Future<User> fetchUser(Ref ref, {required String userId}) async {
  return userRepository.getUser(userId);
}`,
    options: [
      'Family (e.g. futureProvider.family or parameters in @riverpod annotation)',
      'TupleProvider',
      'ArgumentProvider',
      'DynamicProvider'
    ],
    correctIndex: 0,
    explanation: 'The `.family` modifier (or adding parameters to an annotated `@riverpod` function) allows passing arguments to create parameterized provider instances.'
  },
  {
    id: 206,
    category: 'RIVERPOD',
    difficulty: 'ADVANCED',
    question: 'How do you optimize widget rebuilds so a widget only rebuilds when a specific property of a model changes, rather than the entire object?',
    codeSnippet: `// Optimize rebuilds for username only:
final username = ref.watch(userProvider.select((user) => user.name));`,
    options: [
      'By using `ref.watch(userProvider.select((u) => u.name))` to listen only to the selected sub-property.',
      'By wrapping the widget in an InheritedWidget.',
      'By calling `ref.freeze(userProvider)`.',
      'By setting `autoDispose: false`.'
    ],
    correctIndex: 0,
    explanation: 'The `select()` method filters provider updates, causing the consuming widget to rebuild only when the selected property changes value according to equality checks.'
  },
  {
    id: 207,
    category: 'RIVERPOD',
    difficulty: 'ADVANCED',
    question: 'In modern Riverpod 2+, what class replaces the legacy `StateNotifier` for managing synchronous mutable state with code generation?',
    codeSnippet: `@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}`,
    options: [
      'Notifier (or _$Counter generated base class)',
      'BlocState',
      'ChangeNotifier',
      'ReduxStore'
    ],
    correctIndex: 0,
    explanation: 'Notifier (and AsyncNotifier for asynchronous state) is the modern replacement for StateNotifier, featuring unified build() methods and first-class code-generation support.'
  },
  {
    id: 208,
    category: 'RIVERPOD',
    difficulty: 'INTERMEDIATE',
    question: 'How do you override a provider with a mock implementation inside a widget test or a scoped subtree?',
    codeSnippet: `await tester.pumpWidget(
  ProviderScope(
    overrides: [
      authRepositoryProvider.overrideWithValue(MockAuthRepository()),
    ],
    child: const MyApp(),
  ),
);`,
    options: [
      'By mutating global static variables.',
      'By using `ProviderScope(overrides: [provider.overrideWith(...)])`.',
      'By redefining the provider inside the test file with the same name.',
      'By calling `ref.mock(provider, MockValue())`.'
    ],
    correctIndex: 1,
    explanation: 'ProviderScope supports an `overrides` list where any provider can be substituted with mock instances or alternative implementations for scoped subtrees and widget tests.'
  },
  {
    id: 209,
    category: 'RIVERPOD',
    difficulty: 'INTERMEDIATE',
    question: 'Can one Riverpod provider watch another provider, and what happens when the upstream provider changes?',
    codeSnippet: `@riverpod
List<Todo> filteredTodos(Ref ref) {
  final filter = ref.watch(todoFilterProvider);
  final todos = ref.watch(todoListProvider);
  return todos.where((t) => matches(t, filter)).toList();
}`,
    options: [
      'No, providers cannot depend on each other without circular dependency errors.',
      'Yes, `ref.watch` inside a provider creates a reactive dependency graph, automatically recomputing the downstream provider when upstream changes.',
      'Yes, but only if both providers are defined in the same file.',
      'No, you must use an event bus instead.'
    ],
    correctIndex: 1,
    explanation: 'Riverpod forms a directed acyclic graph (DAG) of dependencies. Calling `ref.watch` inside a provider automatically triggers re-evaluation whenever the upstream provider emits a new value.'
  },
  {
    id: 210,
    category: 'RIVERPOD',
    difficulty: 'ADVANCED',
    question: 'Where should `ref.listen()` be used to show SnackBars, dialogs, or navigation in response to state transitions without triggering rebuilds?',
    codeSnippet: `ref.listen<AsyncValue<void>>(
  authControllerProvider,
  (previous, next) {
    if (next.hasError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(next.error.toString())),
      );
    }
  },
);`,
    options: [
      'Inside the initState() method of a standard StatefulWidget.',
      'Inside the build() method of a ConsumerWidget or ConsumerState.',
      'Inside main() before runApp().',
      'Inside the pubspec.yaml file.'
    ],
    correctIndex: 1,
    explanation: 'ref.listen() is called in the build method to react to state changes with side effects (like showing SnackBars or routing) without triggering unnecessary widget rebuilds.'
  },

  // =========================================================================
  // SECTION 2: WIDGET LIFECYCLE & RENDERING PIPELINE (211 - 220)
  // =========================================================================
  {
    id: 211,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'BEGINNER',
    question: 'Which method in a State object is called exactly once when the widget is inserted into the tree?',
    codeSnippet: `class _MyScreenState extends State<MyScreen> {
  @override
  void initState() {
    super.initState();
    // One-time initialization logic
  }
}`,
    options: [
      'didUpdateWidget()',
      'didChangeDependencies()',
      'initState()',
      'build()'
    ],
    correctIndex: 2,
    explanation: 'initState() is called once and only once when the State object is inserted into the tree, making it ideal for one-time initialization.'
  },
  {
    id: 212,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'INTERMEDIATE',
    question: 'When is `didChangeDependencies()` invoked in a State object lifecycle?',
    codeSnippet: `@override
void didChangeDependencies() {
  super.didChangeDependencies();
  // Safe to read InheritedWidgets like MediaQuery or Theme
  final isDark = Theme.of(context).brightness == Brightness.dark;
}`,
    options: [
      'Only when the parent calls setState().',
      'Immediately after initState(), and whenever an InheritedWidget that this State object depends on changes value.',
      'Only when the widget is popped from the Navigator.',
      'Only during unit tests.'
    ],
    correctIndex: 1,
    explanation: 'didChangeDependencies() is called right after initState(), and whenever an InheritedWidget (like Theme or MediaQuery) referenced by this widget updates.'
  },
  {
    id: 213,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'INTERMEDIATE',
    question: 'What lifecycle method is invoked on a State object when the parent widget rebuilds and provides a new widget configuration with the same runtimeType and key?',
    codeSnippet: `@override
void didUpdateWidget(covariant MyWidget oldWidget) {
  super.didUpdateWidget(oldWidget);
  if (oldWidget.productId != widget.productId) {
    _reloadProductData();
  }
}`,
    options: [
      'didUpdateWidget(covariant T oldWidget)',
      'initState()',
      'reassemble()',
      'deactivate()'
    ],
    correctIndex: 0,
    explanation: 'didUpdateWidget() is called whenever the parent widget rebuilds and provides a new widget configuration for an existing State element, allowing stateful diffing against oldWidget.'
  },
  {
    id: 214,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'BEGINNER',
    question: 'What is the primary purpose of the `dispose()` method in a StatefulWidget?',
    codeSnippet: `@override
void dispose() {
  _animationController.dispose();
  _textController.dispose();
  _subscription.cancel();
  super.dispose();
}`,
    options: [
      'To render the final frame to the GPU.',
      'To release persistent resources such as AnimationControllers, TextEditingControllers, and StreamSubscriptions to prevent memory leaks.',
      'To clear the HTTP cache.',
      'To restart the application.'
    ],
    correctIndex: 1,
    explanation: 'dispose() is called when the State object is permanently removed from the tree. It is crucial for cancelling subscriptions and disposing controllers to prevent memory leaks.'
  },
  {
    id: 215,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'ADVANCED',
    question: 'What are the Three Trees that constitute Flutter’s architectural rendering pipeline?',
    codeSnippet: `// Hierarchy:
1. Widget Tree (Immutable blueprints)
2. Element Tree (Lifecycle & identity management)
3. RenderObject Tree (Layout, hit-testing, and painting)`,
    options: [
      'Virtual DOM, Shadow DOM, Real DOM',
      'Widget Tree, Element Tree, RenderObject Tree',
      'Layout Tree, Paint Tree, Layer Tree',
      'Component Tree, State Tree, Store Tree'
    ],
    correctIndex: 1,
    explanation: 'Flutter uses immutable Widgets as blueprints, managed by Elements that maintain persistent identity and lifecycle, which in turn drive RenderObjects responsible for layout and painting.'
  },
  {
    id: 216,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'INTERMEDIATE',
    question: 'Why are Keys (e.g. `ValueKey`, `UniqueKey`) essential when reordering items in a stateful list?',
    codeSnippet: `ListView(
  children: items.map((item) => TodoItemWidget(
    key: ValueKey(item.id),
    item: item,
  )).toList(),
)`,
    options: [
      'Keys encrypt the widget data for security.',
      'Keys enable Flutter to match existing Elements to their corresponding Widgets during reconciliation when item positions change.',
      'Keys are required for HTTP requests.',
      'Keys automatically animate items without controllers.'
    ],
    correctIndex: 1,
    explanation: 'Without keys, Flutter matches elements purely by runtimeType and index. When reordering, stateful elements could bind to the wrong widget data unless uniquely keyed.'
  },
  {
    id: 217,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'ADVANCED',
    question: 'What is the distinction between `deactivate()` and `dispose()` in Flutter State objects?',
    options: [
      'deactivate() is called when the widget is temporarily removed and could be reinserted (e.g., GlobalKey reparenting), whereas dispose() signals permanent destruction.',
      'deactivate() only applies to StatelessWidgets.',
      'dispose() is called on every frame render.',
      'deactivate() is deprecated in Flutter 3.x.'
    ],
    correctIndex: 0,
    explanation: 'deactivate() is called when an element is removed from the tree. If it is not reinserted into another part of the tree by the end of the current frame, dispose() is invoked.'
  },
  {
    id: 218,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you listen to system-level app lifecycle events (e.g. app paused, resumed in background) in Flutter?',
    codeSnippet: `class _AppState extends State<App> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) { ... }
  }
}`,
    options: [
      'By polling the device battery status.',
      'By mixing in `WidgetsBindingObserver` and implementing `didChangeAppLifecycleState`.',
      'By subscribing to NativeBridge.events.',
      'By calling `SystemChannels.lifecycle.poll()`.'
    ],
    correctIndex: 1,
    explanation: 'WidgetsBindingObserver allows widgets to receive notifications from the platform regarding lifecycle changes (resumed, inactive, paused, detached, hidden).'
  },
  {
    id: 219,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'INTERMEDIATE',
    question: 'Why should you check `mounted` before using `BuildContext` across an asynchronous gap in a StatefulWidget?',
    codeSnippet: `await Future.delayed(const Duration(seconds: 2));
if (!mounted) return;
Navigator.of(context).pop();`,
    options: [
      'Because Flutter isolates crash without mounted checks.',
      'Because the widget might have been removed from the tree while awaiting, making the BuildContext deactivated and causing runtime crashes.',
      'To prevent the garbage collector from running.',
      'To reload the widget state automatically.'
    ],
    correctIndex: 1,
    explanation: 'If a widget is unmounted while an asynchronous operation is in flight, referencing its BuildContext afterward causes a runtime error because the associated element is deactivated.'
  },
  {
    id: 220,
    category: 'WIDGET_LIFECYCLE',
    difficulty: 'ADVANCED',
    question: 'What is the primary rule of Flutter layout constraint propagation?',
    codeSnippet: `// Flutter Layout Golden Rule:
Constraints go down.
Sizes go up.
Parents set positions.`,
    options: [
      'Children dictate their parent’s position directly.',
      'Constraints flow down from parent to child, sizes flow up from child to parent, and parent sets child positions.',
      'Layout is determined by CSS Flexbox rules.',
      'Sizes are determined before constraints are evaluated.'
    ],
    correctIndex: 1,
    explanation: 'The fundamental law of Flutter rendering is: Constraints go down, Sizes go up, and Parents decide positions.'
  },

  // =========================================================================
  // SECTION 3: STATE ARCHITECTURE & REACTIVITY (221 - 230)
  // =========================================================================
  {
    id: 221,
    category: 'STATE_MANAGEMENT',
    difficulty: 'INTERMEDIATE',
    question: 'What method on `InheritedWidget` determines whether dependent widgets should rebuild when the inherited widget is replaced?',
    codeSnippet: `class MyInheritedTheme extends InheritedWidget {
  final Color primaryColor;
  const MyInheritedTheme({required this.primaryColor, required super.child});

  @override
  bool updateShouldNotify(covariant MyInheritedTheme oldWidget) {
    return oldWidget.primaryColor != primaryColor;
  }
}`,
    options: [
      'shouldRebuild()',
      'updateShouldNotify(covariant T oldWidget)',
      'notifyListeners()',
      'hasChanged()'
    ],
    correctIndex: 1,
    explanation: 'InheritedWidget uses `updateShouldNotify` to compare the new instance with the old one; returning true causes dependent widgets registered with dependOnInheritedWidgetOfExactType to rebuild.'
  },
  {
    id: 222,
    category: 'STATE_MANAGEMENT',
    difficulty: 'BEGINNER',
    question: 'What is the advantage of using `ValueNotifier` and `ValueListenableBuilder` for simple local state over `setState`?',
    codeSnippet: `final counter = ValueNotifier<int>(0);

ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) => Text('$value'),
)`,
    options: [
      'It compiles to C++ assembly.',
      'It rebuilds only the specific ValueListenableBuilder subtree rather than the entire State object.',
      'It automatically syncs data to SQLite.',
      'It eliminates the need for any build context.'
    ],
    correctIndex: 1,
    explanation: 'ValueListenableBuilder provides surgical rebuilds: only the builder callback is executed when the ValueNotifier emits a new value, leaving the rest of the widget tree untouched.'
  },
  {
    id: 223,
    category: 'STATE_MANAGEMENT',
    difficulty: 'INTERMEDIATE',
    question: 'In the BLoC pattern, what is the core architectural difference between a `Cubit` and a full `Bloc`?',
    options: [
      'Cubit uses functions to emit new states directly, whereas Bloc responds to dispatched Events mapped to States via event handlers.',
      'Cubit only works on web, while Bloc works on mobile.',
      'Bloc cannot use Streams.',
      'Cubit requires code generation, whereas Bloc does not.'
    ],
    correctIndex: 0,
    explanation: 'A Cubit exposes public methods that directly call emit(newState), while a full Bloc receives discrete Event objects and processes them through on<Event>((event, emit) => ...) handlers.'
  },
  {
    id: 224,
    category: 'STATE_MANAGEMENT',
    difficulty: 'ADVANCED',
    question: 'Why does mutating an existing List or Map in-place fail to trigger updates in modern reactive state managers (like Riverpod or Bloc)?',
    codeSnippet: `// Anti-pattern:
state.add(newItem); // Mutation in-place
// Recommended:
state = [...state, newItem]; // New instance`,
    options: [
      'Dart forbids modifying collections.',
      'State managers compare old and new state references (`identical(old, new)`); in-place mutation retains identical object references, causing equality checks to treat state as unchanged.',
      'It causes an immediate isolate crash.',
      'In-place mutations are automatically rolled back.'
    ],
    correctIndex: 1,
    explanation: 'Reactive architectures rely on referential equality to detect changes. Mutating an object in place preserves the same reference, so state comparison evaluates to true and listeners are not notified.'
  },
  {
    id: 225,
    category: 'STATE_MANAGEMENT',
    difficulty: 'INTERMEDIATE',
    question: 'What is the primary benefit of using packages like `freezed` or `equatable` for state models in Flutter?',
    codeSnippet: `@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.authenticated(User user) = _Authenticated;
  const factory AuthState.failure(String message) = _Failure;
}`,
    options: [
      'They speed up network requests.',
      'They provide value-based equality (`==`), `hashCode`, `copyWith`, and union/pattern matching without boilerplate.',
      'They convert Dart code to JavaScript.',
      'They allow global variables to bypass garbage collection.'
    ],
    correctIndex: 1,
    explanation: 'Freezed and Equatable implement value equality for Dart objects (which default to identity equality) and provide copyWith, toString, and union classes for predictable state transitions.'
  },
  {
    id: 226,
    category: 'STATE_MANAGEMENT',
    difficulty: 'INTERMEDIATE',
    question: 'How do you preserve the scroll position or state of a ListView inside a TabBarView when switching tabs?',
    codeSnippet: `class _TabContentState extends State<TabContent>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return ListView(...);
  }
}`,
    options: [
      'By using `AutomaticKeepAliveClientMixin` with `wantKeepAlive => true` and calling `super.build(context)`.',
      'By setting physics: NeverScrollableScrollPhysics().',
      'By making the ListView a singleton.',
      'By storing every scroll offset in SharedPreferences.'
    ],
    correctIndex: 0,
    explanation: 'AutomaticKeepAliveClientMixin notifies the parent KeepAlive widget to retain the State element and its render subtree in memory even when scrolled out of view.'
  },
  {
    id: 227,
    category: 'STATE_MANAGEMENT',
    difficulty: 'ADVANCED',
    question: 'What is the architectural distinction between Service Locator (e.g. `get_it`) and Scoped Dependency Injection (e.g. Riverpod/Provider)?',
    options: [
      'Service Locator is global and decoupled from the widget tree hierarchy, whereas Scoped DI binds dependency lifecycle and availability directly to the widget tree scope.',
      'get_it only works with primitive types.',
      'Scoped DI cannot be used in production.',
      'Service Locator requires a Flutter context to resolve instances.'
    ],
    correctIndex: 0,
    explanation: 'Service locators like get_it provide globally accessible singletons/factories outside the widget tree. Scoped DI binds dependency scope and auto-disposal to widget tree lifecycles.'
  },
  {
    id: 228,
    category: 'STATE_MANAGEMENT',
    difficulty: 'BEGINNER',
    question: 'When is it best practice to use local `setState()` instead of a global state management solution?',
    options: [
      'Never; setState is banned in production Flutter apps.',
      'For ephemeral, purely UI-local state that no other widget in the app cares about (e.g. checkbox toggle, expansion tile, text field highlight).',
      'For handling user authentication and token persistence.',
      'For managing shopping cart items shared across screens.'
    ],
    correctIndex: 1,
    explanation: 'Ephemeral state (animations, current tab index, text selection) is best managed locally with setState() or ValueNotifier, keeping global state stores clean and focused.'
  },
  {
    id: 229,
    category: 'STATE_MANAGEMENT',
    difficulty: 'ADVANCED',
    question: 'How do you debounce search input in Flutter to prevent firing an API call on every keystroke?',
    codeSnippet: `// Using an asynchronous timer or RxDart debounceTime:
Timer? _debounce;
void onSearchChanged(String query) {
  if (_debounce?.isActive ?? false) _debounce!.cancel();
  _debounce = Timer(const Duration(milliseconds: 300), () {
    searchApi(query);
  });
}`,
    options: [
      'By setting TextField.maxLength = 10.',
      'By cancelling and resetting a Timer on each keystroke (or using Stream transformer `debounceTime`).',
      'By freezing the UI thread with sleep().',
      'By calling setState() synchronously on each character.'
    ],
    correctIndex: 1,
    explanation: 'Debouncing delays executing the callback until a specified pause period has elapsed since the last event, preventing network spam on rapid text input.'
  },
  {
    id: 230,
    category: 'STATE_MANAGEMENT',
    difficulty: 'EXPERT',
    question: 'In an offline-first Flutter application, how should optimistic UI updates be structured?',
    options: [
      'Wait for the server response before reflecting any changes on screen.',
      'Immediately mutate local state to reflect the anticipated success, persist to local database, enqueue a background sync task, and revert or flag if the remote request fails.',
      'Prevent all user interactions until internet connection is verified.',
      'Restart the app whenever an HTTP 500 is encountered.'
    ],
    correctIndex: 1,
    explanation: 'Optimistic UI updates give instantaneous user feedback by updating local store immediately, queuing synchronization in the background, and rolling back if the server rejects the action.'
  },

  // =========================================================================
  // SECTION 4: PERFORMANCE OPTIMIZATION & PROFILING (231 - 240)
  // =========================================================================
  {
    id: 231,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'Why is using `const` constructors heavily recommended throughout Flutter widget trees?',
    codeSnippet: `const SizedBox(height: 16)`,
    options: [
      'It forces widgets to run on a background isolate.',
      'It compiles widgets directly to native C++ code.',
      'It allows Flutter to canonicalize instances at compile time and skip unnecessary rebuilds during reconciliation.',
      'It disables layout passes completely for that subtree.'
    ],
    correctIndex: 2,
    explanation: 'const constructors allow Flutter to reuse canonical instances, short-circuiting element tree diffing and eliminating redundant allocations during rebuilds.'
  },
  {
    id: 232,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'What is the role of `RepaintBoundary` in optimizing rendering performance?',
    codeSnippet: `RepaintBoundary(
  child: AnimatedProgressIndicator(),
)`,
    options: [
      'It forces the child to render on the CPU instead of the GPU.',
      'It creates a separate display list / RenderLayer, isolating child repaints so the rest of the widget tree does not re-paint when the child animates.',
      'It eliminates the need for layout calculations.',
      'It prevents user touch events from reaching children.'
    ],
    correctIndex: 1,
    explanation: 'RepaintBoundary isolates frequently animating subtrees onto their own Layer, preventing costly repaint cascades across the entire surrounding screen.'
  },
  {
    id: 233,
    category: 'PERFORMANCE',
    difficulty: 'BEGINNER',
    question: 'Why should you prefer `ListView.builder` over `ListView(children: [...])` for long or infinite lists?',
    codeSnippet: `ListView.builder(
  itemCount: 10000,
  itemBuilder: (context, index) => ListTile(title: Text('Item $index')),
)`,
    options: [
      'ListView.builder renders all 10,000 widgets into memory at once.',
      'ListView.builder lazily creates and builds widgets only when they are scrolled into the viewport.',
      'ListView(children: [...]) automatically optimizes memory usage.',
      'ListView.builder is only available in debug mode.'
    ],
    correctIndex: 1,
    explanation: 'ListView.builder lazily constructs items as they enter the visible viewport and recycles/destroys elements when scrolled out, maintaining minimal memory footprint.'
  },
  {
    id: 234,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'In Flutter DevTools Performance overlay, what does a red bar on the UI thread versus the Raster thread indicate?',
    options: [
      'UI thread bars indicate Dart code execution delays (e.g. heavy layout/build); Raster thread bars indicate GPU rendering bottleneck (e.g. complex shaders/layers).',
      'UI thread is GPU; Raster thread is CPU.',
      'Both indicate network latency.',
      'Red bars simply indicate low device battery.'
    ],
    correctIndex: 0,
    explanation: 'The UI thread executes Dart code, layout, and generates display lists. The Raster (GPU) thread converts those display lists into pixels on screen.'
  },
  {
    id: 235,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'In a `CustomPainter`, why is returning `false` from `shouldRepaint()` critical when painter properties have not changed?',
    codeSnippet: `@override
bool shouldRepaint(covariant MyCustomPainter oldDelegate) {
  return oldDelegate.progress != progress;
}`,
    options: [
      'Returning false bypasses the paint() call, preventing redundant canvas drawing commands.',
      'Returning false disables hardware acceleration.',
      'Returning false crashes the Flutter engine.',
      'Returning false causes the canvas to clear completely.'
    ],
    correctIndex: 0,
    explanation: 'shouldRepaint() tells the rendering engine whether the paint() method needs to be called again. Returning false reuses the cached layer, saving valuable frame budget.'
  },
  {
    id: 236,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'Which of the following causes common memory leaks in Flutter applications if not properly cleaned up?',
    options: [
      'Forgetting to invoke `.dispose()` on AnimationControllers, TextEditingControllers, FocusNodes, and StreamSubscriptions.',
      'Using StatelessWidget too frequently.',
      'Calling const constructors.',
      'Using ThemeData with dark mode enabled.'
    ],
    correctIndex: 0,
    explanation: 'Controllers, focus nodes, and stream listeners register global callbacks or tickers. Without calling dispose() or cancel(), they remain retained in memory, causing leaks.'
  },
  {
    id: 237,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'When displaying large network images in grid thumbnails, how should you prevent high memory consumption and Out-Of-Memory (OOM) crashes?',
    codeSnippet: `Image.network(
  imageUrl,
  cacheWidth: 300,
  cacheHeight: 300,
)`,
    options: [
      'Convert all images to base64 strings in memory.',
      'Use `cacheWidth` and `cacheHeight` (or ResizeImage) to decode the image at target thumbnail dimensions rather than full resolution.',
      'Wrap each image in an Opacity widget.',
      'Disable the image cache completely.'
    ],
    correctIndex: 1,
    explanation: 'Setting cacheWidth/cacheHeight instructs the image decoder to downsample the image during rasterization, saving megabytes of RAM per image in lists and grids.'
  },
  {
    id: 238,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'Why does applying the `Opacity` widget to a child subtree carry a performance penalty, and what is the preferred alternative for simple color fading?',
    codeSnippet: `// Avoid:
Opacity(opacity: 0.5, child: Container(color: Colors.blue))
// Prefer:
Container(color: Colors.blue.withValues(alpha: 0.5))`,
    options: [
      'Opacity forces Flutter to allocate an offscreen buffer (saveLayer) to blend pixels, whereas color alpha applies transparency directly during painting.',
      'Opacity is not supported on Android.',
      'Opacity slows down network requests.',
      'There is no difference in performance.'
    ],
    correctIndex: 0,
    explanation: 'The Opacity widget creates an offscreen render target via saveLayer to blend complex subtrees, which is computationally expensive. Applying alpha to colors or textures is virtually free.'
  },
  {
    id: 239,
    category: 'PERFORMANCE',
    difficulty: 'ADVANCED',
    question: 'When performing compute-heavy JSON parsing or encryption in Flutter, how should work be offloaded from the UI thread?',
    codeSnippet: `final parsedData = await compute(parseLargeJsonPayload, rawJsonString);`,
    options: [
      'By wrapping the function in Future.delayed(Duration.zero)',
      'By using Flutter Isolates or the top-level compute() / Isolate.run() helper',
      'By running the operation in Microtask queue via scheduleMicrotask()',
      'By calling setState() before and after the calculation'
    ],
    correctIndex: 1,
    explanation: 'Flutter runs on a single event loop. Heavy CPU tasks block the main isolate (causing jank and dropped frames) unless spawned onto a worker isolate via compute() or Isolate.run().'
  },
  {
    id: 240,
    category: 'PERFORMANCE',
    difficulty: 'INTERMEDIATE',
    question: 'What are the three build modes in Flutter and their respective characteristics?',
    options: [
      'Debug (JIT, slow, hot reload), Profile (AOT, performance tracing), Release (AOT, minified, optimized for production).',
      'Alpha, Beta, Stable.',
      'Client, Server, Database.',
      'Fast, Medium, Slow.'
    ],
    correctIndex: 0,
    explanation: 'Debug uses JIT compilation with assertion checks for rapid development. Profile enables AOT compilation with tracing hooks. Release strips all debugging overhead for maximum speed.'
  },

  // =========================================================================
  // SECTION 5: NAVIGATION & DEEP LINKING (241 - 250)
  // =========================================================================
  {
    id: 241,
    category: 'NAVIGATION',
    difficulty: 'INTERMEDIATE',
    question: 'In GoRouter, how do you perform declarative routing that replaces the current URL location instead of pushing onto the history stack?',
    codeSnippet: `context.go(RouteNames.home); // vs context.push(RouteNames.home);`,
    options: [
      'context.push()',
      'context.go()',
      'Navigator.of(context).pushNamed()',
      'context.popAndPushNamed()'
    ],
    correctIndex: 1,
    explanation: 'context.go() changes the matched location declaratively according to routing configuration, matching browser URL history and top-level tab switches.'
  },
  {
    id: 242,
    category: 'NAVIGATION',
    difficulty: 'ADVANCED',
    question: 'What GoRouter construct is specifically designed to manage persistent bottom navigation bars with independent navigation stacks for each tab?',
    codeSnippet: `StatefulShellRoute.indexedStack(
  builder: (context, state, navigationShell) => MainLayout(navigationShell: navigationShell),
  branches: [
    StatefulShellBranch(routes: [...]),
    StatefulShellBranch(routes: [...]),
  ],
)`,
    options: [
      'StatefulShellRoute (or StatefulShellRoute.indexedStack)',
      'BottomNavigationRoute',
      'TabNavigatorRoute',
      'PersistentViewRoute'
    ],
    correctIndex: 0,
    explanation: 'StatefulShellRoute maintains separate navigation history branches for each tab, preserving scroll positions and view state across tab changes.'
  },
  {
    id: 243,
    category: 'NAVIGATION',
    difficulty: 'INTERMEDIATE',
    question: 'What platform configurations are required to enable deep linking in Flutter on Android and iOS?',
    options: [
      'Only editing pubspec.yaml.',
      'Configuring Intent Filters in AndroidManifest.xml (Android) and Associated Domains / Universal Links in Info.plist (iOS).',
      'Configuring Firebase Cloud Messaging.',
      'Enabling Bluetooth permissions.'
    ],
    correctIndex: 1,
    explanation: 'Deep links require platform-specific manifest configuration: Android uses intent-filter with android:autoVerify="true", while iOS requires Associated Domains (applinks).'
  },
  {
    id: 244,
    category: 'NAVIGATION',
    difficulty: 'INTERMEDIATE',
    question: 'How do you implement an auth route guard in GoRouter to redirect unauthenticated users to the login page?',
    codeSnippet: `redirect: (BuildContext context, GoRouterState state) {
  final isLoggedIn = ref.read(authProvider).isAuthenticated;
  final isLoggingIn = state.matchedLocation == '/login';
  if (!isLoggedIn) return '/login';
  if (isLoggingIn) return '/';
  return null; // No redirection needed
}`,
    options: [
      'Using the `redirect` callback in GoRouter configuration.',
      'Writing an interceptor in Dio.',
      'Overriding the runApp() method.',
      'Using a WillPopScope on the home screen.'
    ],
    correctIndex: 0,
    explanation: 'GoRouter provides a top-level or per-route `redirect` callback that evaluates current app state and target location, returning a redirect path string or null to proceed.'
  },
  {
    id: 245,
    category: 'NAVIGATION',
    difficulty: 'INTERMEDIATE',
    question: 'How do you access path parameters (e.g. `/users/:id`) and query parameters (e.g. `?search=flutter`) inside a GoRouter route builder?',
    codeSnippet: `GoRoute(
  path: '/users/:id',
  builder: (context, state) {
    final userId = state.pathParameters['id'];
    final query = state.uri.queryParameters['search'];
    return UserDetailScreen(id: userId, search: query);
  },
)`,
    options: [
      'state.pathParameters and state.uri.queryParameters',
      'state.extra only',
      'ModalRoute.of(context)!.settings.arguments',
      'Uri.base.toString()'
    ],
    correctIndex: 0,
    explanation: 'In modern GoRouter, path variables are accessed via `state.pathParameters` and URL query parameters via `state.uri.queryParameters`.'
  },
  {
    id: 246,
    category: 'NAVIGATION',
    difficulty: 'ADVANCED',
    question: 'What is the key difference between Flutter Navigator 1.0 and Navigator 2.0 (Router API)?',
    options: [
      'Navigator 1.0 is purely imperative (`push`/`pop`), whereas Navigator 2.0 is declarative and synchronizes navigation state with browser history and deep links.',
      'Navigator 1.0 is written in Objective-C.',
      'Navigator 2.0 was removed in Flutter 3.0.',
      'Navigator 2.0 does not support transitions.'
    ],
    correctIndex: 0,
    explanation: 'Navigator 1.0 manages routes as a direct stack of pushes and pops. Navigator 2.0 exposes a declarative model where the route hierarchy is a function of application state.'
  },
  {
    id: 247,
    category: 'NAVIGATION',
    difficulty: 'INTERMEDIATE',
    question: 'In Flutter 3.16+, which widget replaced the deprecated `WillPopScope` for intercepting back-navigation gestures and hardware back buttons?',
    codeSnippet: `PopScope(
  canPop: false,
  onPopInvokedWithResult: (didPop, result) async {
    if (didPop) return;
    final shouldLeave = await showConfirmExitDialog();
    if (shouldLeave && context.mounted) {
      Navigator.of(context).pop();
    }
  },
  child: const MyScreen(),
)`,
    options: [
      'WillPopScope2',
      'PopScope (with canPop and onPopInvokedWithResult)',
      'BackButtonListener',
      'NavigationGuard'
    ],
    correctIndex: 1,
    explanation: 'PopScope is the modern replacement for WillPopScope, designed to support Android 14 predictive back animations through `canPop` and `onPopInvokedWithResult`.'
  },
  {
    id: 248,
    category: 'NAVIGATION',
    difficulty: 'INTERMEDIATE',
    question: 'How do you pass complex, non-primitive objects between screens in GoRouter without exposing sensitive data in the URL?',
    codeSnippet: `// Push with extra payload:
context.push('/details', extra: myComplexObject);

// In route builder:
final obj = state.extra as MyComplexObject;`,
    options: [
      'Using the `extra` parameter of `context.push()` / `context.go()`.',
      'Encoding the object into a 10,000-character URL query parameter.',
      'Writing to a temporary text file on disk.',
      'Using global static variables only.'
    ],
    correctIndex: 0,
    explanation: 'The `extra` parameter allows passing any Dart object in-memory alongside route transitions without displaying it in the web browser URL address bar.'
  },
  {
    id: 249,
    category: 'NAVIGATION',
    difficulty: 'ADVANCED',
    question: 'How do you specify a custom transition (e.g. fade or slide) for a specific route in GoRouter?',
    codeSnippet: `GoRoute(
  path: '/settings',
  pageBuilder: (context, state) => CustomTransitionPage(
    key: state.pageKey,
    child: const SettingsScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  ),
)`,
    options: [
      'By using `pageBuilder` with `CustomTransitionPage` and providing a `transitionsBuilder`.',
      'By animating the root Scaffold with AnimatedContainer.',
      'By overriding the GPU driver.',
      'By editing the Android Manifest.'
    ],
    correctIndex: 0,
    explanation: 'GoRoute supports `pageBuilder`, which allows returning a `CustomTransitionPage` where transition animations (fade, scale, slide) can be customized.'
  },
  {
    id: 250,
    category: 'NAVIGATION',
    difficulty: 'ADVANCED',
    question: 'How can GoRouter automatically re-evaluate its redirection logic when a Riverpod authentication provider updates?',
    codeSnippet: `final routerProvider = Provider<GoRouter>((ref) {
  final authNotifier = ref.watch(authNotifierProvider.notifier);
  return GoRouter(
    refreshListenable: authNotifier, // Triggers redirect when auth state changes
    redirect: (context, state) => ...
  );
});`,
    options: [
      'By supplying a Listenable to GoRouter’s `refreshListenable` property.',
      'By restarting the Flutter app on every login.',
      'By calling window.location.reload() in web.',
      'By running a periodic timer every 100ms.'
    ],
    correctIndex: 0,
    explanation: 'GoRouter accepts a `refreshListenable` (such as a ChangeNotifier or Riverpod Listenable). Whenever it notifies listeners, GoRouter re-evaluates its route redirect callback.'
  },

  // =========================================================================
  // SECTION 6: MODERN DART 3 & PATTERNS (251 - 260)
  // =========================================================================
  {
    id: 251,
    category: 'DART_PATTERNS',
    difficulty: 'ADVANCED',
    question: 'Dart 3 introduced exhaustive pattern matching. What happens if a switch expression over a sealed class omits a subtype?',
    codeSnippet: `sealed class Result {}
class Success extends Result {}
class Failure extends Result {}

String handle(Result r) => switch (r) {
  Success() => 'OK',
  // Missing Failure()
};`,
    options: [
      'It defaults to returning null at runtime.',
      'The compiler raises a compile-time error because pattern matching on sealed classes must be exhaustive.',
      'It throws a FallThroughError at runtime.',
      'It silently skips execution of that function.'
    ],
    correctIndex: 1,
    explanation: 'Sealed classes in Dart 3 guarantee compile-time exhaustiveness: the compiler verifies that all possible subtypes are covered in switch expressions without requiring fallback default branches.'
  },
  {
    id: 252,
    category: 'DART_PATTERNS',
    difficulty: 'BEGINNER',
    question: 'What are Dart 3 Records, and what is their syntax?',
    codeSnippet: `(String, {int age}) getUser() {
  return ('Alice', age: 30);
}
final (name, age: userAge) = getUser();`,
    options: [
      'Records are mutable database tables.',
      'Records are anonymous, immutable, aggregate types that allow grouping multiple typed values without defining a class.',
      'Records are audio files bundled in the asset bundle.',
      'Records are Dart macros that replace JSON serialization.'
    ],
    correctIndex: 1,
    explanation: 'Records are real values introduced in Dart 3: anonymous, immutable tuples that can hold positional and named fields, with structural equality.'
  },
  {
    id: 253,
    category: 'DART_PATTERNS',
    difficulty: 'ADVANCED',
    question: 'Which Dart 3 class modifier prevents a class from being constructed, extended, or implemented outside its defining library, but permits subtyping within the library?',
    codeSnippet: `sealed class NetworkState {} // Only subclasses in this file can extend it`,
    options: [
      'interface',
      'base',
      'sealed',
      'final'
    ],
    correctIndex: 2,
    explanation: 'The `sealed` modifier creates an abstract class that cannot be instantiated and can only be extended or implemented by classes within the same library file, enabling exhaustive pattern matching.'
  },
  {
    id: 254,
    category: 'DART_PATTERNS',
    difficulty: 'INTERMEDIATE',
    question: 'How does Dart 3 pattern matching destructure a JSON map safely with type checks?',
    codeSnippet: `if (json case {'user': {'name': String name, 'age': int age}}) {
  print('$name is $age years old');
}`,
    options: [
      'Using the `case` pattern check inside an `if` statement or switch statement.',
      'Using JSON.parse().',
      'By casting with `as Map<String, dynamic>`.',
      'Using reflection with dart:mirrors.'
    ],
    correctIndex: 0,
    explanation: 'Dart 3 allows pattern matching on maps, checking keys and field types simultaneously inside `if (data case pattern)` expressions.'
  },
  {
    id: 255,
    category: 'DART_PATTERNS',
    difficulty: 'BEGINNER',
    question: 'In Dart sound null safety, what does the null-aware coalescing operator (`??`) do?',
    codeSnippet: `String displayName = user.nickname ?? 'Guest';`,
    options: [
      'It checks if two strings are equal.',
      'It returns the left-hand expression if not null; otherwise, it evaluates and returns the right-hand expression.',
      'It throws an exception if user.nickname is null.',
      'It converts null to an empty string automatically.'
    ],
    correctIndex: 1,
    explanation: 'The `??` operator provides a fallback value when the expression on the left evaluates to null.'
  },
  {
    id: 256,
    category: 'DART_PATTERNS',
    difficulty: 'ADVANCED',
    question: 'What are Dart 3.3 Extension Types, and how do they differ from standard classes?',
    codeSnippet: `extension type const Id(int value) {
  bool get isValid => value > 0;
}`,
    options: [
      'They are compiled to separate virtual machines.',
      'They are zero-cost compile-time abstractions over an underlying representation type with zero runtime object allocation overhead.',
      'They can only contain static methods.',
      'They are identical to standard Dart mixins.'
    ],
    correctIndex: 1,
    explanation: 'Extension types wrap an existing type at compile time with a new interface without creating any wrapper object in memory at runtime, providing zero-cost type safety.'
  },
  {
    id: 257,
    category: 'DART_PATTERNS',
    difficulty: 'INTERMEDIATE',
    question: 'How do you restrict a generic type parameter in Dart so that it must extend a specific base entity?',
    codeSnippet: `class Repository<T extends BaseEntity> {
  Future<T> findById(String id) => ...
}`,
    options: [
      '<T extends BaseEntity>',
      '<T implements BaseEntity>',
      '<T : BaseEntity>',
      '<T with BaseEntity>'
    ],
    correctIndex: 0,
    explanation: 'In Dart, type bounds for generics are specified using the `extends` keyword: `<T extends BaseEntity>`.'
  },
  {
    id: 258,
    category: 'DART_PATTERNS',
    difficulty: 'INTERMEDIATE',
    question: 'What does the `on` clause in a Dart mixin declaration signify?',
    codeSnippet: `mixin LifecycleLogger on State<MyWidget> {
  // Can safely call widget and context here
}`,
    options: [
      'It specifies which event loop queue the mixin runs on.',
      'It restricts the mixin so that it can only be applied to classes that extend or implement the specified type.',
      'It specifies the network port.',
      'It creates an alias for the mixin.'
    ],
    correctIndex: 1,
    explanation: 'The `on` clause enforces that any class using the mixin must also be a subclass of the specified type, granting the mixin access to its superclass members.'
  },
  {
    id: 259,
    category: 'DART_PATTERNS',
    difficulty: 'BEGINNER',
    question: 'What is a Dart Constructor Tear-Off, and what is its concise syntax when mapping lists?',
    codeSnippet: `// Lambda:
final users = list.map((json) => User.fromJson(json)).toList();
// Constructor tear-off:
final users = list.map(User.fromJson).toList();`,
    options: [
      'Passing a constructor name directly as a first-class function argument without wrapping it in a closure.',
      'Deleting a constructor from memory.',
      'Renaming a constructor at runtime.',
      'Invoking a private constructor via reflection.'
    ],
    correctIndex: 0,
    explanation: 'Dart supports constructor tear-offs, allowing you to pass `User.fromJson` directly to higher-order functions like `.map()` without boilerplate anonymous functions.'
  },
  {
    id: 260,
    category: 'DART_PATTERNS',
    difficulty: 'INTERMEDIATE',
    question: 'What capability was introduced in Dart Enhanced Enums (Dart 2.17+)?',
    codeSnippet: `enum Environment {
  dev('https://dev.api.com'),
  prod('https://api.com');

  final String baseUrl;
  const Environment(this.baseUrl);

  bool get isProduction => this == Environment.prod;
}`,
    options: [
      'Enums can declare fields, methods, constructors, getters, and implement interfaces like standard classes.',
      'Enums can be mutated at runtime.',
      'Enums are automatically saved to disk.',
      'Enums can extend other enums.'
    ],
    correctIndex: 0,
    explanation: 'Enhanced Enums can have instance members, fields, const constructors, implement interfaces, and provide type-safe metadata alongside enum values.'
  },

  // =========================================================================
  // SECTION 7: ASYNCHRONOUS PROGRAMMING & CONCURRENCY (261 - 270)
  // =========================================================================
  {
    id: 261,
    category: 'ASYNCHRONY',
    difficulty: 'ADVANCED',
    question: 'In Dart’s Event Loop architecture, how does the Microtask Queue differ from the Event Queue?',
    codeSnippet: `scheduleMicrotask(() => print('Microtask'));
Future(() => print('Event'));`,
    options: [
      'The Microtask queue is executed by the GPU.',
      'The Microtask queue has higher priority than the Event queue; all microtasks in the queue must finish before the event loop processes the next event.',
      'The Event queue always runs first.',
      'There is no priority difference between the two queues.'
    ],
    correctIndex: 1,
    explanation: 'Dart executes all tasks in the Microtask queue before picking the next event from the Event queue (which handles I/O, timers, clicks, and drawing events).'
  },
  {
    id: 262,
    category: 'ASYNCHRONY',
    difficulty: 'INTERMEDIATE',
    question: 'How do you execute multiple independent Futures concurrently and wait for all of them to complete in Dart?',
    codeSnippet: `final results = await Future.wait([
  fetchUserProfile(),
  fetchUserOrders(),
  fetchAppSettings(),
]);`,
    options: [
      'Using `Future.wait([future1, future2, ...])`.',
      'Using a standard for loop with await on each item.',
      'Calling Future.all()',
      'By nesting then() callbacks.'
    ],
    correctIndex: 0,
    explanation: '`Future.wait()` fires all provided futures in parallel and returns a single Future containing the list of resolved values once all complete.'
  },
  {
    id: 263,
    category: 'ASYNCHRONY',
    difficulty: 'INTERMEDIATE',
    question: 'What is the key difference between a single-subscription Stream and a broadcast Stream in Dart?',
    codeSnippet: `final broadcastStream = stream.asBroadcastStream();`,
    options: [
      'Single-subscription streams can only be listened to once, buffering events until a listener attaches; broadcast streams allow multiple simultaneous listeners.',
      'Broadcast streams only work with websockets.',
      'Single-subscription streams can never be cancelled.',
      'Broadcast streams run on a separate CPU core.'
    ],
    correctIndex: 0,
    explanation: 'A single-subscription stream allows only one listener over its lifetime. A broadcast stream permits any number of concurrent listeners who receive events emitted after they subscribe.'
  },
  {
    id: 264,
    category: 'ASYNCHRONY',
    difficulty: 'ADVANCED',
    question: 'What keywords are used in Dart to define an asynchronous generator that produces a Stream of values?',
    codeSnippet: `Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}`,
    options: [
      'async* and yield',
      'sync* and return',
      'stream and emit',
      'generator and push'
    ],
    correctIndex: 0,
    explanation: '`async*` marks a function as an asynchronous generator returning a Stream<T>, and `yield` emits individual items to the stream listener.'
  },
  {
    id: 265,
    category: 'ASYNCHRONY',
    difficulty: 'ADVANCED',
    question: 'What is the purpose of a `Completer<T>` in Dart?',
    codeSnippet: `Future<String> fetchDataFromLegacyCallback() {
  final completer = Completer<String>();
  legacyApi.call((result, error) {
    if (error != null) completer.completeError(error);
    else completer.complete(result);
  });
  return completer.future;
}`,
    options: [
      'To compile Dart to WebAssembly.',
      'To produce a Future and complete or fail it manually, commonly used when bridging callback-based APIs to Futures.',
      'To cancel all active timers.',
      'To synchronize thread locks.'
    ],
    correctIndex: 1,
    explanation: 'A Completer allows you to create a Future and provide its value or error at a later time from callback handlers or event listeners.'
  },
  {
    id: 266,
    category: 'ASYNCHRONY',
    difficulty: 'INTERMEDIATE',
    question: 'In modern Dart 2.19+, what is the most concise way to run a short-lived CPU-intensive function on a separate worker isolate?',
    codeSnippet: `final result = await Isolate.run(() => heavyComputation(data));`,
    options: [
      'Isolate.spawnUri()',
      'Isolate.run(computationFunction)',
      'Thread.start()',
      'Worker.postMessage()'
    ],
    correctIndex: 1,
    explanation: '`Isolate.run()` spawns a temporary isolate, executes the computation, returns the result back to the calling isolate, and cleans up the isolate automatically.'
  },
  {
    id: 267,
    category: 'ASYNCHRONY',
    difficulty: 'ADVANCED',
    question: 'How should uncaught asynchronous errors in a Flutter app be caught globally for crash reporting tools (like Sentry or Crashlytics)?',
    codeSnippet: `PlatformDispatcher.instance.onError = (error, stack) {
  crashReporter.recordError(error, stack);
  return true;
};`,
    options: [
      'By wrapping every function in try-catch manually.',
      'By setting `PlatformDispatcher.instance.onError` and `FlutterError.onError`.',
      'By setting window.onerror in index.html.',
      'By disabling debug mode.'
    ],
    correctIndex: 1,
    explanation: 'FlutterError.onError catches framework-level errors (e.g. build/layout), while PlatformDispatcher.instance.onError catches unhandled asynchronous errors in the root isolate.'
  },
  {
    id: 268,
    category: 'ASYNCHRONY',
    difficulty: 'INTERMEDIATE',
    question: 'What is the risk of using `StreamBuilder` or `FutureBuilder` without caching the Future or Stream outside the `build()` method?',
    codeSnippet: `// Bad practice:
FutureBuilder(
  future: apiService.fetchData(), // Re-triggered on every build!
  builder: ...
)`,
    options: [
      'The app will throw a compiler error.',
      'Every time the parent widget rebuilds, a new Future/Stream is instantiated, causing infinite network request loops and UI flickering.',
      'The phone battery will immediately drain to zero.',
      'FutureBuilder cannot be used inside build.'
    ],
    correctIndex: 1,
    explanation: 'If a Future is instantiated inside the build() method, every rebuild creates a brand new Future, resetting the builder state and triggering repeated network requests.'
  },
  {
    id: 269,
    category: 'ASYNCHRONY',
    difficulty: 'ADVANCED',
    question: 'What does `yield*` do in an asynchronous generator (`async*`) function?',
    codeSnippet: `Stream<int> combinedStream() async* {
  yield* streamA;
  yield* streamB;
}`,
    options: [
      'It multiplies the stream value by a factor.',
      'It delegates emission to another Stream or Iterable, forwarding all of its values until exhausted.',
      'It terminates the stream immediately.',
      'It converts the stream to a list.'
    ],
    correctIndex: 1,
    explanation: '`yield*` delegates to another Stream (or Iterable), forwarding each event from that stream into the outer generator’s stream.'
  },
  {
    id: 270,
    category: 'ASYNCHRONY',
    difficulty: 'EXPERT',
    question: 'Can two isolates in Dart share mutable memory directly without message passing?',
    options: [
      'Yes, all Dart isolates share a single global heap.',
      'No; Dart isolates have completely separate memory heaps and do not share mutable state, communicating solely via message passing (ports) or zero-copy exit.',
      'Yes, by using the static keyword.',
      'Yes, if they are spawned using compute().'
    ],
    correctIndex: 1,
    explanation: 'Dart isolates run isolated threads of execution with their own private heaps and event loops, preventing data race conditions and concurrency locks.'
  },

  // =========================================================================
  // SECTION 8: NETWORKING & DATA PERSISTENCE (271 - 280)
  // =========================================================================
  {
    id: 271,
    category: 'NETWORKING',
    difficulty: 'INTERMEDIATE',
    question: 'In Dio, what is the purpose of an Interceptor?',
    codeSnippet: `dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    options.headers['Authorization'] = 'Bearer $token';
    return handler.next(options);
  },
));`,
    options: [
      'To compile HTTP endpoints into WebAssembly.',
      'To intercept, inspect, and transform HTTP requests, responses, and errors (such as attaching auth tokens or handling 401 refresh).',
      'To replace TCP sockets with raw UDP packets.',
      'To bypass SSL certificate validation in production.'
    ],
    correctIndex: 1,
    explanation: 'Dio interceptors provide hooks for onRequest, onResponse, and onError, allowing centralized token injection, retry logic, logging, and error normalization.'
  },
  {
    id: 272,
    category: 'NETWORKING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you abort an in-flight HTTP request in Dio when a user navigates away from a screen or cancels a search?',
    codeSnippet: `final cancelToken = CancelToken();
dio.get('/search', queryParameters: {'q': query}, cancelToken: cancelToken);

// On cancel or dispose:
cancelToken.cancel('User navigated away');`,
    options: [
      'By calling `dio.close(force: true)`.',
      'By passing a `CancelToken` to the request and invoking `cancelToken.cancel()`.',
      'By closing the internet connection.',
      'By unmounting the widget.'
    ],
    correctIndex: 1,
    explanation: 'Dio provides `CancelToken` instances that can be passed to network requests; calling `cancel()` immediately aborts socket operations and frees resources.'
  },
  {
    id: 273,
    category: 'NETWORKING',
    difficulty: 'BEGINNER',
    question: 'What is the recommended approach for JSON serialization and deserialization in scalable Flutter apps?',
    codeSnippet: `@JsonSerializable()
class User {
  final String id;
  final String email;
  User({required this.id, required this.email});
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}`,
    options: [
      'Writing manual string concatenation for every request.',
      'Using code-generation tools like `json_serializable` or `freezed` with `build_runner`.',
      'Using dart:mirrors in production.',
      'Parsing JSON using regular expressions.'
    ],
    correctIndex: 1,
    explanation: 'Code generation via `json_serializable` produces compile-time type-safe serialization without the performance overhead or platform restrictions of runtime reflection.'
  },
  {
    id: 274,
    category: 'NETWORKING',
    difficulty: 'INTERMEDIATE',
    question: 'What are the trade-offs between `shared_preferences` and SQLite (`sqflite` or `drift`) in Flutter?',
    options: [
      'shared_preferences is suited for small key-value pairs (settings, flags); SQLite is suited for structured, queryable relational data with foreign keys and complex indexing.',
      'shared_preferences can store gigabytes of relational tables efficiently.',
      'SQLite is only supported on Android.',
      'shared_preferences provides full SQL query syntax.'
    ],
    correctIndex: 0,
    explanation: 'shared_preferences is lightweight key-value storage (XML on Android, Plist on iOS). For large structured data, relational databases like SQLite / Drift offer indexing and querying.'
  },
  {
    id: 275,
    category: 'NETWORKING',
    difficulty: 'ADVANCED',
    question: 'Where should sensitive tokens (like JWT access/refresh tokens or biometrics) be stored in Flutter?',
    options: [
      'In SharedPreferences as plain text.',
      'In `flutter_secure_storage` (using Keychain on iOS and Keystore/EncryptedSharedPreferences on Android).',
      'Hardcoded in a constant in main.dart.',
      'In a text file in the app documents directory.'
    ],
    correctIndex: 1,
    explanation: '`flutter_secure_storage` leverages hardware-backed encryption: Keychain on iOS/macOS and Android Keystore with AES encryption on Android.'
  },
  {
    id: 276,
    category: 'NETWORKING',
    difficulty: 'INTERMEDIATE',
    question: 'How do you upload a file with progress tracking using Dio?',
    codeSnippet: `final formData = FormData.fromMap({
  'file': await MultipartFile.fromFile(filePath, filename: 'upload.png'),
});
await dio.post('/upload', data: formData, onSendProgress: (sent, total) {
  print('Progress: \${(sent / total * 100).toStringAsFixed(0)}%');
});`,
    options: [
      'Using `FormData` with `MultipartFile` and the `onSendProgress` callback.',
      'By converting the file to a query parameter.',
      'By using WebSocket ping packets.',
      'Files cannot be uploaded through Dio.'
    ],
    correctIndex: 0,
    explanation: 'Dio supports multipart form data uploads with an `onSendProgress` callback that receives bytes sent and total length to calculate percentage progress.'
  },
  {
    id: 277,
    category: 'NETWORKING',
    difficulty: 'ADVANCED',
    question: 'How should a WebSocket connection be kept alive across unstable mobile cellular networks in Flutter?',
    options: [
      'By keeping the device screen permanently turned on.',
      'By implementing periodic heartbeat ping/pong packets and auto-reconnecting with exponential backoff on disconnect.',
      'By establishing 10 simultaneous socket connections.',
      'By disabling TLS encryption.'
    ],
    correctIndex: 1,
    explanation: 'Mobile network carriers aggressively close idle TCP sockets. Periodic heartbeat ping/pong messages keep connections alive, and exponential backoff manages clean reconnects.'
  },
  {
    id: 278,
    category: 'NETWORKING',
    difficulty: 'ADVANCED',
    question: 'What is SSL/TLS Certificate Pinning in Flutter, and why is it implemented in security-sensitive apps?',
    options: [
      'Pinning a widget to the top of the screen.',
      'Hardcoding or validating the server’s exact certificate fingerprint to protect against Man-In-The-Middle (MITM) attacks on compromised networks.',
      'Compressing network requests to save bandwidth.',
      'A method to speed up DNS resolution.'
    ],
    correctIndex: 1,
    explanation: 'Certificate pinning ensures the app only communicates with a server possessing a predetermined public key certificate, preventing attackers from intercepting traffic with rogue CAs.'
  },
  {
    id: 279,
    category: 'NETWORKING',
    difficulty: 'INTERMEDIATE',
    question: 'In a Repository layer, what is the difference between a "Cache-First" and "Network-First" caching strategy?',
    options: [
      'Cache-First serves local data immediately and optionally refreshes in background; Network-First fetches fresh server data, falling back to cache if offline.',
      'Network-First never uses a cache under any circumstances.',
      'Cache-First only works in web browsers.',
      'There is no difference.'
    ],
    correctIndex: 0,
    explanation: 'Cache-First optimizes for instant rendering and offline readiness. Network-First guarantees the most up-to-date information while providing offline resilience.'
  },
  {
    id: 280,
    category: 'NETWORKING',
    difficulty: 'EXPERT',
    question: 'When implementing automated token refresh in a Dio interceptor on HTTP 401, how do you prevent race conditions when multiple requests fail simultaneously?',
    codeSnippet: `// Queuing simultaneous requests during token refresh:
dio.interceptors.add(QueuedInterceptorsWrapper(
  onError: (error, handler) async {
    if (error.response?.statusCode == 401) {
      // Locks queue, refreshes token, retries original request
    }
  },
));`,
    options: [
      'By logging out immediately on any 401.',
      'By using `QueuedInterceptorsWrapper` to pause subsequent requests while a single refresh token operation executes, then retrying all queued requests with the new token.',
      'By disabling authentication headers.',
      'By retrying every 10 milliseconds in a while loop.'
    ],
    correctIndex: 1,
    explanation: 'QueuedInterceptorsWrapper queues concurrent requests while the refresh token call is in flight, avoiding duplicate refresh calls and cascading 401 errors.'
  },

  // =========================================================================
  // SECTION 9: ANIMATIONS & MOTION DESIGN (281 - 290)
  // =========================================================================
  {
    id: 281,
    category: 'ANIMATIONS',
    difficulty: 'BEGINNER',
    question: 'What is the primary difference between Implicit Animations (e.g. `AnimatedContainer`) and Explicit Animations in Flutter?',
    options: [
      'Implicit animations manage their own internal AnimationController and animate automatically when target values change; Explicit animations require an AnimationController to be manually created and driven.',
      'Implicit animations only work in release mode.',
      'Explicit animations cannot use curves.',
      'Implicit animations do not support duration.'
    ],
    correctIndex: 0,
    explanation: 'Implicit animations (AnimatedContainer, AnimatedOpacity) are declarative: provide new values and Flutter handles the transition. Explicit animations offer fine-grained control via AnimationControllers.'
  },
  {
    id: 282,
    category: 'ANIMATIONS',
    difficulty: 'INTERMEDIATE',
    question: 'Why must an explicit `AnimationController` provide a `vsync: this` argument?',
    codeSnippet: `final controller = AnimationController(
  duration: const Duration(milliseconds: 300),
  vsync: this,
);`,
    options: [
      'To prevent the phone from going to sleep.',
      'To bind the animation to the screen refresh rate (Ticker), ensuring animations only run when the widget is visible and preventing battery waste offscreen.',
      'To sync animations across multiple devices via Bluetooth.',
      'To compile the animation to WebGL.'
    ],
    correctIndex: 1,
    explanation: 'A TickerProvider (vsync) drives the AnimationController on every frame tick synchronized with display refresh, muting animation when the widget is not displayed.'
  },
  {
    id: 283,
    category: 'ANIMATIONS',
    difficulty: 'BEGINNER',
    question: 'How do you apply non-linear motion (such as ease-in-out or bounce) to an explicit animation in Flutter?',
    codeSnippet: `final curvedAnimation = CurvedAnimation(
  parent: controller,
  curve: Curves.easeInOutCubic,
);`,
    options: [
      'By wrapping the controller in a `CurvedAnimation` with a chosen `Curve`.',
      'By setting controller.speed = "bounce".',
      'By writing a custom physics math formula inside build().',
      'By using a Timer.'
    ],
    correctIndex: 0,
    explanation: 'CurvedAnimation takes a parent AnimationController and applies a Curve (like Curves.easeInOut or Curves.bounceOut) to interpolate values non-linearly.'
  },
  {
    id: 284,
    category: 'ANIMATIONS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the role of a `Tween<T>` in Flutter animations?',
    codeSnippet: `final colorTween = ColorTween(begin: Colors.blue, end: Colors.red).animate(controller);`,
    options: [
      'It manages audio effects.',
      'It defines an interpolation between a `begin` and `end` value across an animation’s 0.0 to 1.0 progression.',
      'It forces a widget to rebuild 120 times per second.',
      'It schedules background network sync.'
    ],
    correctIndex: 1,
    explanation: 'A Tween maps the standard 0.0–1.0 input of an Animation into any target range or type (e.g. double, Color, Offset, Rect, EdgeInsets).'
  },
  {
    id: 285,
    category: 'ANIMATIONS',
    difficulty: 'ADVANCED',
    question: 'Why is `AnimatedBuilder` preferred over calling `setState()` inside an `addListener()` callback on an AnimationController?',
    codeSnippet: `AnimatedBuilder(
  animation: controller,
  builder: (context, child) => Transform.rotate(
    angle: controller.value * 2 * math.pi,
    child: child, // Static child not rebuilt!
  ),
  child: const ExpensiveStaticWidget(),
)`,
    options: [
      'AnimatedBuilder rebuilds only its builder subtree and allows passing an immutable `child` widget that is NOT rebuilt on every tick.',
      'AnimatedBuilder runs on a separate GPU thread.',
      'setState cannot be used with animations.',
      'AnimatedBuilder avoids using BuildContext.'
    ],
    correctIndex: 0,
    explanation: 'AnimatedBuilder scopes rebuilds surgically to the animating property, while its `child` parameter preserves expensive static widgets from being reconstructed each frame.'
  },
  {
    id: 286,
    category: 'ANIMATIONS',
    difficulty: 'INTERMEDIATE',
    question: 'How does a `Hero` animation work when navigating between two screens?',
    codeSnippet: `// Screen 1:
Hero(tag: 'avatar-\${user.id}', child: CircleAvatar(...))
// Screen 2:
Hero(tag: 'avatar-\${user.id}', child: LargeAvatar(...))`,
    options: [
      'Both screens must share a common database table.',
      'Flutter matches identical `tag` strings across routes, calculating a transition rect and flying the widget across the navigator overlay during route transitions.',
      'The widget is saved to disk and loaded again.',
      'Hero animations only work with images.'
    ],
    correctIndex: 1,
    explanation: 'Hero animations detect matching tags on old and new routes, creating an overlay flight path that smoothly transforms and moves the widget between screen locations.'
  },
  {
    id: 287,
    category: 'ANIMATIONS',
    difficulty: 'ADVANCED',
    question: 'How do you create a staggered animation where multiple visual properties animate sequentially within a single `AnimationController`?',
    codeSnippet: `final fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
  CurvedAnimation(parent: controller, curve: const Interval(0.0, 0.5, curve: Curves.easeIn)),
);
final slideAnimation = Tween<Offset>(begin: const Offset(0, 1), end: Offset.zero).animate(
  CurvedAnimation(parent: controller, curve: const Interval(0.5, 1.0, curve: Curves.easeOut)),
);`,
    options: [
      'By using multiple `Interval` curves with starting and ending fractions (0.0 to 1.0) on the same controller.',
      'By chaining 10 AnimationControllers with Future.delayed.',
      'By nesting 5 AnimatedContainers inside each other.',
      'Staggered animations are not possible in Flutter.'
    ],
    correctIndex: 0,
    explanation: 'The `Interval` curve specifies a begin and end fraction of the parent controller’s total duration, allowing precise scheduling of overlapping or sequential animations.'
  },
  {
    id: 288,
    category: 'ANIMATIONS',
    difficulty: 'ADVANCED',
    question: 'What is a physics-based animation in Flutter, and which class is commonly used to drive spring motion?',
    codeSnippet: `final simulation = SpringSimulation(
  SpringDescription(mass: 1, stiffness: 100, damping: 10),
  0.0, 1.0, velocity,
);
controller.animateWith(simulation);`,
    options: [
      'SpringSimulation and FrictionSimulation',
      'LinearTween',
      'CanvasPainter',
      'NativeMotion'
    ],
    correctIndex: 0,
    explanation: 'Physics-based animations model real-world physical simulations (like spring stiffness, mass, damping, friction) using classes like `SpringSimulation` via `controller.animateWith()`.'
  },
  {
    id: 289,
    category: 'ANIMATIONS',
    difficulty: 'INTERMEDIATE',
    question: 'What is the advantage of using Rive or Lottie over frame-by-frame GIF or video assets in a Flutter mobile app?',
    options: [
      'Rive and Lottie render vector-based motion graphics that are tiny in file size, scale crisply to any resolution, and support interactive state machine triggers.',
      'Rive animations only run in 8-bit color.',
      'GIFs are more efficient than vector animations.',
      'Lottie eliminates the need for the Flutter rendering engine.'
    ],
    correctIndex: 0,
    explanation: 'Vector motion formats like Rive and Lottie offer minuscule file footprints, infinite resolution scaling, and the ability to interact with app state machines dynamically.'
  },
  {
    id: 290,
    category: 'ANIMATIONS',
    difficulty: 'ADVANCED',
    question: 'What is the role of `AnimationController.fling()` in gesture-driven animations?',
    options: [
      'It discards the animation controller completely.',
      'It drives the controller using a velocity-based friction simulation derived from a user gesture drag velocity.',
      'It resets the animation to zero immediately without animating.',
      'It vibrates the device haptics.'
    ],
    correctIndex: 1,
    explanation: '`fling()` initiates a realistic momentum animation based on velocity parameters supplied from gesture callbacks (like onDragEnd).'
  },

  // =========================================================================
  // SECTION 10: CLEAN ARCHITECTURE & TESTING (291 - 300)
  // =========================================================================
  {
    id: 291,
    category: 'ARCHITECTURE',
    difficulty: 'EXPERT',
    question: 'In Clean Architecture for Flutter, why should domain entities and use cases have zero dependencies on external packages like Dio or SharedPreferences?',
    codeSnippet: `// Domain Entity
class User {
  final String id;
  final String email;
  const User({required this.id, required this.email});
}`,
    options: [
      'Because Dart cannot import external libraries inside classes.',
      'To enforce the Dependency Inversion Principle, ensuring core business rules remain pure, testable, and decoupled from framework or database changes.',
      'Because Flutter build tools will fail if external packages are imported in lib/domain.',
      'To enable automatic conversion to Objective-C.'
    ],
    correctIndex: 1,
    explanation: 'The domain layer contains essential business rules and must remain independent of UI, third-party libraries, and datasources. External details depend on domain abstractions, never the reverse.'
  },
  {
    id: 292,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'What is the role of a Repository interface in the Domain layer versus its implementation in the Data layer?',
    codeSnippet: `// Domain layer:
abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
}

// Data layer:
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  ...
}`,
    options: [
      'The Domain interface defines the contract required by business use cases; the Data layer implements it using concrete APIs, databases, and network clients.',
      'The Domain layer implements the SQLite queries.',
      'There is no reason to separate them; repositories should always be concrete classes.',
      'The Data layer only handles UI widgets.'
    ],
    correctIndex: 0,
    explanation: 'By defining repository abstractions in the domain layer, use cases depend only on contracts, allowing data sources (remote APIs, local caches) to be swapped or mocked seamlessly.'
  },
  {
    id: 293,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'Why is the `Result` or `Either<Failure, Success>` pattern often preferred over throwing untyped exceptions in repository methods?',
    codeSnippet: `Future<Either<Failure, List<Product>>> getProducts();`,
    options: [
      'It makes failure handling explicit in the type system, forcing calling layers to handle both success and error cases without relying on hidden runtime try-catches.',
      'Dart does not support try-catch blocks.',
      'Throwing exceptions is deprecated in Dart 3.',
      'Either types automatically show SnackBars.'
    ],
    correctIndex: 0,
    explanation: 'Functional error handling with Either or sealed Result types converts errors into values, requiring callers to explicitly handle failures at compile time.'
  },
  {
    id: 294,
    category: 'ARCHITECTURE',
    difficulty: 'BEGINNER',
    question: 'What is the difference between `test()` and `testWidgets()` in Flutter testing?',
    codeSnippet: `test('Unit test logic', () { ... });
testWidgets('Widget test UI', (WidgetTester tester) async { ... });`,
    options: [
      '`test()` is for pure Dart unit tests; `testWidgets()` provides a `WidgetTester` environment to pump, inspect, and interact with Flutter widget trees.',
      '`testWidgets()` can only be run on real devices.',
      '`test()` cannot assert values.',
      'There is no difference between them.'
    ],
    correctIndex: 0,
    explanation: '`test()` runs unit tests without Flutter UI bindings. `testWidgets()` provides a simulated widget environment via WidgetTester to pump widgets and verify interactions.'
  },
  {
    id: 295,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'When using `mocktail` or `mockito` in unit tests, what is the purpose of `verify()` and `verifyNoMoreInteractions()`?',
    codeSnippet: `verify(() => mockAuthRepository.login('test@test.com', 'password')).called(1);
verifyNoMoreInteractions(mockAuthRepository);`,
    options: [
      'To ensure that specific repository methods were called with expected arguments and no unexpected side effects occurred.',
      'To execute the real database query.',
      'To compile test files.',
      'To benchmark memory consumption.'
    ],
    correctIndex: 0,
    explanation: '`verify()` asserts that an expected method was invoked on a mock object with particular parameters, and `verifyNoMoreInteractions()` confirms no other unexpected calls were made.'
  },
  {
    id: 296,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'In widget testing, what is the distinction between `tester.pump()` and `tester.pumpAndSettle()`?',
    codeSnippet: `await tester.pump(); // Advances one frame
await tester.pumpAndSettle(); // Repeatedly pumps until all animations and microtasks finish`,
    options: [
      '`tester.pump()` advances the clock by a given duration or single frame; `tester.pumpAndSettle()` repeatedly pumps until no more frames are scheduled (animations settle).',
      '`tester.pump()` is for iOS only.',
      '`tester.pumpAndSettle()` runs indefinitely and must be avoided.',
      '`tester.pump()` reloads the operating system.'
    ],
    correctIndex: 0,
    explanation: '`tester.pump()` advances by a single frame. `tester.pumpAndSettle()` waits for all ongoing animations, transitions, and timers to settle completely.'
  },
  {
    id: 297,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'What is the role of the `integration_test` package in Flutter?',
    options: [
      'To verify unit calculations.',
      'To run end-to-end (E2E) automated tests on real physical devices or emulators, testing full app workflows against real backend services.',
      'To format Dart code according to style guidelines.',
      'To bundle assets into the APK.'
    ],
    correctIndex: 1,
    explanation: 'The `integration_test` package executes integration tests on target mobile devices or browsers, exercising complete user journeys and driving the real application.'
  },
  {
    id: 298,
    category: 'ARCHITECTURE',
    difficulty: 'ADVANCED',
    question: 'What is Golden Image Testing (`matchesGoldenFile`) in Flutter widget testing?',
    codeSnippet: `await expectLater(
  find.byType(CustomCard),
  matchesGoldenFile('goldens/custom_card.png'),
);`,
    options: [
      'Testing image compression algorithms.',
      'Rasterizing a widget in a test and comparing its pixel output against a master reference "golden" image to detect unexpected visual regressions.',
      'Testing if images exist on a remote CDN.',
      'An automated tool that colors widgets in gold.'
    ],
    correctIndex: 1,
    explanation: 'Golden tests render widgets to bitmap pixels and compare against a baseline master image, alerting developers immediately to visual regressions or font/layout shifts.'
  },
  {
    id: 299,
    category: 'ARCHITECTURE',
    difficulty: 'INTERMEDIATE',
    question: 'How do you pass compile-time environment configurations (e.g. API URL, environment flags) to Flutter without hardcoding them in code?',
    codeSnippet: `// Command line:
flutter run --dart-define=API_URL=https://api.myapp.com --dart-define=IS_PROD=true

// In Dart:
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3000');`,
    options: [
      'Using `--dart-define` command-line flags and reading them via `String.fromEnvironment()` / `bool.fromEnvironment()`.',
      'By committing passwords into Git repositories.',
      'By creating a global mutable text file on the phone Desktop.',
      'Environment variables are not supported in Flutter.'
    ],
    correctIndex: 0,
    explanation: '`--dart-define` passes compile-time constants to Dart code and native platform layers (Gradle/Xcode), allowing different build configurations (dev, staging, prod) without code changes.'
  },
  {
    id: 300,
    category: 'ARCHITECTURE',
    difficulty: 'EXPERT',
    question: 'How do you configure `analysis_options.yaml` for enterprise-grade Flutter codebases to prevent silent dynamic types and ensure strict type safety?',
    codeSnippet: `analyzer:
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true`,
    options: [
      'By setting `strict-casts: true`, `strict-inference: true`, and `strict-raw-types: true` under `analyzer.language`.',
      'By disabling all linter rules.',
      'By deleting analysis_options.yaml.',
      'By setting `ignore_all_errors: true`.'
    ],
    correctIndex: 0,
    explanation: 'Enabling `strict-casts`, `strict-inference`, and `strict-raw-types` in analyzer language options prevents implicit dynamic downcasts and enforces complete static type safety across the application.'
  }
];

export async function seedFlutterQuizQuestions(prisma: PrismaClient) {
  console.log('🌱 Seeding Flutter 100-Question Comprehensive Quiz Bank into PostgreSQL...');

  const tenant = await prisma.tenant.findUnique({
    where: { slug: 'flutter-v1' },
  });

  const tenantId = tenant ? tenant.id : undefined;

  for (const q of FLUTTER_100_QUIZ_BANK) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {
        tenantId,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        codeSnippet: q.codeSnippet,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      },
      create: {
        id: q.id,
        tenantId,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        codeSnippet: q.codeSnippet,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      },
    });
  }

  console.log(`✅ Successfully seeded ${FLUTTER_100_QUIZ_BANK.length} Flutter engineering quiz questions!`);
}

// Backward compatibility alias
export const FLUTTER_QUIZ_BANK = FLUTTER_100_QUIZ_BANK;
