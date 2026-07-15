import "./Dashboard.css";

function Dashboard({ history = [] }) {
  const total = history.length;

  const critical = history.filter(
    (h) => h.severity?.toLowerCase() === "critical"
  ).length;

  const high = history.filter(
    (h) => h.severity?.toLowerCase() === "high"
  ).length;

  const medium = history.filter(
    (h) => h.severity?.toLowerCase() === "medium"
  ).length;

  const low = history.filter(
    (h) => h.severity?.toLowerCase() === "low"
  ).length;

  const cards = [
    { title: "Total Logs", value: total },
    { title: "Critical", value: critical },
    { title: "High", value: high },
    { title: "Medium", value: medium },
    { title: "Low", value: low },
  ];

  return (
    <div className="dashboard">
      {cards.map((card) => (
        <div className="dashboard-card" key={card.title}>
          <h3>{card.title}</h3>
          <h1>{card.value}</h1>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;