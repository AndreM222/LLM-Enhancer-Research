'use client';

import { useState } from 'react';
import { Bug, Lightbulb, MessageSquare, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FeedbackType = 'general' | 'bug' | 'feature' | 'positive' | 'negative';

type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string;
};

const feedbackTypes: {
  value: FeedbackType;
  label: string;
  icon: typeof MessageSquare;
}[] = [
    {
      value: 'general',
      label: 'General feedback',
      icon: MessageSquare,
    },
    {
      value: 'bug',
      label: 'Report a bug',
      icon: Bug,
    },
    {
      value: 'feature',
      label: 'Suggest an improvement',
      icon: Lightbulb,
    },
    {
      value: 'positive',
      label: 'Something worked well',
      icon: ThumbsUp,
    },
    {
      value: 'negative',
      label: 'Something went wrong',
      icon: ThumbsDown,
    },
  ];

export function FeedbackDialog({ open, onOpenChange, context }: FeedbackDialogProps) {
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setType('general');
    setMessage('');
    setRating(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter your feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedback = {
        type,
        message: message.trim(),
        rating,
        context,
        createdAt: new Date().toISOString(),
      };

      console.log('Feedback submitted:', feedback);

      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Thank you for your feedback.');

      handleOpenChange(false);
    } catch {
      toast.error('Could not submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Share your feedback</DialogTitle>

            <DialogDescription>
              Tell us what you think. Your feedback helps us improve the experience.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div className="grid gap-2">
              <Label htmlFor="feedback-type">What would you like to share?</Label>

              <Select value={type} onValueChange={(value) => setType(value as FeedbackType)}>
                <SelectTrigger id="feedback-type">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {feedbackTypes.map((item) => {
                    const Icon = item.icon;

                    return (
                      <SelectItem key={item.value} value={item.value}>
                        <span className="flex items-center gap-2">
                          <Icon className="size-4 text-muted-foreground" />
                          {item.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>How was your experience?</Label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={rating === value ? 'default' : 'outline'}
                    size="icon"
                    aria-label={`${value} out of 5`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    className="transition-colors"
                  >
                    {value}
                  </Button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">Optional</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="feedback-message">Feedback</Label>

              <Textarea
                id="feedback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us what happened or what we could improve..."
                className="min-h-32 resize-none"
                maxLength={1000}
                autoFocus
              />

              <div className="flex justify-end text-xs text-muted-foreground">
                {message.length}/1000
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!message.trim() || isSubmitting}>
              <Send className="mr-2 size-4" />
              {isSubmitting ? 'Sending...' : 'Send feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
