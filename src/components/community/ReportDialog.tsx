import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, Flag } from 'lucide-react';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onClose,
  postId,
}) => {
  const { dispatch } = useApp();
  const [reason, setReason] = useState<string>('misleading');
  const [note, setNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'REPORT_POST', payload: postId });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Flag size={18} className="text-loss" />
          <span>Report Community Content</span>
        </span>
      }
    >
      {isSubmitted ? (
        <div className="py-6 text-center space-y-2">
          <div className="w-12 h-12 bg-gain-soft text-gain rounded-full mx-auto flex items-center justify-center">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h3 className="font-bold text-base text-textPrimary">Report Recorded (Simulated)</h3>
          <p className="text-xs text-textMuted">
            Thank you for helping preserve educational safety. This post has been flagged in your session.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <p className="text-textSecondary leading-relaxed">
            Please specify why this content breaches community standards. In this prototype study, reports are recorded locally.
          </p>

          <div className="space-y-2">
            {[
              { id: 'misleading', label: 'Misleading claim, price tip, or promised return' },
              { id: 'sponsorship', label: 'Undisclosed sponsorship or commercial conflict' },
              { id: 'personal_info', label: 'Contains personal phone, email, or financial amounts' },
              { id: 'abusive', label: 'Harassment, abusive language, or spam solicitation' },
              { id: 'other', label: 'Other violation' },
            ].map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-bgSurface cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={opt.id}
                  checked={reason === opt.id}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-textPrimary font-medium">{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1">
            <label htmlFor="report-notes" className="font-semibold text-textSecondary block">
              Additional Details (Optional):
            </label>
            <textarea
              id="report-notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain why this content violates community guidelines..."
              rows={3}
              className="w-full p-2.5 rounded-xl border border-border text-xs focus-visible:outline-2 focus-visible:outline-primary-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Submit Report (Simulated)
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
