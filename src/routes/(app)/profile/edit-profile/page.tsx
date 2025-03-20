import { ArrowLeft, Camera, LoaderIcon } from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authSchema } from "@/lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/components/auth-provider";
import { useConvex, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { useLiveUser } from "@/lib/hooks/useLiveUser";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const user = useLiveUser()
  const { updateAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const convex = useConvex();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: user.username,
      password: user.password,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    const file = files[0];
    setSelectedAvatar(file);
    const blob = new Blob([file], { type: file.type });
    e.target.src = URL.createObjectURL(blob);
    setTempAvatar(URL.createObjectURL(blob));
  };

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    setLoading(true);
    let newAvatar = user.avatar;
    if (selectedAvatar) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-type": selectedAvatar!.type,
        },
        body: selectedAvatar,
      }).then((res) => res.json());
      newAvatar = (await convex.query(api.users.getUrl, {
        storageId: result.storageId,
      })) as string;
    }
    await updateAuthUser({
      username: values.username,
      password: values.password,
      avatar: newAvatar,
    });
    toast.success("Profile updated sucessfully");
    setLoading(false);
  };

  return (
    <PageLayout className="fixed top-0 left-0 bg-background items-center">
      <div className="w-full max-w-2xl p-4 flex flex-col">
        <div className="w-full flex items-center gap-3">
          <button
            onClick={() => navigate(`/app/profile/${user._id}`)}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center gap-3 mt-12 mb-8">
          <div className="relative">
            <Avatar className="size-40 border-4 border-gray-700">
              <AvatarImage className="object-cover" src={tempAvatar} />
              <AvatarFallback className="text-3xl bg-gray-600">
                {user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-gray-900 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition">
              <Camera className="size-5 text-white" />
              <input
                onChange={handleInputChange}
                type="file"
                className="hidden"
              />
            </label>
          </div>
          <p className="text-gray-400 text-sm">Click to change avatar</p>
        </div>

        {/* Username Input */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 text-lg bg-gray-800 border border-gray-600 text-white rounded-3 px-4 focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 text-lg bg-gray-800 border border-gray-600 text-white rounded-3 px-4 focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 transition-all duration-200 shadow-lg">
              {loading ? <LoaderIcon className="animate-spin" /> : "Edit"}
            </Button>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default EditProfilePage;
