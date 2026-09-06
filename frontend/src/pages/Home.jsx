import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";

const CONCEPTS = [
  { title: "Users", text: "Create, list, update, and delete people. Each user can enroll in courses." },
  { title: "Courses", text: "A second resource so you can show full CRUD and a join table." },
  { title: "Authentication", text: "Register and login issue a JWT. Protected routes require that token." },
  { title: "API requests", text: "The UI never queries PostgreSQL. It only calls /api/... endpoints." },
  { title: "Backend routes", text: "Express routes map URLs to middleware and controllers." },
  { title: "CRUD operations", text: "GET, POST, PUT, and DELETE are used consistently for both resources." },
];

export function Home({ onNavigate }) {
  return (
    <div className="stack">
      <PageHeader
        eyebrow="Educational full-stack example"
        title="React → Express → PostgreSQL"
        description="A small Users & Courses app you can use to explain how a request travels through routes, middleware, controllers, services, models, and the database."
      />

      <Card>
        <ol className="flow-strip" aria-label="Request path">
          <li>React</li>
          <li>API</li>
          <li>Routes</li>
          <li>Middleware</li>
          <li>Controller</li>
          <li>Service</li>
          <li>Model</li>
          <li>PostgreSQL</li>
        </ol>
      </Card>

      <div className="grid-3">
        {CONCEPTS.map((item) => (
          <Card key={item.title} title={item.title}>
            <p className="muted">{item.text}</p>
          </Card>
        ))}
      </div>

      <Card title="Try the live examples" subtitle="Each page is a working feature and a teaching prop.">
        <div className="btn-row">
          <Button onClick={() => onNavigate("users")}>Register a user</Button>
          <Button variant="secondary" onClick={() => onNavigate("courses")}>
            Manage courses
          </Button>
          <Button variant="ghost" onClick={() => onNavigate("architecture")}>
            See the architecture
          </Button>
        </div>
      </Card>
    </div>
  );
}
