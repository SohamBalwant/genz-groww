import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { PostCard } from '../components/community/PostCard';
import { QAThread } from '../components/community/QAThread';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import {
  LEARNING_MODULES,
  type LearningModule,
  type Chapter,
  type ModuleQuiz,
} from '../data/learningModules';
import {
  BookOpen,
  HelpCircle,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  GraduationCap,
  Sparkles,
  Layers,
  Check,
  BrainCircuit,
  FileText,
  AlertCircle,
  Search,
} from 'lucide-react';
import type { Post, Thread } from '../types';

interface LearningProgress {
  completedChapterIds: string[];
  quizScores: Record<string, { score: number; total: number; passed: boolean }>;
}

const PROGRESS_STORAGE_KEY = 'genz_groww_learning_progress_v1';

const getInitialProgress = (): LearningProgress => {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load learning progress:', e);
  }
  return { completedChapterIds: ['chap-1-1'], quizScores: {} };
};

export const LearnPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  // Tab State: 'paths' (default), 'posts', 'qa'
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'qa' || tabParam === 'posts' || tabParam === 'learn' ? (tabParam === 'learn' ? 'posts' : tabParam) : 'paths';

  // Progress Tracking State
  const [progress, setProgress] = useState<LearningProgress>(getInitialProgress);

  // Active Reading Chapter State
  const [activeChapter, setActiveChapter] = useState<{
    module: LearningModule;
    chapter: Chapter;
    chapterIndex: number;
  } | null>(null);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    module: LearningModule;
    quiz: ModuleQuiz;
  } | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Ask Question Modal State (for Q&A tab)
  const [showAskModal, setShowAskModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionSuccess, setQuestionSuccess] = useState(false);

  // Q&A Search & Tag Filter State
  const [qaSearchQuery, setQaSearchQuery] = useState('');
  const [selectedQaTag, setSelectedQaTag] = useState<string>('All');

  // Q&A Swiping Carousel State
  const [qaIndex, setQaIndex] = useState(0);
  const [touchQaStartX, setTouchQaStartX] = useState<number | null>(null);
  const [touchQaStartY, setTouchQaStartY] = useState<number | null>(null);
  const [touchQaDeltaX, setTouchQaDeltaX] = useState<number>(0);
  const [isQaSwiping, setIsQaSwiping] = useState(false);
  const [isQaHorizontalSwipe, setIsQaHorizontalSwipe] = useState(false);

  // Expanded Modules State (default first 2 open)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-foundations': true,
    'mod-indexing': true,
    'mod-debt': false,
    'mod-fundamentals': false,
  });

  // Expert Posts Swiping Carousel State
  const [postIndex, setPostIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isPostSwiping, setIsPostSwiping] = useState(false);
  const [isPostHorizontalSwipe, setIsPostHorizontalSwipe] = useState(false);

  // Save Progress to localStorage
  const updateProgress = useCallback((updater: (prev: LearningProgress) => LearningProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save learning progress:', err);
      }
      return next;
    });
  }, []);

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your learning module progress?')) {
      const resetState: LearningProgress = { completedChapterIds: [], quizScores: {} };
      setProgress(resetState);
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(resetState));
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchCommunity = async () => {
      try {
        const [po, th] = await Promise.all([
          dataService.getCommunityPosts(),
          dataService.getQAThreads(),
        ]);
        if (mounted) {
          setPosts(po);
          setThreads(th);
        }
      } catch (err) {
        console.error('Failed to load community content:', err);
      }
    };
    fetchCommunity();
    return () => {
      mounted = false;
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  // Progress Calculations
  const totalChapters = useMemo(
    () => LEARNING_MODULES.reduce((acc, m) => acc + m.chapters.length, 0),
    []
  );
  const totalQuizzes = LEARNING_MODULES.length;
  const completedChaptersCount = progress.completedChapterIds.length;
  const passedQuizzesCount = Object.values(progress.quizScores).filter((q) => q.passed).length;

  const overallProgressPct = Math.min(
    100,
    Math.round(((completedChaptersCount + passedQuizzesCount) / (totalChapters + totalQuizzes)) * 100)
  );

  const tierBadge = useMemo(() => {
    if (overallProgressPct >= 80) return { label: 'Financial Scholar', tier: 'Tier 4', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-200' };
    if (overallProgressPct >= 50) return { label: 'Analytical Thinker', tier: 'Tier 3', icon: BrainCircuit, color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (overallProgressPct >= 25) return { label: 'Informed Allocator', tier: 'Tier 2', icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    return { label: 'Apprentice Investor', tier: 'Tier 1', icon: Sparkles, color: 'text-amber-700 bg-amber-50 border-amber-200' };
  }, [overallProgressPct]);

  // Q&A Available Tags & Filtered Threads
  const availableQaTags = useMemo(() => {
    const set = new Set<string>();
    threads.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return ['All', ...Array.from(set)];
  }, [threads]);

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      // Tag matching
      const matchesTag =
        selectedQaTag === 'All' ||
        thread.tags.some((t) => t.toLowerCase() === selectedQaTag.toLowerCase());

      if (!matchesTag) return false;

      // Query matching
      if (!qaSearchQuery.trim()) return true;

      const q = qaSearchQuery.toLowerCase().trim();
      const matchesQuestion = thread.question.toLowerCase().includes(q);
      const matchesTags = thread.tags.some((t) => t.toLowerCase().includes(q));
      const matchesAnswers = thread.answers.some(
        (a) =>
          a.body.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q)
      );

      return matchesQuestion || matchesTags || matchesAnswers;
    });
  }, [threads, qaSearchQuery, selectedQaTag]);

  // Reset Q&A index whenever search or tag filters change
  useEffect(() => {
    setQaIndex(0);
  }, [qaSearchQuery, selectedQaTag]);

  // Q&A Carousel Navigation
  const totalQa = filteredThreads.length;
  const safeQaIndex = totalQa > 0 ? Math.min(Math.max(0, qaIndex), totalQa - 1) : 0;
  const hasQaLeft = safeQaIndex > 0;
  const hasQaRight = safeQaIndex < totalQa - 1;

  const handleQaPrev = useCallback(() => {
    setQaIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleQaNext = useCallback(() => {
    setQaIndex((prev) => Math.min(totalQa - 1, prev + 1));
  }, [totalQa]);

  const handleQaTouchStart = (e: React.TouchEvent) => {
    setTouchQaStartX(e.touches[0].clientX);
    setTouchQaStartY(e.touches[0].clientY);
    setTouchQaDeltaX(0);
    setIsQaSwiping(false);
    setIsQaHorizontalSwipe(false);
  };

  const handleQaTouchMove = (e: React.TouchEvent) => {
    if (touchQaStartX === null || touchQaStartY === null) return;
    const deltaX = e.touches[0].clientX - touchQaStartX;
    const deltaY = e.touches[0].clientY - touchQaStartY;

    if (!isQaHorizontalSwipe && !isQaSwiping) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        setIsQaHorizontalSwipe(true);
        setIsQaSwiping(true);
      } else if (Math.abs(deltaY) > 8) {
        return;
      }
    }

    if (isQaHorizontalSwipe) {
      if ((safeQaIndex === 0 && deltaX > 0) || (safeQaIndex === totalQa - 1 && deltaX < 0)) {
        setTouchQaDeltaX(deltaX * 0.25);
      } else {
        setTouchQaDeltaX(deltaX);
      }
    }
  };

  const handleQaTouchEnd = () => {
    if (isQaHorizontalSwipe && touchQaStartX !== null) {
      const threshold = 40;
      if (touchQaDeltaX < -threshold && hasQaRight) {
        handleQaNext();
      } else if (touchQaDeltaX > threshold && hasQaLeft) {
        handleQaPrev();
      }
    }
    setTouchQaStartX(null);
    setTouchQaStartY(null);
    setTouchQaDeltaX(0);
    setIsQaSwiping(false);
    setIsQaHorizontalSwipe(false);
  };

  // Toggle Module Accordion
  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Chapter Reader Handlers
  const handleOpenChapter = (mod: LearningModule, chap: Chapter, index: number) => {
    setActiveChapter({ module: mod, chapter: chap, chapterIndex: index });
  };

  const handleMarkChapterCompleted = (chapterId: string) => {
    updateProgress((prev) => {
      if (prev.completedChapterIds.includes(chapterId)) return prev;
      return {
        ...prev,
        completedChapterIds: [...prev.completedChapterIds, chapterId],
      };
    });
  };

  const handleNextChapter = () => {
    if (!activeChapter) return;
    const { module: mod, chapterIndex } = activeChapter;
    handleMarkChapterCompleted(activeChapter.chapter.id);

    if (chapterIndex < mod.chapters.length - 1) {
      setActiveChapter({
        module: mod,
        chapter: mod.chapters[chapterIndex + 1],
        chapterIndex: chapterIndex + 1,
      });
    } else {
      // Completed all chapters in module -> prompt quiz
      setActiveChapter(null);
      handleOpenQuiz(mod);
    }
  };

  // Quiz Handlers
  const handleOpenQuiz = (mod: LearningModule) => {
    setActiveQuiz({ module: mod, quiz: mod.quiz });
    setQuizQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const handleSelectQuizAnswer = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuiz) return;
    if (quizQuestionIndex < activeQuiz.quiz.questions.length - 1) {
      setQuizQuestionIndex((prev) => prev + 1);
    } else {
      // Finished Quiz
      const total = activeQuiz.quiz.questions.length;
      let score = 0;
      activeQuiz.quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          score += 1;
        }
      });
      const passed = score >= activeQuiz.quiz.passingScore;
      updateProgress((prev) => ({
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [activeQuiz.quiz.id]: { score, total, passed },
        },
      }));
      setQuizFinished(true);
    }
  };

  // Post Carousel Navigation
  const totalPosts = posts.length;
  const safePostIndex = totalPosts > 0 ? Math.min(Math.max(0, postIndex), totalPosts - 1) : 0;
  const hasPostLeft = safePostIndex > 0;
  const hasPostRight = safePostIndex < totalPosts - 1;

  const handlePostPrev = useCallback(() => {
    setPostIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handlePostNext = useCallback(() => {
    setPostIndex((prev) => Math.min(totalPosts - 1, prev + 1));
  }, [totalPosts]);

  const handlePostTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setTouchDeltaX(0);
    setIsPostSwiping(false);
    setIsPostHorizontalSwipe(false);
  };

  const handlePostTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;

    if (!isPostHorizontalSwipe && !isPostSwiping) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        setIsPostHorizontalSwipe(true);
        setIsPostSwiping(true);
      } else if (Math.abs(deltaY) > 8) {
        return;
      }
    }

    if (isPostHorizontalSwipe) {
      if ((safePostIndex === 0 && deltaX > 0) || (safePostIndex === totalPosts - 1 && deltaX < 0)) {
        setTouchDeltaX(deltaX * 0.25);
      } else {
        setTouchDeltaX(deltaX);
      }
    }
  };

  const handlePostTouchEnd = () => {
    if (isPostHorizontalSwipe && touchStartX !== null) {
      const threshold = 40;
      if (touchDeltaX < -threshold && hasPostRight) {
        handlePostNext();
      } else if (touchDeltaX > threshold && hasPostLeft) {
        handlePostPrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchDeltaX(0);
    setIsPostSwiping(false);
    setIsPostHorizontalSwipe(false);
  };

  // Q&A Question submission
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newThread: Thread = {
      id: `th-local-${Date.now()}`,
      question: questionText.trim(),
      askedBy: 'Anonymous',
      askedAt: new Date().toISOString(),
      tags: ['Beginner', 'Investing Basics'],
      isDemo: true,
      answers: [
        {
          id: `ans-local-${Date.now()}`,
          author: {
            name: 'SEBI Registered Research Analyst',
            credentials: 'NISM Certified Series XV',
            verifiedBy: 'SEBI Registry',
            isDemo: true,
          },
          body: 'Thanks for your query. In general, beginners are advised to match their investment horizon with the asset duration. High liquidity instruments for short horizons, equity index funds for 5+ years.',
          sources: [{ label: 'Investor Education Guide', url: 'https://sebi.gov.in' }],
        },
      ],
    };

    setThreads([newThread, ...threads]);
    setQuestionText('');
    setQuestionSuccess(true);
    setTimeout(() => {
      setQuestionSuccess(false);
      setShowAskModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl mx-auto px-1 sm:px-2">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
              Investor Learning Academy
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
            Learn & Practice
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Structured module-by-module tracks, bite-sized chapters, verified practitioner posts, and concept quizzes.
          </p>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto no-scrollbar">
        {[
          { id: 'paths', label: 'Paths & Quizzes', icon: Layers },
          { id: 'posts', label: 'Expert Posts', icon: BookOpen },
          { id: 'qa', label: 'Q&A Discussions', icon: HelpCircle },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-textMuted hover:text-textPrimary'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: STRUCTURED MODULE-BY-MODULE LEARNING PATHS */}
      {activeTab === 'paths' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Progress Tracking Dashboard Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md border border-slate-800 space-y-4">
            {/* Top Row: Rank/Tier Badge & Reset Button */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <tierBadge.icon size={22} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 inline-block">
                    {tierBadge.tier}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 truncate">
                    {tierBadge.label}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetProgress}
                title="Reset learning progress"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-slate-700/60 shrink-0"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Second Row: Curriculum Mastered Metric & Percentage */}
            <div className="flex items-end justify-between pt-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Curriculum Mastered
              </span>
              <span className="text-xl font-extrabold text-emerald-400 tabular-nums">
                {overallProgressPct}%
              </span>
            </div>

            {/* Progress Bar & Sub-metrics */}
            <div className="space-y-3 pt-1">
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgressPct}%` }}
                />
              </div>

              {/* Sub-metrics Stat Boxes */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl px-3 py-2.5 flex flex-col justify-between">
                  <span className="text-sm font-extrabold text-white">
                    {completedChaptersCount} <span className="text-xs font-normal text-slate-400">/ {totalChapters}</span>
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium leading-tight mt-1">
                    Bite-Sized Chapters Read
                  </span>
                </div>
                <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl px-3 py-2.5 flex flex-col justify-between">
                  <span className="text-sm font-extrabold text-white">
                    {passedQuizzesCount} <span className="text-xs font-normal text-slate-400">/ {totalQuizzes}</span>
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium leading-tight mt-1">
                    Module Quizzes Passed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module-by-Module Path Cards */}
          <div className="space-y-4">
            <div className="px-1">
              <h2 className="text-base font-bold text-textPrimary tracking-tight">
                Curated Learning Paths ({LEARNING_MODULES.length} Modules)
              </h2>
            </div>

            <div className="space-y-4">
              {LEARNING_MODULES.map((mod, modIdx) => {
                const isExpanded = !!expandedModules[mod.id];
                const modCompletedChapters = mod.chapters.filter((c) =>
                  progress.completedChapterIds.includes(c.id)
                ).length;
                const modQuizStatus = progress.quizScores[mod.quiz.id];
                const isModComplete =
                  modCompletedChapters === mod.chapters.length && modQuizStatus?.passed;

                return (
                  <div
                    key={mod.id}
                    className="bg-white border border-border hover:border-borderMd rounded-2xl shadow-2xs transition-all overflow-hidden"
                  >
                    {/* Module Accordion Header */}
                    <div
                      onClick={() => toggleModule(mod.id)}
                      className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition-colors border-b border-border/60"
                    >
                      <div className="space-y-1.5 flex-1">
                        {isModComplete && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Completed
                            </span>
                          </div>
                        )}

                        <h3 className="text-sm sm:text-base font-semibold text-textPrimary leading-snug">
                          {mod.title}
                        </h3>

                        {/* Module progress pill */}
                        <div className="pt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-textMuted">
                          <div className="flex items-center gap-2">
                            <div className="w-20 sm:w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
                              <div
                                className="h-full bg-primary-600 rounded-full transition-all"
                                style={{
                                  width: `${(modCompletedChapters / mod.chapters.length) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-textSecondary whitespace-nowrap">
                              {modCompletedChapters}/{mod.chapters.length} Chapters
                            </span>
                          </div>
                          {modQuizStatus && (
                            <span
                              className={`text-[11px] font-medium whitespace-nowrap flex items-center gap-1.5 ${
                                modQuizStatus.passed ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              <span className="text-slate-300">•</span>
                              <span>Quiz: {modQuizStatus.score}/{modQuizStatus.total}</span>
                              {modQuizStatus.passed && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold">
                                  Passed
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-textMuted p-1">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Module Content (Chapters & Quiz) */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-3 bg-white animate-fadeIn">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted block">
                          Bite-Sized Chapters in This Module
                        </span>

                        <div className="grid grid-cols-1 gap-2.5">
                          {mod.chapters.map((chap, chapIdx) => {
                            const isChapDone = progress.completedChapterIds.includes(chap.id);

                            return (
                              <div
                                key={chap.id}
                                className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                                  isChapDone
                                    ? 'bg-emerald-50/30 border-emerald-200/80'
                                    : 'bg-bgSurface border-border hover:border-borderMd'
                                }`}
                              >
                                <div className="space-y-0.5 flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">
                                      Chapter {modIdx + 1}.{chapIdx + 1}
                                    </span>
                                    {isChapDone && (
                                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                                        <Check size={12} className="stroke-[3]" /> Read
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-semibold text-textPrimary leading-snug">
                                    {chap.title}
                                  </h4>
                                </div>

                                <div className="shrink-0 flex items-center">
                                  <Button
                                    size="sm"
                                    variant={isChapDone ? 'outline' : 'primary'}
                                    leftIcon={<FileText size={12} className="shrink-0" />}
                                    className="text-xs font-semibold whitespace-nowrap shrink-0 px-2.5 py-1 h-8 min-h-[32px] shadow-2xs"
                                    onClick={() => handleOpenChapter(mod, chap, chapIdx)}
                                  >
                                    {isChapDone ? 'Review Chapter' : 'Read Chapter'}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Module Quiz Box */}
                        <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-primary-50/70 via-slate-50 to-blue-50/60 p-3.5 rounded-xl border-primary-200/60">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800 flex items-center gap-1.5">
                              <BrainCircuit size={13} className="text-primary-600" />
                              Module Knowledge Check
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-textPrimary leading-snug">
                              {mod.quiz.title} ({mod.quiz.questions.length} Qs)
                            </h4>
                          </div>

                          <div className="shrink-0 flex items-center">
                            <Button
                              size="sm"
                              variant={modQuizStatus?.passed ? 'outline' : 'primary'}
                              rightIcon={<ArrowRight size={12} className="shrink-0" />}
                              className={`text-xs font-semibold whitespace-nowrap shrink-0 px-3 py-1 h-8 min-h-[32px] shadow-2xs ${
                                modQuizStatus?.passed
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-primary-600 text-white'
                              }`}
                              onClick={() => handleOpenQuiz(mod)}
                            >
                              {modQuizStatus
                                ? modQuizStatus.passed
                                  ? `Passed (${modQuizStatus.score}/${modQuizStatus.total})`
                                  : `Retake Quiz (${modQuizStatus.score}/${modQuizStatus.total})`
                                : 'Take Module Quiz'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPERT POSTS (SWIPEABLE INSTAGRAM-STYLE CAROUSEL) */}
      {activeTab === 'posts' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Post Header with Counter Pill */}
          <div className="flex items-center justify-between px-1">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 bg-primary-100/70 px-2.5 py-0.5 rounded-full border border-primary-200/50">
                Post {safePostIndex + 1} of {totalPosts}
              </span>
              <h2 className="text-base font-bold text-textPrimary tracking-tight">
                Verified Practitioner Insights
              </h2>
            </div>

            {/* Instagram Pill Badge Counter */}
            <div className="flex items-center gap-1 bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider shadow-2xs backdrop-blur-sm">
              <span>{safePostIndex + 1}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-300 font-semibold">{totalPosts}</span>
            </div>
          </div>

          {/* Instagram-style Post Swiping Carousel Container */}
          <div className="relative">
            {/* Left Direction Icon: Shown ONLY when there are posts to the left */}
            {hasPostLeft && (
              <button
                type="button"
                onClick={handlePostPrev}
                aria-label="Previous expert post"
                title="Previous expert post"
                className="absolute -left-1.5 sm:-left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-primary-600 shadow-md border border-slate-200/90 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-md group"
              >
                <ChevronLeft
                  size={14}
                  className="stroke-[2.5] -translate-x-0.5 group-hover:-translate-x-1 transition-transform"
                />
              </button>
            )}

            {/* Viewport: Exactly ONE post visible at a time across full width */}
            <div
              className="w-full overflow-hidden rounded-2xl select-none"
              onTouchStart={handlePostTouchStart}
              onTouchMove={handlePostTouchMove}
              onTouchEnd={handlePostTouchEnd}
            >
              <div
                className="flex items-start"
                style={{
                  transform: `translateX(calc(-${safePostIndex * 100}% + ${touchDeltaX}px))`,
                  transition: isPostSwiping ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {posts.map((post) => (
                  <div key={post.id} className="w-full shrink-0">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Direction Icon: Shown ONLY when there are posts to the right */}
            {hasPostRight && (
              <button
                type="button"
                onClick={handlePostNext}
                aria-label="Next expert post"
                title="Next expert post"
                className="absolute -right-1.5 sm:-right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-primary-600 shadow-md border border-slate-200/90 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-md group"
              >
                <ChevronRight
                  size={14}
                  className="stroke-[2.5] translate-x-0.5 group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>

          {/* Pagination Dots & Navigation Hints */}
          {totalPosts > 1 && (
            <div className="flex flex-col items-center gap-2 pt-1 pb-2">
              <div
                className="flex items-center justify-center gap-1.5"
                role="tablist"
                aria-label="Expert posts slides"
              >
                {posts.map((post, idx) => (
                  <button
                    key={post.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === safePostIndex}
                    aria-label={`Go to post ${idx + 1}`}
                    onClick={() => setPostIndex(idx)}
                    className={`transition-all duration-200 cursor-pointer ${
                      idx === safePostIndex
                        ? 'w-6 h-1.5 bg-primary-600 rounded-full shadow-2xs'
                        : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between w-full px-2 text-[11px] text-textMuted font-medium">
                <span>{hasPostLeft ? '← Swipe for previous post' : '• First expert post'}</span>
                <span className="hidden sm:inline text-[10px]">Use arrows or swipe</span>
                <span>{hasPostRight ? 'Swipe for next post →' : '• All posts viewed'}</span>
              </div>
            </div>
          )}


        </div>
      )}

      {/* TAB 3: Q&A DISCUSSIONS */}
      {activeTab === 'qa' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Ask Question Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border shadow-2xs space-y-3.5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block">
                Community Q&A
              </span>
              <h3 className="text-base font-bold text-textPrimary leading-snug">
                Ask a Question to SEBI-Registered Mentors
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Get clarity on taxes, index rebalancing, sovereign G-Secs, NAV pricing, or expense ratios.
              </p>
            </div>
            <div className="pt-0.5">
              <Button
                size="sm"
                variant="primary"
                className="font-bold text-xs whitespace-nowrap w-full sm:w-auto"
                onClick={() => {
                  if (qaSearchQuery.trim() && !questionText) {
                    setQuestionText(qaSearchQuery.trim());
                  }
                  setShowAskModal(true);
                }}
              >
                Ask Anonymous Question
              </Button>
            </div>
          </div>

          {/* Search Bar & Topic Filter Pills */}
          <div className="bg-white p-4 rounded-2xl border border-border shadow-2xs space-y-3">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 text-textMuted pointer-events-none"
              />
              <input
                type="text"
                value={qaSearchQuery}
                onChange={(e) => setQaSearchQuery(e.target.value)}
                placeholder="Search questions by topic, keyword, or tag (e.g. SIP, NAV, Gold, Direct Plan)..."
                aria-label="Search questions"
                className="w-full pl-10 pr-9 py-2.5 bg-bgSurface border border-border rounded-xl text-xs sm:text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
              {qaSearchQuery && (
                <button
                  type="button"
                  onClick={() => setQaSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 p-1 rounded-md text-textMuted hover:text-textPrimary hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Topic / Tag Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-bold text-textMuted shrink-0 pr-1">
                Topics:
              </span>
              {availableQaTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedQaTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedQaTag === tag
                      ? 'bg-primary-600 text-white shadow-2xs'
                      : 'bg-bgSurface hover:bg-slate-100 text-textSecondary border border-border'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Active Search & Count Indicator */}
            {(qaSearchQuery || selectedQaTag !== 'All') && (
              <div className="flex items-center justify-between text-xs text-textMuted pt-1 border-t border-border/60">
                <span>
                  Showing {filteredThreads.length} of {threads.length} questions
                  {selectedQaTag !== 'All' && <strong> in #{selectedQaTag}</strong>}
                  {qaSearchQuery && (
                    <>
                      {' '}matching "<strong>{qaSearchQuery}</strong>"
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQaSearchQuery('');
                    setSelectedQaTag('All');
                  }}
                  className="text-primary-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Threads Carousel or Empty State */}
          {filteredThreads.length > 0 ? (
            <div className="space-y-4">
              {/* Question Header with Counter Pill */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-base font-bold text-textPrimary tracking-tight">
                    Question & Mentor Answer
                  </h3>
                </div>

                {/* Instagram Pill Badge Counter */}
                <div className="flex items-center gap-1 bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider shadow-2xs backdrop-blur-sm">
                  <span>{safeQaIndex + 1}</span>
                  <span className="text-slate-400 font-normal">/</span>
                  <span className="text-slate-300 font-semibold">{totalQa}</span>
                </div>
              </div>

              {/* Instagram-style Question Swiping Carousel Container */}
              <div className="relative">
                {/* Left Direction Icon: Shown ONLY when there are questions to the left */}
                {hasQaLeft && (
                  <button
                    type="button"
                    onClick={handleQaPrev}
                    aria-label="Previous question"
                    title="Previous question"
                    className="absolute -left-1.5 sm:-left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-primary-600 shadow-md border border-slate-200/90 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-md group"
                  >
                    <ChevronLeft
                      size={14}
                      className="stroke-[2.5] -translate-x-0.5 group-hover:-translate-x-1 transition-transform"
                    />
                  </button>
                )}

                {/* Viewport: Exactly ONE question card visible at a time across full width */}
                <div
                  className="w-full overflow-hidden rounded-2xl select-none"
                  onTouchStart={handleQaTouchStart}
                  onTouchMove={handleQaTouchMove}
                  onTouchEnd={handleQaTouchEnd}
                >
                  <div
                    className="flex items-start"
                    style={{
                      transform: `translateX(calc(-${safeQaIndex * 100}% + ${touchQaDeltaX}px))`,
                      transition: isQaSwiping ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    {filteredThreads.map((thread) => (
                      <div key={thread.id} className="w-full shrink-0">
                        <QAThread thread={thread} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Direction Icon: Shown ONLY when there are questions to the right */}
                {hasQaRight && (
                  <button
                    type="button"
                    onClick={handleQaNext}
                    aria-label="Next question"
                    title="Next question"
                    className="absolute -right-1.5 sm:-right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-primary-600 shadow-md border border-slate-200/90 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer backdrop-blur-md group"
                  >
                    <ChevronRight
                      size={14}
                      className="stroke-[2.5] translate-x-0.5 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                )}
              </div>

              {/* Pagination Dots & Navigation Hints */}
              {totalQa > 1 && (
                <div className="flex flex-col items-center gap-2 pt-1 pb-2">
                  <div
                    className="flex items-center justify-center gap-1.5"
                    role="tablist"
                    aria-label="Q&A question slides"
                  >
                    {filteredThreads.map((thread, idx) => (
                      <button
                        key={thread.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === safeQaIndex}
                        aria-label={`Go to question ${idx + 1}`}
                        onClick={() => setQaIndex(idx)}
                        className={`transition-all duration-200 cursor-pointer ${
                          idx === safeQaIndex
                            ? 'w-6 h-1.5 bg-primary-600 rounded-full shadow-2xs'
                            : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between w-full px-2 text-[11px] text-textMuted font-medium">
                    <span>{hasQaLeft ? '← Swipe for previous question' : '• First question'}</span>
                    <span className="hidden sm:inline text-[10px]">Use arrows or swipe</span>
                    <span>{hasQaRight ? 'Swipe for next question →' : '• All questions viewed'}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-borderMd space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-textPrimary">
                  No questions found matching your search
                </h4>
                <p className="text-xs text-textSecondary max-w-sm mx-auto">
                  We couldn't find any discussions matching "{qaSearchQuery}". Be the first to ask verified practitioners about this!
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setQaSearchQuery('');
                    setSelectedQaTag('All');
                  }}
                >
                  Clear Search
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setQuestionText(qaSearchQuery);
                    setShowAskModal(true);
                  }}
                >
                  Ask This Question
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE CHAPTER READER MODAL */}
      {activeChapter && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveChapter(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chapter Reader"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-[390px] w-full p-4 sm:p-5 space-y-4 shadow-2xl border border-border animate-scaleIn max-h-[85vh] overflow-y-auto scrollbar-thin"
          >
            {/* Reader Header */}
            <div className="flex items-start justify-between gap-2.5 border-b border-border pb-3">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-100 text-primary-800 truncate max-w-[220px]">
                    {activeChapter.module.title}
                  </span>
                  <span className="text-xs text-textMuted flex items-center gap-1 shrink-0">
                    <Clock size={12} /> {activeChapter.chapter.duration}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-textPrimary leading-snug">
                  {activeChapter.chapter.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveChapter(null)}
                className="p-1.5 rounded-lg text-textMuted hover:text-textPrimary hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close chapter reader"
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary Box */}
            <div className="bg-primary-50/60 border border-primary-200/60 rounded-xl p-3.5 space-y-1 text-xs text-primary-950">
              <span className="font-bold uppercase tracking-wider text-[10px] text-primary-800 block">
                Chapter Overview
              </span>
              <p className="leading-relaxed font-medium">
                {activeChapter.chapter.summary}
              </p>
            </div>

            {/* Formatted Content Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-textPrimary leading-relaxed">
              {activeChapter.chapter.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Concrete Rupee Example */}
            {activeChapter.chapter.rupeeExample && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  ₹ {activeChapter.chapter.rupeeExample.title}
                </span>
                <p className="text-xs text-amber-950/90 leading-relaxed font-medium">
                  {activeChapter.chapter.rupeeExample.description}
                </p>
                <div className="text-[11px] font-bold text-amber-800 pt-0.5">
                  Result: {activeChapter.chapter.rupeeExample.calc}
                </div>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Key Takeaways
              </span>
              <ul className="space-y-1.5 text-xs text-textSecondary list-disc pl-5">
                {activeChapter.chapter.keyTakeaways.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Reader Footer Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                size="sm"
                variant="primary"
                leftIcon={<Check size={14} className="shrink-0" />}
                rightIcon={<ArrowRight size={14} className="shrink-0" />}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 justify-center"
                onClick={handleNextChapter}
              >
                {activeChapter.chapterIndex < activeChapter.module.chapters.length - 1
                  ? 'Mark Complete & Next Chapter'
                  : 'Mark Complete & Take Quiz'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setActiveChapter(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE QUIZ MODAL */}
      {activeQuiz && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveQuiz(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Module Quiz"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-[390px] w-full p-4 sm:p-5 space-y-4 shadow-2xl border border-border animate-scaleIn max-h-[85vh] overflow-y-auto scrollbar-thin"
          >
            {!quizFinished ? (
              <>
                {/* Quiz Header */}
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                      {activeQuiz.module.title}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-textPrimary">
                      {activeQuiz.quiz.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    className="p-1.5 rounded-lg text-textMuted hover:text-textPrimary hover:bg-slate-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Question Progress Pill */}
                <div className="flex items-center justify-between text-xs text-textSecondary font-semibold">
                  <span>
                    Question {quizQuestionIndex + 1} of {activeQuiz.quiz.questions.length}
                  </span>
                  <span>Passing Score: {activeQuiz.quiz.passingScore}/{activeQuiz.quiz.questions.length}</span>
                </div>

                {/* Active Question */}
                {(() => {
                  const currentQ = activeQuiz.quiz.questions[quizQuestionIndex];
                  const chosenOption = selectedAnswers[quizQuestionIndex];
                  const hasAnswered = chosenOption !== undefined;
                  const isCorrect = chosenOption === currentQ.correctIndex;

                  return (
                    <div className="space-y-4">
                      <h4 className="text-sm sm:text-base font-bold text-textPrimary leading-snug">
                        {currentQ.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2">
                        {currentQ.options.map((opt, optIdx) => {
                          const isSelected = chosenOption === optIdx;
                          const isOptionCorrect = optIdx === currentQ.correctIndex;

                          let optionClass =
                            'bg-bgSurface border-border text-textPrimary hover:bg-slate-50';
                          if (hasAnswered) {
                            if (isOptionCorrect) {
                              optionClass =
                                'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold';
                            } else if (isSelected) {
                              optionClass =
                                'bg-red-50 text-red-950 border-red-300 font-semibold';
                            } else {
                              optionClass = 'opacity-60 bg-bgSurface border-border';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuizAnswer(quizQuestionIndex, optIdx)}
                              disabled={hasAnswered}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optionClass}`}
                            >
                              <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-bold text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                              {hasAnswered && isOptionCorrect && (
                                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      {hasAnswered && (
                        <div
                          className={`p-3.5 rounded-xl border space-y-1 text-xs animate-fadeIn ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                              : 'bg-amber-50/80 border-amber-200 text-amber-950'
                          }`}
                        >
                          <span className="font-bold flex items-center gap-1">
                            {isCorrect ? (
                              <CheckCircle2 size={13} className="text-emerald-600" />
                            ) : (
                              <AlertCircle size={13} className="text-amber-600" />
                            )}
                            {isCorrect ? 'Correct Analysis!' : 'Learning Insight:'}
                          </span>
                          <p className="leading-relaxed">{currentQ.explanation}</p>
                        </div>
                      )}

                      {/* Next / Finish Button */}
                      {hasAnswered && (
                        <div className="flex justify-end pt-2">
                          <Button
                            size="sm"
                            variant="primary"
                            rightIcon={<ArrowRight size={13} className="shrink-0" />}
                            onClick={handleNextQuizQuestion}
                          >
                            {quizQuestionIndex < activeQuiz.quiz.questions.length - 1
                              ? 'Next Question'
                              : 'Finish Quiz & Record Score'}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              /* Quiz Completion Summary */
              <div className="text-center py-4 space-y-4 animate-scaleIn">
                {(() => {
                  const total = activeQuiz.quiz.questions.length;
                  let score = 0;
                  activeQuiz.quiz.questions.forEach((q, idx) => {
                    if (selectedAnswers[idx] === q.correctIndex) score += 1;
                  });
                  const passed = score >= activeQuiz.quiz.passingScore;

                  return (
                    <>
                      <div
                        className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                          passed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {passed ? <Award size={32} /> : <AlertCircle size={32} />}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-textPrimary">
                          {passed ? 'Module Mastered!' : 'Keep Practicing!'}
                        </h3>
                        <p className="text-xs text-textSecondary">
                          You scored{' '}
                          <strong className="text-textPrimary">
                            {score} out of {total}
                          </strong>{' '}
                          ({Math.round((score / total) * 100)}%).{' '}
                          {passed
                            ? 'Great job demonstrating sound analytical understanding!'
                            : 'Review the chapter materials and try again to cement your concepts.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setQuizQuestionIndex(0);
                            setSelectedAnswers({});
                            setQuizFinished(false);
                          }}
                        >
                          <RotateCcw size={13} />
                          <span>Retake Quiz</span>
                        </Button>

                        <Button size="sm" variant="primary" onClick={() => setActiveQuiz(null)}>
                          <span>Return to Modules</span>
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setShowAskModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-[390px] w-full p-5 space-y-4 shadow-xl border border-border animate-scaleIn"
          >
            <h2 className="text-lg font-bold text-textPrimary">Ask a Question</h2>
            <p className="text-xs text-textSecondary">
              Your question will be posted anonymously to SEBI-registered mentors and verified practitioners.
            </p>

            <form onSubmit={handleAskQuestion} className="space-y-3">
              <textarea
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="What would you like to understand? (e.g., How does duration risk impact bond prices?)"
                className="w-full p-3 bg-bgSurface border border-borderMd rounded-xl text-xs text-textPrimary focus:outline-none focus:border-primary-500"
              />

              {questionSuccess && (
                <p className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Question recorded in demo session!
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAskModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
