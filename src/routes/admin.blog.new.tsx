import { createFileRoute, Link } from "@tanstack/react-router";
import { BlogForm, emptyPost } from "@/components/admin/BlogForm";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/admin/blog/new")({
  component: NewPost,
});

function NewPost() {
  return (
    <div className="space-y-4">
      <Link to="/admin/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Back to posts
      </Link>
      <h1 className="text-2xl font-semibold">New post</h1>
      <BlogForm initial={emptyPost} />
    </div>
  );
}
