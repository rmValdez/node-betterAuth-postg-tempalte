/**
 * Angular Quiz Seeder (Forwarding Module)
 * 
 * Re-exports the complete 100-question Angular Quiz bank and seeder from angular-quiz.seeder.ts
 * for backward compatibility and clean distinction against vue-quiz.seeder.ts.
 */

export * from './angular-quiz.seeder';
export { seedAngularQuizQuestions as seedQuizQuestions } from './angular-quiz.seeder';
