import { issueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

// export function PATCH(request: NextRequest){

// }

// syntax of PUT and PATCH is almost same

export async function PUT(request: NextRequest, { params: { id } }: Props) {
  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(updatedIssue, { status: 201 });
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue) {
    return NextResponse.json({ error: "Invalid issue." }, { status: 404 });
  }

  const deletedIssue = await prisma.issue.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json(deletedIssue);
}
