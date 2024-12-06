import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams:
    | Promise<{
        status?: Status;
        orderBy?: keyof Issue;
        direction?: "asc" | "desc";
        page: string;
      }>
    | {
        status?: Status;
        orderBy?: keyof Issue;
        direction?: "asc" | "desc";
        page: string;
      };
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  let resolvedParams: {
    status?: Status;
    orderBy?: keyof Issue;
    direction?: "asc" | "desc";
    page: string;
  };

  if (searchParams instanceof Promise) {
    resolvedParams = await searchParams;
  } else {
    resolvedParams = searchParams;
  }

  const statuses = Object.values(Status);
  const { status, orderBy, direction, page } = resolvedParams;

  // Validate the status
  const isValidStatus = status === undefined || statuses.includes(status);
  if (!isValidStatus) {
    return (
      <div>
        <p>Invalid status provided. Please provide a valid status.</p>
      </div>
    );
  }

  const pageSize = 10;
  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * pageSize;

  const totalCount = await prisma.issue.count({
    where: { status },
  });

  const issues = await prisma.issue.findMany({
    where: { status },
    orderBy: orderBy ? { [orderBy]: direction || "asc" } : undefined,
    skip,
    take: pageSize,
  });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable
        columns={columns}
        issues={issues}
        orderBy={orderBy}
        direction={direction}
        resolvedParams={resolvedParams}
      />
      <Pagination
        itemCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </Flex>
  );
};

export default IssuesPage;

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues.",
};
