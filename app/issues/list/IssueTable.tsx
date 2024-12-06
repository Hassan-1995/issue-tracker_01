import React from "react";
import { Issue, Status } from "@prisma/client";
import { Table } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import { Link, IssueStatusBadge } from "@/app/components";

interface Props {
  columns: { label: string; value: keyof Issue; className?: string }[];
  issues: Issue[];
  orderBy?: keyof Issue;
  direction?: "asc" | "desc";
  resolvedParams: {
    status?: Status;
    orderBy?: keyof Issue;
    direction?: "asc" | "desc";
    page: string;
  };
}

const IssueTable: React.FC<Props> = ({
  columns,
  issues,
  orderBy,
  direction = "asc",
  resolvedParams,
}) => {
  return (
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
  );
};

export default IssueTable;
