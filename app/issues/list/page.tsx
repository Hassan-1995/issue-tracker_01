import { IssueStatusBadge, Link } from "@/app/components";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import { Table } from "@radix-ui/themes";
import IssueActions from "./IssueActions";

interface Props {
  // searchParams: { status?: Status };
  searchParams: Promise<{ status?: Status }> | { status?: Status };
}

const IssuesPage = async ({ searchParams }: Props) => {
  // Check if searchParams is a Promise and wait for it to resolve
  let resolvedParams: { status?: Status };
  if (searchParams instanceof Promise) {
    // Await the promise to resolve the value
    resolvedParams = await searchParams;
  } else {
    // If it's already resolved, use it directly
    resolvedParams = searchParams;
  }
  console.log("From IssuePage (Resolved): ", resolvedParams);

  const statuses = Object.values(Status);

  const status = resolvedParams?.status;
  console.log("From IssuePage (Status): ", status);

  // Check if the status is valid or undefined
  const isValidStatus = status === undefined || statuses.includes(status);

  // If status is invalid, return an error message
  if (!isValidStatus) {
    return (
      <div>
        <p>Invalid status provided. Please provide a valid status.</p>
      </div>
    );
  }

  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
  });

  // console.log("From IssuePage (Raw): ", searchParams);
  // const status = searchParams.status;
  // console.log("From IssuePage (Status): ", status);
  // const issues = await prisma.issue.findMany({
  //   where: {
  //     status: searchParams.status,
  //     // status,
  //   },
  // });

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issues) => (
            <Table.Row key={issues.id}>
              <Table.Cell>
                <Link href={`/issues/${issues.id}`}>{issues.title}</Link>
                <div className="block md:hidden">
                  {" "}
                  <IssueStatusBadge status={issues.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issues.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issues.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

// export const dynamic = "force-dynamic";

export default IssuesPage;
