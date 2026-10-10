import React, { useState, useEffect } from 'react';
import type { Thread, ThreadAnswer } from '../../types';
import { Card } from '../ui/Card';
import { DemoBadge } from '../ui/DemoBadge';
import { formatDate } from '../../lib/format';
import { ThumbsUp, ExternalLink, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const QAThread: React.FC<{ thread: Thread }> = ({ thread }) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(3);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<ThreadAnswer[]>(thread.answers);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyBody, setReplyBody] = useState<string>('');
  const [replyAuthor, setReplyAuthor] = useState<string>('');
  const [replySuccess, setReplySuccess] = useState<boolean>(false);

  useEffect(() => {
    setAnswers(thread.answers);
  }, [thread.answers]);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((c) => c + 1);
      setHasVoted(true);
    }
  };

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;

    const newAnswer: ThreadAnswer = {
      id: `ans-user-${Date.now()}`,
      author: {
        name: replyAuthor.trim() || 'Community Contributor',
        credentials: 'Learner & Investor',
        verifiedBy: 'Community Peer',
        isDemo: true,
      },
      body: replyBody.trim(),
    };

    setAnswers([...answers, newAnswer]);
    setReplyBody('');
    setReplyAuthor('');
    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setShowReplyForm(false);
    }, 1500);
  };

  return (
    <Card padding="md" className="space-y-4 bg-white border-border shadow-2xs rounded-2xl px-5 sm:px-6">
      {/* Question Header */}
      <div className="space-y-2 pb-3 border-b border-border/70">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-textMuted">
              {formatDate(thread.askedAt, { relative: true })}
            </span>
            <DemoBadge size="xs" />
          </div>
        </div>
        <h3 className="font-bold text-base sm:text-lg text-textPrimary leading-snug tracking-tight">
          {thread.question}
        </h3>
      </div>

      {/* Answers Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
              <span>Answers ({answers.length})</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showReplyForm ? 'Cancel' : '+ Write an Answer'}</span>
          </button>
        </div>

        {/* Existing Answers List */}
        {answers.map((ans) => (
          <div
            key={ans.id}
            className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2.5 text-xs"
          >
            {/* Author row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-textPrimary">{ans.author.name}</span>
              </div>
              {ans.author.credentials && (
                <span className="text-[10px] text-textMuted">
                  {ans.author.credentials}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed whitespace-pre-line pl-2.5 border-l-2 border-emerald-500">
              {ans.body}
            </p>

            {ans.sources && ans.sources.length > 0 && (
              <div className="flex items-center gap-2 pt-1 border-t border-border/60 text-[11px]">
                <span className="text-textMuted font-medium">Source:</span>
                {ans.sources.map((s, sIdx) => (
                  <a
                    key={sIdx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{s.label}</span>
                    <ExternalLink size={10} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Write an Answer Form */}
        {showReplyForm && (
          <form
            onSubmit={handlePostAnswer}
            className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3 animate-fadeIn text-xs"
          >
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <CornerDownRight size={14} />
              <span>Contribute Your Answer to this Question</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-textSecondary block mb-1">
                Your Answer
              </label>
              <textarea
                rows={3}
                required
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Share your practical knowledge, explanation, or calculation..."
                className="w-full p-2.5 bg-white border border-border rounded-lg text-xs text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <input
                type="text"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                placeholder="Your Name (optional, defaults to Community Contributor)"
                className="w-full sm:w-2/3 p-2 bg-white border border-border rounded-lg text-xs text-textPrimary placeholder:text-textMuted"
              />
              <Button size="sm" variant="primary" type="submit" className="w-full sm:w-auto font-bold text-xs">
                Submit Answer
              </Button>
            </div>

            {replySuccess && (
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> Your answer has been added to the discussion!
              </p>
            )}
          </form>
        )}
      </div>

      {/* Footer: Tags & Helpful Button */}
      <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {thread.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200/60"
            >
              #{t}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors min-h-[32px] cursor-pointer ${
            hasVoted
              ? 'bg-primary-50 text-primary-700 border-primary-200'
              : 'bg-white hover:bg-slate-50 text-textSecondary border-border'
          }`}
        >
          <ThumbsUp size={12} aria-hidden="true" />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </Card>
  );
};
