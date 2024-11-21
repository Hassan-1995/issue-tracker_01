"use client";

import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();
  return (
    <div className="space-y-5">
      <span>NewIssuePage</span>
      <form
        className="max-w-xl space-y-3"
        onSubmit={handleSubmit(async (data) => {
          await axios.post("/api/issues", data);
          router.push("/issues");
        })}
      >
        <TextField.Root placeholder="Title" {...register("title")}>
          {/* <TextField.Slot > */}
          {/* <MagnifyingGlassIcon height="16" width="16" /> */}
          {/* </TextField.Slot> */}
        </TextField.Root>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <Button>Submit New Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
