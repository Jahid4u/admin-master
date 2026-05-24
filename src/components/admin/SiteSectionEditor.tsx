import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetAllSettings, adminUpdateSetting } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

type Props<T> = {
  title: string;
  description: string;
  settingKey: "hero" | "about" | "contact" | "social";
  defaults: T;
  render: (value: T, setValue: (v: T) => void) => ReactNode;
};

export function SiteSectionEditor<T extends object>({
  title,
  description,
  settingKey,
  defaults,
  render,
}: Props<T>) {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.[settingKey] as object | undefined) ?? {}) } as T;
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    setValue(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: settingKey, value } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMut.mutate();
        }}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>Only the fields for this section. Other sections are managed separately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              render(value, setValue)
            )}
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={saveMut.isPending || isLoading}>
            {saveMut.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
