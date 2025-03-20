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
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import { practiceAnswerRushSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const CasualSettings = () => {
  const casualForm = useForm<z.infer<typeof practiceAnswerRushSchema>>({
    resolver: zodResolver(practiceAnswerRushSchema),
    defaultValues: {
      quantity: { min: 3, max: 7 },
      range: { from: 1, to: 10 },
      timer: 7,
    },
  });
  const init = useAnswerRushGameStore((store) => store.init);
  const navigate = useNavigate();
  const startCasualPractice = (
    values: z.infer<typeof practiceAnswerRushSchema>
  ) => {
    init(values);
    navigate("/app/practice/answer-rush");
  };
  return (
    <Form {...casualForm}>
      <form
        onSubmit={casualForm.handleSubmit(startCasualPractice)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-2">
          <FormLabel className="text-gray-400 text-base">Range</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={casualForm.control}
              name="range.from"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="From"
                      className="bg-gray-700"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={casualForm.control}
              name="range.to"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="To"
                      className="bg-gray-700"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <FormLabel className="text-gray-400 text-base">Quantity</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={casualForm.control}
              name="quantity.min"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Min"
                      className="bg-gray-700"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={casualForm.control}
              name="quantity.max"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Max"
                      className="bg-gray-700"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={casualForm.control}
          name="timer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400 text-base">
                Timer (seconds)
              </FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-8 text-lg">Start Practice</Button>
      </form>
    </Form>
  );
};

export default CasualSettings;
