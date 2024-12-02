import { IssueStatusBadge, Link } from "@/app/components";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Table } from "@radix-ui/themes";
import IssueActions from "./IssueActions";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams:
    | Promise<{
        status?: Status;
        orderBy?: keyof Issue;
        direction?: "asc" | "desc";
      }>
    | { status?: Status; orderBy?: keyof Issue; direction?: "asc" | "desc" };
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  // Check if searchParams is a Promise and wait for it to resolve
  let resolvedParams: {
    status?: Status;
    orderBy?: keyof Issue;
    direction?: "asc" | "desc";
  };
  if (searchParams instanceof Promise) {
    resolvedParams = await searchParams;
  } else {
    resolvedParams = searchParams;
  }

  const statuses = Object.values(Status);
  const { status, orderBy, direction } = resolvedParams;

  // Validate the status
  const isValidStatus = status === undefined || statuses.includes(status);
  if (!isValidStatus) {
    return (
      <div>
        <p>Invalid status provided. Please provide a valid status.</p>
      </div>
    );
  }

  // Default sorting direction
  const sortDirection = direction || "asc";

  const issues = await prisma.issue.findMany({
    where: { status },
    orderBy: orderBy ? { [orderBy]: sortDirection } : undefined,
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
                isCurrentColumn && sortDirection === "asc" ? "desc" : "asc";

              return (
                <Table.ColumnHeaderCell key={column.value}>
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
                        (sortDirection === "asc" ? (
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
    </div>
  );
};

export default IssuesPage;
