import { Button, TextArea, TextField } from "@radix-ui/themes";
import React from "react";

const NewIssuePage = () => {
  return (
    <div className="space-y-5">
      <span>NewIssuePage</span>
      <div className="max-w-xl space-y-3">
        <TextField.Root placeholder="Title">
          <TextField.Slot>
            {/* <MagnifyingGlassIcon height="16" width="16" /> */}
          </TextField.Slot>
        </TextField.Root>
        <TextArea placeholder="Description" />
        <Button>Submit New Issue</Button>
      </div>
    </div>
  );
};

export default NewIssuePage;
