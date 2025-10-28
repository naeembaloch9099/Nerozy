import React, { useState, useEffect } from "react";
import { getAnalytics } from "../Services/Api";
import { error as notifyError } from "../Utils/notify";

// Beautiful Card Component
function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Stat Card Component with Icon
function StatCard({ title, value, icon, color = "#1f6feb", trend }) {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
              margin: 0,
              marginBottom: 8,
            }}
          >
            {title}
          </p>
          <h2
            style={{ fontSize: 32, fontWeight: 800, margin: 0, color: "#111" }}
          >
            {value}
          </h2>
          {trend && (
            <p
              style={{
                color: trend > 0 ? "#10b981" : "#ef4444",
                fontSize: 13,
                margin: 0,
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last period
            </p>
          )}
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Filter Button Component
function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 10,
        border: "none",
        background: active
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "#f3f4f6",
        color: active ? "#fff" : "#6b7280",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: active ? "0 4px 12px rgba(102, 126, 234, 0.4)" : "none",
      }}
    >
      {children}
    </button>
  );
}

// Bar Chart Component
function BarChart({ data = [], title }) {
  const safeData = Array.isArray(data) ? data : [];
  const max = Math.max(...safeData.map((d) => Number(d.value) || 0), 1);

  return (
    <div>
      <h3
        style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700 }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          height: 220,
          padding: "0 10px",
        }}
      >
        {safeData.map((d, i) => {
          const pct = Math.max((Number(d.value) || 0) / max, 0);
          const heightPct = Math.max(pct * 100, 4);
          return (
            <div key={i} style={{ flex: 1, textAlign: "center", minWidth: 50 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: 180,
                }}
              >
                <div
                  title={`${d.label}: ${d.value}`}
                  style={{
                    width: "100%",
                    maxWidth: 60,
                    height: `${heightPct}%`,
                    background: `linear-gradient(180deg, #667eea, #764ba2)`,
                    borderRadius: "8px 8px 0 0",
                    boxShadow: "0 -4px 12px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "8px 0",
                  }}
                >
                  {heightPct > 15 && <span>{d.value}</span>}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 10,
                  color: "#6b7280",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Line Chart Component with Enhanced Styling
function LineChart({ data = [], title }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div>
        <h3
          style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700 }}
        >
          {title}
        </h3>
        <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
          No data available
        </div>
      </div>
    );
  }

  const w = 700;
  const h = 280;
  const margin = { top: 30, right: 40, bottom: 50, left: 60 };
  const innerW = w - margin.left - margin.right;
  const innerH = h - margin.top - margin.bottom;

  const values = data.map((d) => Number(d.value) || 0);
  const max = Math.max(...values, 1);
  const min = 0; // Always start from 0 for revenue

  const points = values.map((v, i) => {
    const x = margin.left + (i / (values.length - 1 || 1)) * innerW;
    const y = margin.top + (1 - (v - min) / (max - min || 1)) * innerH;
    return { x, y, v };
  });

  return (
    <div>
      <h3
        style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700 }}
      >
        {title}
      </h3>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#764ba2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
          </linearGradient>

          {/* Gradient for line */}
          <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 6 }).map((_, i) => {
          const gy = margin.top + (i / 5) * innerH;
          const valueLabel = Math.round((1 - i / 5) * (max - min) + min);
          return (
            <g key={i}>
              <line
                x1={margin.left}
                x2={w - margin.right}
                y1={gy}
                y2={gy}
                stroke={i === 5 ? "#cbd5e1" : "#e5e7eb"}
                strokeWidth={i === 5 ? 1.5 : 1}
                strokeDasharray={i === 5 ? "0" : "4 4"}
              />
              <text
                x={margin.left - 12}
                y={gy + 4}
                fontSize={11}
                fill="#6b7280"
                textAnchor="end"
                fontWeight={500}
              >
                {valueLabel > 0 ? valueLabel.toLocaleString() : 0}
              </text>
            </g>
          );
        })}

        {/* Area under curve */}
        {max > 0 && (
          <path
            d={`
              M ${points[0].x} ${h - margin.bottom}
              L ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}
              L ${points[points.length - 1].x} ${h - margin.bottom}
              Z
            `}
            fill="url(#areaGradient)"
          />
        )}

        {/* Main line */}
        {max > 0 && (
          <path
            d={`M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />
        )}

        {/* Data points with glow */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Outer glow */}
            <circle cx={p.x} cy={p.y} r={10} fill="#667eea" opacity={0.2} />
            <circle cx={p.x} cy={p.y} r={7} fill="#667eea" opacity={0.3} />
            {/* Main point */}
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill="#fff"
              stroke="#667eea"
              strokeWidth={3}
            />
            <circle cx={p.x} cy={p.y} r={2.5} fill="#667eea" />

            {/* Value label on hover - show for peaks */}
            {(i === 0 || i === points.length - 1 || p.v === max) && p.v > 0 && (
              <>
                <rect
                  x={p.x - 28}
                  y={p.y - 32}
                  width={56}
                  height={22}
                  rx={6}
                  fill="#667eea"
                  opacity={0.95}
                />
                <text
                  x={p.x}
                  y={p.y - 17}
                  fontSize={11}
                  fill="#fff"
                  textAnchor="middle"
                  fontWeight={700}
                >
                  {p.v.toLocaleString()}
                </text>
              </>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={h - 15}
            fontSize={10}
            fill="#6b7280"
            textAnchor="middle"
            fontWeight={600}
          >
            {data[i].label}
          </text>
        ))}

        {/* Axis titles */}
        <text
          x={margin.left / 2 - 10}
          y={h / 2}
          fontSize={12}
          fill="#9ca3af"
          fontWeight={600}
          transform={`rotate(-90, ${margin.left / 2 - 10}, ${h / 2})`}
        >
          Revenue (PKR)
        </text>
      </svg>
    </div>
  );
}

// Donut Chart Component
function DonutChart({ data = [], title }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div>
        <h3
          style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700 }}
        >
          {title}
        </h3>
        <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
          No data available
        </div>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
  let angle = -90;
  const cx = 100;
  const cy = 100;
  const r = 70;
  const innerR = 45;

  function donutPath(percent, startAngle) {
    const endAngle = startAngle + percent * 360;
    const large = endAngle - startAngle > 180 ? 1 : 0;

    const sx = cx + r * Math.cos((Math.PI * startAngle) / 180);
    const sy = cy + r * Math.sin((Math.PI * startAngle) / 180);
    const ex = cx + r * Math.cos((Math.PI * endAngle) / 180);
    const ey = cy + r * Math.sin((Math.PI * endAngle) / 180);

    const isx = cx + innerR * Math.cos((Math.PI * endAngle) / 180);
    const isy = cy + innerR * Math.sin((Math.PI * endAngle) / 180);
    const iex = cx + innerR * Math.cos((Math.PI * startAngle) / 180);
    const iey = cy + innerR * Math.sin((Math.PI * startAngle) / 180);

    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} L ${isx} ${isy} A ${innerR} ${innerR} 0 ${large} 0 ${iex} ${iey} Z`;
  }

  const colors = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
  ];

  return (
    <div>
      <h3
        style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700 }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          flexWrap: "wrap",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((d, i) => {
            const pct = (Number(d.value) || 0) / total;
            const path = donutPath(pct, angle);
            angle += pct * 360;
            return (
              <g key={i}>
                <path
                  d={path}
                  fill={colors[i % colors.length]}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ transition: "all 0.3s ease" }}
                />
              </g>
            );
          })}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            fontSize={24}
            fontWeight={800}
            fill="#111"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            fontSize={12}
            fill="#6b7280"
          >
            Total
          </text>
        </svg>

        <div style={{ flex: 1, minWidth: 150 }}>
          {data.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: colors[i % colors.length],
                  marginRight: 10,
                }}
              />
              <span style={{ fontSize: 14, color: "#374151", flex: 1 }}>
                {d.label}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30days");

  async function loadAnalytics() {
    try {
      setLoading(true);
      console.log("Fetching analytics for period:", period);
      const data = await getAnalytics(period);
      console.log("Analytics data received:", data);

      if (data && data.success) {
        setAnalytics(data.analytics);
        console.log("Analytics set successfully:", data.analytics);
      } else {
        console.error("Analytics response invalid:", data);
        notifyError("Failed to load analytics data");
        // Set empty analytics to show empty state instead of loading forever
        setAnalytics({
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          statusCounts: {},
          categoryData: {},
          salesByDate: {},
          topProducts: [],
        });
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
      notifyError("Failed to load analytics: " + err.message);
      // Set empty analytics on error
      setAnalytics({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        statusCounts: {},
        categoryData: {},
        salesByDate: {},
        topProducts: [],
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
            Loading Dashboard...
          </p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ fontSize: 18, color: "#6b7280" }}>
          No analytics data available
        </p>
      </div>
    );
  }

  // Prepare chart data
  const statusData =
    Object.entries(analytics.statusCounts || {}).length > 0
      ? Object.entries(analytics.statusCounts || {}).map(([status, count]) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
        }))
      : [
          { label: "Pending", value: 0 },
          { label: "Confirmed", value: 0 },
          { label: "Shipped", value: 0 },
          { label: "Delivered", value: 0 },
        ];

  const categoryData =
    Object.entries(analytics.categoryData || {}).length > 0
      ? Object.entries(analytics.categoryData || {}).map(
          ([category, count]) => ({
            label: category,
            value: count,
          })
        )
      : [{ label: "No Categories", value: 1 }];

  const salesByDateArray =
    Object.entries(analytics.salesByDate || {}).length > 0
      ? Object.entries(analytics.salesByDate || {})
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-30)
          .map(([date, data]) => ({
            label: new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            value: data.revenue,
          }))
      : Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            label: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            value: 0,
          };
        });

  const topProductsData =
    (analytics.topProducts || []).length > 0
      ? (analytics.topProducts || []).slice(0, 8).map((p) => ({
          label: p.name.split(" ").slice(0, 2).join(" "),
          value: p.quantity,
        }))
      : [{ label: "No Products", value: 0 }];

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: isMobile ? "20px 12px" : "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h1
            style={{
              fontSize: isMobile ? 24 : 36,
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              marginBottom: 10,
            }}
          >
            📊 Admin Dashboard
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: isMobile ? 14 : 16,
              margin: 0,
            }}
          >
            Track your business performance and insights
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? 6 : 10,
            marginBottom: 30,
            flexWrap: "wrap",
          }}
        >
          <FilterButton
            active={period === "7days"}
            onClick={() => setPeriod("7days")}
          >
            {isMobile ? "7d" : "Last 7 Days"}
          </FilterButton>
          <FilterButton
            active={period === "30days"}
            onClick={() => setPeriod("30days")}
          >
            {isMobile ? "30d" : "Last 30 Days"}
          </FilterButton>
          <FilterButton
            active={period === "90days"}
            onClick={() => setPeriod("90days")}
          >
            {isMobile ? "90d" : "Last 90 Days"}
          </FilterButton>
          <FilterButton
            active={period === "12months"}
            onClick={() => setPeriod("12months")}
          >
            {isMobile ? "12m" : "Last 12 Months"}
          </FilterButton>
          <FilterButton
            active={period === "all"}
            onClick={() => setPeriod("all")}
          >
            All Time
          </FilterButton>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: isMobile ? 12 : 20,
            marginBottom: isMobile ? 20 : 30,
          }}
        >
          <StatCard
            title="Total Revenue"
            value={`PKR ${(analytics.totalRevenue || 0).toLocaleString()}`}
            icon="💰"
            color="#10b981"
            trend={12}
          />
          <StatCard
            title="Total Orders"
            value={(analytics.totalOrders || 0).toLocaleString()}
            icon="📦"
            color="#667eea"
            trend={8}
          />
          <StatCard
            title="Average Order Value"
            value={`PKR ${Math.round(
              analytics.avgOrderValue || 0
            ).toLocaleString()}`}
            icon="📈"
            color="#f59e0b"
            trend={-3}
          />
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(450px, 1fr))",
            gap: isMobile ? 12 : 20,
            marginBottom: isMobile ? 12 : 20,
          }}
        >
          {/* Revenue Trend */}
          <Card>
            <LineChart data={salesByDateArray} title="Revenue Trend" />
            {analytics.totalOrders === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "#fef3c7",
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <p style={{ margin: 0, color: "#92400e", fontSize: 14 }}>
                  📊 No sales data yet. Create some orders to see the revenue
                  trend!
                </p>
              </div>
            )}
          </Card>

          {/* Order Status Distribution */}
          <Card>
            <DonutChart data={statusData} title="Order Status Distribution" />
            {analytics.totalOrders === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "#fef3c7",
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <p style={{ margin: 0, color: "#92400e", fontSize: 14 }}>
                  📦 No orders yet. Start taking orders to see the distribution!
                </p>
              </div>
            )}
          </Card>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(450px, 1fr))",
            gap: isMobile ? 12 : 20,
          }}
        >
          {/* Top Products */}
          <Card>
            <BarChart data={topProductsData} title="Top Selling Products" />
            {(analytics.topProducts || []).length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "#fef3c7",
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <p style={{ margin: 0, color: "#92400e", fontSize: 14 }}>
                  🏆 No product sales yet. Start selling to see top performers!
                </p>
              </div>
            )}
          </Card>

          {/* Category Distribution */}
          <Card>
            <BarChart data={categoryData} title="Category Distribution" />
            {Object.keys(analytics.categoryData || {}).length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "#fef3c7",
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <p style={{ margin: 0, color: "#92400e", fontSize: 14 }}>
                  🏷️ No category data yet. Add categories to your products!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
