import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";

interface Props {
  label: string;
  value: string | number | null | undefined;
  placeholder?: string;
  type?: "text" | "number";
  multiline?: boolean;
  readOnly?: boolean;
  onSave: (v: string) => void;
}

export function EditableField({ label, value, placeholder = "—", type = "text", multiline, readOnly, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  useEffect(() => { setDraft(String(value ?? "")); }, [value]);

  const display = value === null || value === undefined || value === "" || value === 0 ? null : String(value);

  if (editing && !readOnly) {
    const Common = multiline ? "textarea" : "input";
    return (
      <div className="space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="flex gap-1.5 items-start">
          <Common
            // @ts-expect-error union element
            type={type}
            value={draft}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value)}
            autoFocus
            rows={multiline ? 3 : undefined}
            className="flex-1 text-xs bg-surface border border-border rounded px-2 py-1.5 focus:outline-none focus:border-primary"
          />
          <button onClick={() => { onSave(draft); setEditing(false); }} className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20"><Check className="w-3 h-3" /></button>
          <button onClick={() => { setDraft(String(value ?? "")); setEditing(false); }} className="p-1.5 rounded text-muted-foreground hover:bg-foreground/5"><X className="w-3 h-3" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-start gap-2">
        <div className={`text-xs flex-1 ${display ? "" : "text-muted-foreground italic"}`}>{display ?? placeholder}</div>
        {!readOnly && (
          <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-foreground/5 text-muted-foreground"><Pencil className="w-3 h-3" /></button>
        )}
      </div>
    </div>
  );
}

interface ListProps {
  label: string;
  values: string[];
  placeholder?: string;
  readOnly?: boolean;
  bullet?: string;
  toneClass?: string;
  onSave: (v: string[]) => void;
}

export function EditableList({ label, values, placeholder = "Add item…", readOnly, bullet = "→", toneClass = "text-foreground", onSave }: ListProps) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      {values.length === 0 && <div className="text-xs text-muted-foreground italic mb-2">No entries yet.</div>}
      <ul className="space-y-1.5">
        {values.map((v, i) => (
          <li key={i} className="text-xs leading-relaxed flex items-start gap-2 group">
            <span className={`${toneClass} shrink-0`}>{bullet}</span>
            <span className="flex-1">{v}</span>
            {!readOnly && (
              <button
                onClick={() => onSave(values.filter((_, j) => j !== i))}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                aria-label="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {!readOnly && (
        <div className="mt-2 flex gap-1.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                onSave([...values, draft.trim()]);
                setDraft("");
              }
            }}
            placeholder={placeholder}
            className="flex-1 text-xs bg-surface border border-border rounded px-2 py-1 focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
}
