import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetPost } from "@/lib/admin.functions";
import { BlogForm, emptyPost, type PostFormValues } from "@/components/admin/BlogForm";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/admin/blog/$id")({
  component: EditPost,
});

function toForm(row: Record<string, unknown>): PostFormValues {
  const r = row as Record<string, unknown>;
  const pubAt = r.published_at as string | undefined;
  return {
    ...emptyPost,
    slug: (r.slug as string) ?? "",
    title: (r.title as string) ?? "",
    description: (r.description as string) ?? "",
    category: (r.category as string) ?? "",
    cover_image: (r.cover_image as string) ?? null,
    content: (r.content as string) ?? "",
    read_time: (r.read_time as string) ?? "",
    published: (r.published as boolean) ?? true,
    published_at: pubAt ? pubAt.slice(0, 10) : emptyPost.published_at,
  };
}

function EditPost() {
  const { id } = Route.useParams();
  const getFn = useServerFn(adminGetPost);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "post", id],
    queryFn: () => getFn({ data: { id } }),
  });

  return (
    <div className="space-y-4">
      <Link to="/admin/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Back to posts
      </Link>
      <h1 className="text-2xl font-semibold">Edit post</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Not found.</p>
      ) : (
        <BlogForm id={id} initial={toForm(data as Record<string, unknown>)} />
      )}
    </div>
  );
}
