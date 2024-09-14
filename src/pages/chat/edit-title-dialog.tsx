import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import { renameThread } from "@/data/threads";
import { useRevalidator } from "react-router-dom";

export interface EditTitleDialogProps {
  title: string;
  threadId: string;
}

export function EditTitleDialog({ title, threadId }: EditTitleDialogProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { revalidate } = useRevalidator();
  const handleSaveTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    if (editedTitle.trim() === "") return; // 空のタイトルを防ぐ
    await renameThread(threadId, editedTitle).finally(() => {
      setIsEditingTitle(false);
    });
    revalidate();
  };

  return (
    <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
      <DialogTrigger className="focus:outline-none">
        <Pencil size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveTitle}>
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="New title"
            autoFocus
          />
          <button
            type="submit"
            className="hidden"
            id="edit-title-button"
          ></button>
        </form>
        <DialogFooter>
          <Button
            onClick={() =>
              document.getElementById("edit-title-button")?.click()
            }
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
