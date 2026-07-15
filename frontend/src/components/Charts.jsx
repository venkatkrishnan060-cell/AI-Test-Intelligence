import "./Charts.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#22c55e",
];

function Charts({ history = [] }) {
 const severityData = [
  {
    name: "Critical",
    value: history.filter(
      h => h.severity?.toLowerCase() === "critical"
    ).length,
  },
  {
    name: "High",
    value: history.filter(
      h => h.severity?.toLowerCase() === "high"
    ).length,
  },
  {
    name: "Medium",
    value: history.filter(
      h => h.severity?.toLowerCase() === "medium"
    ).length,
  },
  {
    name: "Low",
    value: history.filter(
      h => h.severity?.toLowerCase() === "low"
    ).length,
  },
].filter(item => item.value > 0);

  const categoryMap = {};

  history.forEach((item) => {
    const category = item.data?.failureCategory || "Unknown";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });
const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
  name:
    name.length > 18
      ? name.substring(0, 18) + "..."
      : name,
  value,
}));

  return (
  <div className="charts-grid">

    {/* Severity Pie Chart */}
    <div className="card">
      <h2>📊 Severity Distribution</h2>

      {categoryData.length > 0 ? (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={categoryData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        angle={-20}
        textAnchor="end"
        interval={0}
        height={60}
      />
      <YAxis />
      <Tooltip />
      <Bar
        dataKey="value"
        fill="#3b82f6"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
) : (
  <div className="empty-chart">
    📈 Failure category analytics will appear here after log analysis.
  </div>
)}
    </div>

    {/* Failure Category Bar Chart */}
    <div className="card">
      <h2>📈 Failure Categories</h2>

      {severityData.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={severityData}
              dataKey="value"
              outerRadius={75}
              label
            >
              {severityData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-chart">
          📊 Analyze a test log to visualize severity distribution.
        </div>
      )}
    </div>

  </div>
);
}

export default Charts;