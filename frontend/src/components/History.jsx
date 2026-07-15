function History({
  history,
  setResult,
  search,
  setSearch,
}) {
  return (
    <div className="card">
      <h2>🕒 Analysis History</h2>

      <input
  type="text"
  placeholder="🔍 Search Jira Title..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    margin: "15px 0",
    borderRadius: "8px",
    border: "1px solid #444",
  }}
/>

      {history.length === 0 ? (
        <p>No previous analyses.</p>
      ) : (
                history
        .filter((item) =>
            item.title
            ?.toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((item) => (
          <div
            key={item.id}
            className="analysis-item"
            style={{
              cursor: "pointer",
              marginBottom: "15px",
            }}
            onClick={() => setResult(item.data)}
          >
            <h3>{item.title}</h3>

            <p>
              <strong>{item.severity}</strong>
            </p>

            <small>{item.date}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default History;