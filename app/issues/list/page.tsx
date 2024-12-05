import { IssueStatusBadge, Link } from "@/app/components";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Table } from "@radix-ui/themes";
import IssueActions from "./IssueActions";

import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/components/Pagination";

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

  //

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

  //

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

  const pageSize = 10; // Max issues per page
  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * pageSize;

  // Fetch total issue count
  const totalCount = await prisma.issue.count({
    where: { status },
  });

  // Fetch issues with pagination
  const issues = await prisma.issue.findMany({
    where: { status },
    orderBy: orderBy ? { [orderBy]: direction || "asc" } : undefined,
    skip,
    take: pageSize,
  });

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => {
              const isCurrentColumn = column.value === orderBy;
              const nextDirection =
                isCurrentColumn && direction === "asc" ? "desc" : "asc";

              return (
                <Table.ColumnHeaderCell
                  key={column.value}
                  className={column.className}
                >
                  <NextLink
                    href={{
                      query: {
                        ...resolvedParams,
                        orderBy: column.value,
                        direction: nextDirection,
                      },
                    }}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {isCurrentColumn &&
                        (direction === "asc" ? (
                          <ArrowUpIcon className="ml-1" />
                        ) : (
                          <ArrowDownIcon className="ml-1" />
                        ))}
                    </div>
                  </NextLink>
                </Table.ColumnHeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      <Pagination
        itemCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  );
};

export default IssuesPage;
