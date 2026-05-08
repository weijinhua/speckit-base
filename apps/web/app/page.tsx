import { AppLayout, Button, Card, CardContent, CardHeader, CardTitle, FormPattern, Input, SplitLayout } from "@speckit/ui";

function Sidebar() {
  return (
    <nav aria-label="Demo navigation">
      <p>Workspace</p>
      <p>Demo shell</p>
      <Button variant="secondary">Overview</Button>
      <Button variant="ghost">Components</Button>
      <Button variant="ghost">Patterns</Button>
    </nav>
  );
}

function EmptyStateCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nothing to render yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This area is intentionally empty so the scaffold can prove layout composition.</p>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  return (
    <AppLayout sidebar={<Sidebar />}>
      <SplitLayout
        direction="horizontal"
        ratio={[2, 1]}
        first={
          <FormPattern
            title="Demo form"
            description="This form shows how the design system handles labeled controls without page-level styling."
            actions={<Button>Save draft</Button>}
          >
            <label>
              <span>Project name</span>
              <Input placeholder="Enter a name" />
            </label>
            <label>
              <span>Notes</span>
              <Input placeholder="Optional note" />
            </label>
          </FormPattern>
        }
        second={
          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
            </CardHeader>
            <CardContent>
              <Button disabled>Loading...</Button>
              <EmptyStateCard />
            </CardContent>
          </Card>
        }
      />
    </AppLayout>
  );
}
