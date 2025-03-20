import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { practiceCasualSchema } from "@/lib/validators";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useOutletContext } from "react-router";
import { OutletContext } from "../../_types";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const CasualGameSettings = () => {
  const { roomId, room } = useOutletContext<OutletContext>();
  const form = useForm({
    resolver: zodResolver(practiceCasualSchema),
    defaultValues: room.gameSettings.casual,
  });

  const { mutateAsync: saveSettings, isPending: isSavingSettings } =
    useMutation({
      mutationFn: useConvexMutation(api.rooms.updateCasualGameSettings),
    });

  const onSubmit = async (values: z.infer<typeof practiceCasualSchema>) => {
    await saveSettings({ roomId, patch: values });
    toast.success("Settings saved sucessfully", { duration: 2000 });
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-gray-400 text-base">Range</h2>
          <div className="flex flex-col gap-3 mt-1">
            <FormField
              control={form.control}
              name="range.from"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="From"
                      className="bg-gray-700"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="range.to"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="To"
                      className="bg-gray-700"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h2 className="text-gray-400 text-base">Quantity</h2>
          <div className="flex flex-col gap-3 mt-1">
            <FormField
              control={form.control}
              name="quantity.min"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="max"
                      className="bg-gray-700"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity.max"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Max"
                      className="bg-gray-700"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Time Interval */}
        <FormField
          control={form.control}
          name="timeInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400 text-base">
                Time Interval (ms)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Time Interval"
                  className="bg-gray-700"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timer */}
        <FormField
          control={form.control}
          name="timer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400 text-base">
                Timer (s)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Timer"
                  className="bg-gray-700"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Save Button */}
        <Button type="submit" className="w-full text-lg">
          {isSavingSettings ? (
            <Loader className="animate-spin" />
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CasualGameSettings;
