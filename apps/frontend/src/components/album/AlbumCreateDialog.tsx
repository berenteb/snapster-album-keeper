import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAlbumMutation } from "@/hooks/use-albums";

const formSchema = z.object({
  name: z.string().min(1, "Album name is required").max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface AlbumCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AlbumCreateDialog({
  open,
  onOpenChange,
}: AlbumCreateDialogProps) {
  const createAlbum = useCreateAlbumMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createAlbum.mutateAsync(values.name);
      toast.success("Album created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create album:", error);
      toast.error("Failed to create album");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
          <DialogDescription>
            Give your album a name to help organize your photos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Summer Vacation 2023"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600"
                disabled={createAlbum.isPending}
              >
                {createAlbum.isPending ? "Creating..." : "Create Album"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
