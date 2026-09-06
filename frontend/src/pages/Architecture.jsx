import { useState } from "react";
import { layers, requestFlow } from "../data/architecture";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";

export function Architecture() {
  const [selectedId, setSelectedId] = useState("routes");
  const selected = layers.find((layer) => layer.id === selectedId);

  return (
    <div className="stack">
      <PageHeader
        eyebrow="How the backend works"
        title="Backend architecture"
        description="Click a layer to see what it is responsible for, where the files live, and how it connects to the next step."
      />

      <Card>
        <ol className="arch-flow">
          {layers.map((layer, index) => (
            <li key={layer.id}>
              <button
                type="button"
                className={selectedId === layer.id ? "arch-node active" : "arch-node"}
                onClick={() => setSelectedId(layer.id)}
              >
                <strong>{layer.title}</strong>
                <span>{layer.short}</span>
              </button>
              {index < layers.length - 1 ? <span className="arch-arrow" aria-hidden="true">↓</span> : null}
            </li>
          ))}
        </ol>
      </Card>

      <div className="layer-grid">
        {layers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            className={selectedId === layer.id ? "layer-card active" : "layer-card"}
            onClick={() => setSelectedId(layer.id)}
          >
            {layer.title}
          </button>
        ))}
      </div>

      {selected ? (
        <Card title={selected.title} subtitle={selected.connection}>
          <dl className="detail-list">
            <div>
              <dt>Purpose</dt>
              <dd>{selected.purpose}</dd>
            </div>
            <div>
              <dt>File location</dt>
              <dd>
                <code>{selected.location}</code>
              </dd>
            </div>
            <div>
              <dt>Example file</dt>
              <dd>
                <code>{selected.exampleFile}</code>
              </dd>
            </div>
            <div>
              <dt>Examples</dt>
              <dd>
                <ul className="plain-list">
                  {selected.examples.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Card>
      ) : null}

      <Card
        title="Example: POST /api/courses"
        subtitle="One request walking through every layer"
      >
        <ol className="timeline">
          {requestFlow.map((step, index) => (
            <li key={step.label}>
              <span className="step-index">{index + 1}</span>
              <div>
                <strong>{step.label}</strong>
                <p className="muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
