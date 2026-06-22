"use client";

import { LoaderCircle, Save, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// PHP backend URL - Commented out for Render deployment
// const PHP_API_URL = "http://localhost:8000/api"

type LessonNotesProps = {
  lessonId: string;
};

export default function LessonNotes({ lessonId }: LessonNotesProps) {
  const { data: session, status } = useSession();
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && lessonId) {
      fetchNote();
    }
  }, [status, lessonId]);

  const fetchNote = async () => {
    setIsLoading(true);
    try {
      // PHP API call commented out for Render deployment
      /*
      const response = await fetch(`${PHP_API_URL}/notes?lessonId=${lessonId}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.note) {
        setNote(data.note.content)
        setNoteId(data.note.id)
      } else {
        setNote("")
        setNoteId(null)
      }
      */

      // Using Next.js API directly
      const response = await fetch(`/api/notes?lessonId=${lessonId}`);
      const data = await response.json();

      if (data.note) {
        setNote(data.note.content);
        setNoteId(data.note.id);
      } else {
        setNote("");
        setNoteId(null);
      }
    } catch (error) {
      console.error("API error:", error);
      setNote("");
      setNoteId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;

    setIsSaving(true);
    try {
      // PHP API call commented out for Render deployment
      /*
      const response = await fetch(`${PHP_API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          content: note,
          lessonId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save note")
      }

      const data = await response.json()
      setNoteId(data.note.id)
      toast.success("Note saved")
      */

      // Using Next.js API directly
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: note,
          lessonId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const data = await response.json();
      setNoteId(data.note.id);
      toast.success("Note saved");
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async () => {
    if (!noteId) return;

    setIsDeleting(true);
    try {
      // PHP API call commented out for Render deployment
      /*
      const response = await fetch(`${PHP_API_URL}/notes?id=${noteId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error("Failed to delete note")
      }

      setNote("")
      setNoteId(null)
      toast.success("Note deleted")
      */

      // Using Next.js API directly
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNote("");
      setNoteId(null);
      toast.success("Note deleted");
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col h-full mt-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Notes</h3>
        <div className="flex justify-center py-12 flex-1">
          <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col h-full mt-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Notes</h3>
        <div className="flex-1">
          <p className="text-center text-muted-foreground mt-8">
            Sign in to take notes for this lesson
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full mt-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Notes</h3>
      <div className="flex-1 flex flex-col mb-4">
        <Textarea
          placeholder="Take notes for this lesson..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 min-h-[300px] resize-y rounded-xl focus-visible:ring-primary/50"
        />
      </div>
      <div className="flex justify-between items-center mt-auto pb-4 gap-3">
        {noteId ? (
          <Button
            variant="outline"
            size="sm"
            onClick={deleteNote}
            disabled={isDeleting || isSaving}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {isDeleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
          </Button>
        ) : (
          <div />
        )}
        <Button
          size="sm"
          onClick={saveNote}
          disabled={!note.trim() || isSaving || isDeleting}
          className="flex-1 font-medium bg-primary/10 text-primary hover:bg-primary/20"
          variant="secondary"
        >
          {isSaving ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Note
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
