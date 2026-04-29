"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load config
  const fetchConfig = async () => {
    const res = await fetch("http://localhost:5000/config");
    const json = await res.json();
    setConfig(json);
  };

  // Load data
  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/data");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchConfig();
    fetchData();
  }, []);

  // Handle input
  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit form
  const handleSubmit = async () => {
    setLoading(true);

    await fetch("http://localhost:5000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({});
    fetchData();
    setLoading(false);
  };

  if (!config) return <p>Loading config...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dynamic App Generator 🚀</h1>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <h2>Create {config.entity}</h2>

        {config.fields.map((field: any) => (
          <div key={field.name} style={{ marginBottom: 10 }}>
            <input
              placeholder={field.name}
              value={formData[field.name] || ""}
              onChange={(e) =>
                handleChange(field.name, e.target.value)
              }
              style={{
                padding: 10,
                width: 250,
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>

      {/* DATA */}
      <div>
        <h2>Saved Data</h2>

        {data.length === 0 && <p>No data yet</p>}

        {data.map((item: any) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              padding: 10,
              marginBottom: 10,
            }}
          >
            {Object.entries(item.data).map(([key, value]) => (
              <p key={key}>
                <b>{key}:</b> {String(value)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}