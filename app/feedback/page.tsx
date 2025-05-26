'use client';

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ThumbsUp } from "lucide-react"
import { useSimpleFeedbackComments, createSimpleFeedbackComment, likeSimpleFeedbackComment } from '@/lib/feedback-hooks'
import { useState } from 'react'

// Dummy user list for selection (replace with real user list in production)
const users = [
  { id: 'cmb3zia8x0000p1ef6em1utbs', name: 'Jane Doe', image: null },
  { id: 'cmb50utof0001p1bfoowpvwsd', name: 'John Smith', image: null },
];

export default function FeedbackForum() {
  const { comments, isLoading, error, refresh } = useSimpleFeedbackComments();
  const [aboutUserId, setAboutUserId] = useState(users[0]?.id || '');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likeSubmitting, setLikeSubmitting] = useState<string | null>(null);
  const [userId] = useState(users[0]?.id || ''); // Simulate current user as Jane Doe

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await createSimpleFeedbackComment({ content, aboutUserId });
      setContent('');
      refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    setLikeSubmitting(commentId);
    try {
      await likeSimpleFeedbackComment({ commentId, userId });
      refresh();
    } catch {}
    setLikeSubmitting(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Feedback Forum</h1>
            <p className="text-muted-foreground">Leave an anonymous sticky note for your teammates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-8 flex flex-col md:flex-row gap-2 items-center">
          <select
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={aboutUserId}
            onChange={e => setAboutUserId(e.target.value)}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <Input
            className="flex-1"
            placeholder="Write something nice..."
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={200}
            disabled={submitting}
          />
          <Button type="submit" disabled={submitting || !content.trim()}>
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </form>

        <div className="space-y-4">
          {isLoading && <div>Loading...</div>}
          {error && <div className="text-red-500">Failed to load feedback.</div>}
          {comments && comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No feedback found.</div>
          )}
          {comments && comments.map((item: any) => (
            <Card key={item.id} className="border-none shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.aboutUser?.image || "/placeholder-user.jpg"} alt={item.aboutUser?.name || 'User'} />
                  <AvatarFallback className="bg-amber-100 text-amber-800 text-xs">
                    {item.aboutUser?.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-amber-900">{item.aboutUser?.name || 'User'}</span>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">{item.content}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleLike(item.id)}
                  disabled={likeSubmitting === item.id}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {item.likeCount}
                </Button>
                <span className="text-xs text-muted-foreground ml-2">Expires {new Date(item.expiresAt).toLocaleDateString()}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
