import { useState } from "react";
import { apiRoutes } from "../data/apiRoutes";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";

export function ApiExplorer() {
  const [selectedId, setSelectedId] = useState(apiRoutes[0].id);
  const selected = apiRoutes.find((route) => route.id === selectedId);

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Interactive documentation"
        title="API Explorer"
        description="Every route the backend exposes. Click a row to see the controller, middleware, service, model, and example payloads."
      />

      <Card title="Routes" subtitle="Click a route to inspect its path through the backend">
        <div className="table-wrap">
          <table className="clickable">
            <thead>
              <tr>
                <th>Method</th>
                <th>Route</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {apiRoutes.map((route) => (
                <tr
                  key={route.id}
                  className={selectedId === route.id ? "selected" : ""}
                  onClick={() => setSelectedId(route.id)}
                >
                  <td>
                    <Badge method={route.method}>{route.method}</Badge>
                  </td>
                  <td>
                    <code>{route.path}</code>
                  </td>
                  <td>{route.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected ? (
        <Card
          title={`${selected.method} ${selected.path}`}
          subtitle={selected.purpose}
        >
          <dl className="detail-list">
            <div>
              <dt>HTTP method</dt>
              <dd>
                <Badge method={selected.method}>{selected.method}</Badge>
              </dd>
            </div>
            <div>
              <dt>Endpoint</dt>
              <dd>
                <code>{selected.path}</code>
              </dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{selected.description}</dd>
            </div>
            <div>
              <dt>Controller</dt>
              <dd>
                <code>{selected.controller}</code>
              </dd>
            </div>
            <div>
              <dt>Middleware used</dt>
              <dd>
                <code>{selected.middleware.join(" → ")}</code>
              </dd>
            </div>
            <div>
              <dt>Service used</dt>
              <dd>
                <code>{selected.service}</code>
              </dd>
            </div>
            <div>
              <dt>Model / database operation</dt>
              <dd>
                <code>{selected.model}</code>
              </dd>
            </div>
            <div>
              <dt>Authentication</dt>
              <dd>{selected.authRequired ? "Required (Bearer JWT)" : "Public"}</dd>
            </div>
            <div>
              <dt>Expected request body</dt>
              <dd>
                {selected.requestBody ? (
                  <pre>{JSON.stringify(selected.requestBody, null, 2)}</pre>
                ) : (
                  <span className="muted">None</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Expected response</dt>
              <dd>
                <pre>{JSON.stringify(selected.response, null, 2)}</pre>
              </dd>
            </div>
          </dl>
        </Card>
      ) : null}
    </div>
  );
}
