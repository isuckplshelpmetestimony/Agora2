'use client';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// 1. Fetch all feedback (with optional filters)
export function useFeedbackList({ category, status, search }: { category?: string; status?: string; search?: string } = {}) {
  let url = '/api/feedback';
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if ([...params].length) url += `?${params.toString()}`;
  const { data, error, isLoading, mutate: refresh } = useSWR(url, fetcher);
  return { feedback: data, error, isLoading, refresh };
}

// 2. Fetch a single feedback item (with comments)
export function useFeedbackDetail(id?: string) {
  const { data, error, isLoading, mutate: refresh } = useSWR(id ? `/api/feedback/${id}` : null, fetcher);
  return { feedback: data, error, isLoading, refresh };
}

// 3. Create new feedback
export function useCreateFeedback() {
  return async (payload: { title: string; description: string; category: string; status: string; authorId: string }) => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create feedback');
    mutate('/api/feedback');
    return res.json();
  };
}

// 4. Upvote feedback
export function useUpvoteFeedback() {
  return async (feedbackId: string, userId: string) => {
    const res = await fetch(`/api/feedback/${feedbackId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to upvote');
    mutate('/api/feedback');
    mutate(`/api/feedback/${feedbackId}`);
    return res.json();
  };
}

// 5. Fetch and post anonymous comments
export function useFeedbackComments(feedbackId?: string) {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    feedbackId ? `/api/feedback/${feedbackId}/comments` : null,
    fetcher
  );
  // Post a new anonymous comment
  const postComment = async (content: string) => {
    const res = await fetch(`/api/feedback/${feedbackId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to post comment');
    refresh();
    mutate(`/api/feedback/${feedbackId}`); // refresh feedback detail
    return res.json();
  };
  return { comments: data, error, isLoading, refresh, postComment };
} 