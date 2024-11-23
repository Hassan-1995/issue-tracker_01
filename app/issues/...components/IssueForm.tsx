"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { createIssueSchema } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueFormData = z.infer<typeof createIssueSchema>;

interface Props {
  issue?: Issue;
}

const IssueForm = ({ issue }: Props) => {
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(createIssueSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error has occured.");
    }
  });

  return (
    <div className="space-y-5">
      <span>IssueForm</span>
      <div className="max-w-xl">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <form className="space-y-3" onSubmit={onSubmit}>
          <TextField.Root
            placeholder="Title"
            {...register("title")}
            defaultValue={issue?.title}
          >
            {/* <TextField.Slot > */}
            {/* <MagnifyingGlassIcon height="16" width="16" /> */}
            {/* </TextField.Slot> */}
          </TextField.Root>

          <ErrorMessage>{errors.title?.message}</ErrorMessage>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
            defaultValue={issue?.description}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>

          <Button disabled={isSubmitting}>
            Submit New Issue {isSubmitting && <Spinner />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;
