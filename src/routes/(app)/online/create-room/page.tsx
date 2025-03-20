import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import PageLayout from "@/components/page-layout";
import { useMutation } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";

// Define Zod schema
const createRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  memberCount: z
    .number()
    .min(2, "Minimum of 2 players required")
    .max(10, "Maximum of 10 players allowed"),
});

const CreateRoomPage = () => {
  const form = useForm({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      memberCount: 2,
    },
  });
  const convex = useConvex();
  const user = useLiveUser();
  const navigate = useNavigate();

  const { mutateAsync: createRoom, isPending: isRoomCreating } = useMutation({
    mutationFn: async (values: z.infer<typeof createRoomSchema>) => {
      const roomId = await convex.mutation(api.rooms.createRoom, {
        ...values,
        ownerId: user._id,
        isPublic: true,
      });
      await convex.mutation(api.rooms.joinRoom, { roomId, userId: user._id });
      navigate(`/app/online/room/${roomId}`);
    },
  });

  const onSubmit = async (values: z.infer<typeof createRoomSchema>) => {
    await createRoom(values);
  };

  return (
    <PageLayout>
      <PageHeader title="Create Room" returnTo="/app/online" />

      <div className="p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Room Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memberCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Number of Members
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2}
                      max={10}
                      className="text-base"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-400 mt-1">
                    Maximum of 10 players
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isRoomCreating}
              type="submit"
              className="w-full text-lg"
            >
              {isRoomCreating ? (
                <Loader className="animate-spin" />
              ) : (
                "Create Room"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default CreateRoomPage;
