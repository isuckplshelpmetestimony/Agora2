-- CreateTable
CREATE TABLE "FeedbackCommentSimple" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aboutUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FeedbackCommentSimple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackCommentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FeedbackCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackCommentLike_commentId_userId_key" ON "FeedbackCommentLike"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "FeedbackCommentSimple" ADD CONSTRAINT "FeedbackCommentSimple_aboutUserId_fkey" FOREIGN KEY ("aboutUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackCommentLike" ADD CONSTRAINT "FeedbackCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "FeedbackCommentSimple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackCommentLike" ADD CONSTRAINT "FeedbackCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
