import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllOrders, updateOrderStatus } from "../Services/Api";
import { success, error } from "../Utils/notify";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiBox,
  FiXCircle,
  FiEye,
  FiChevronDown,
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";

/* ---------------- Styled Components ---------------- */
const Container = styled.div`
  padding: 24px;
  font-family: "Inter", sans-serif;
  color: #1e1e1e;
  background: #f6f7fb;
  min-height: 100vh;

  @media (max-width: 820px) {
    padding: 16px;
  }

  @media (max-width: 639px) {
    padding: 12px;
  }
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
  padding: 20px;
  animation: fadeIn 0.4s ease-in-out;

  @media (max-width: 639px) {
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 16px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;

  @media (max-width: 1023px) {
    min-width: 100%;
    display: block;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  border-bottom: none;
  border-top-left-radius: ${(props) => (props.first ? "12px" : "0")};
  border-top-right-radius: ${(props) => (props.last ? "12px" : "0")};

  @media (max-width: 639px) {
    padding: 10px 8px;
    font-size: 13px;
    display: ${(props) => (props.hideOnMobile ? "none" : "table-cell")};
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 12px;
    font-size: 14px;
    display: ${(props) => (props.hideOnTablet ? "none" : "table-cell")};
  }
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
  background: #fff;
  transition: background 0.3s;
  &:hover {
    background: #fafafa;
  }

  @media (max-width: 639px) {
    padding: 10px 8px;
    font-size: 13px;
    display: ${(props) => (props.hideOnMobile ? "none" : "table-cell")};
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 12px;
    font-size: 14px;
    display: ${(props) => (props.hideOnTablet ? "none" : "table-cell")};
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ status }) =>
    status === "pending"
      ? "linear-gradient(135deg, #FFF4E5, #FFEAA7)"
      : status === "confirmed"
      ? "linear-gradient(135deg, #E5F9EE, #A8E6CF)"
      : status === "shipped"
      ? "linear-gradient(135deg, #E5F1FF, #74B9FF)"
      : status === "delivered"
      ? "linear-gradient(135deg, #DFFBE5, #55A3FF)"
      : "linear-gradient(135deg, #FDECEA, #FF7675)"};
  color: ${({ status }) =>
    status === "pending"
      ? "#B7791F"
      : status === "confirmed"
      ? "#00B894"
      : status === "shipped"
      ? "#0984E3"
      : status === "delivered"
      ? "#00A085"
      : "#E17055"};
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.85rem;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid
    ${({ status }) =>
      status === "pending"
        ? "#F39C12"
        : status === "confirmed"
        ? "#00B894"
        : status === "shipped"
        ? "#0984E3"
        : status === "delivered"
        ? "#00A085"
        : "#E17055"};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 639px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    gap: 4px;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 160px;

  @media (max-width: 639px) {
    width: 120px;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    width: 140px;
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    border-color: #667eea;
    background: #f9f9ff;
  }
  &:disabled {
    background: #f4f4f4;
    cursor: not-allowed;
  }

  @media (max-width: 639px) {
    padding: 8px 10px;
    font-size: 12px;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 9px 11px;
    font-size: 13px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  z-index: 999;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f3f4ff;
  }

  @media (max-width: 639px) {
    padding: 8px 12px;
    font-size: 13px;
    gap: 8px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 639px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
  }
`;

const PageTitle = styled.h2`
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 800;

  @media (max-width: 639px) {
    font-size: 1.5rem;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    font-size: 1.75rem;
  }
`;

const OrdersBadge = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;

  @media (max-width: 639px) {
    padding: 3px 10px;
    font-size: 0.75rem;
  }
`;

const FiltersSection = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  @media (max-width: 639px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: end;

  @media (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: #a0aec0;
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background: #f7fafc;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 639px) {
    padding: 10px 10px 10px 38px;
    font-size: 0.9rem;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 639px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const ClearFiltersBtn = styled.button`
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;

  &:hover {
    border-color: #fc8181;
    background: #fff5f5;
    color: #e53e3e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 639px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
`;

const FilterStats = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;

  @media (max-width: 639px) {
    gap: 8px;
    margin-top: 12px;
  }
`;

const StatChip = styled.div`
  background: ${(props) => props.bg || "#f7fafc"};
  color: ${(props) => props.color || "#4a5568"};
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 2px solid ${(props) => props.borderColor || "#e2e8f0"};

  @media (max-width: 639px) {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
`;

const ViewBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
  }

  @media (max-width: 639px) {
    padding: 8px 10px;
    font-size: 13px;
    gap: 4px;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 9px 11px;
    font-size: 14px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  @media (max-width: 639px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const Modal = styled.div`
  width: 720px;
  max-width: 94%;
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 639px) {
    width: 100%;
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    padding: 20px;
    max-height: 85vh;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    max-width: 90%;
    padding: 22px;
  }
`;

const CloseBtn = styled.button`
  border: none;
  background: #f3f3f3;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  margin-top: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ status }) =>
    status === "pending"
      ? "linear-gradient(90deg, #F39C12, #E67E22)"
      : status === "confirmed"
      ? "linear-gradient(90deg, #00B894, #00A085)"
      : status === "shipped"
      ? "linear-gradient(90deg, #0984E3, #74B9FF)"
      : status === "delivered"
      ? "linear-gradient(90deg, #00A085, #55A3FF)"
      : "linear-gradient(90deg, #E17055, #FF7675)"};
  width: ${({ status }) =>
    status === "pending"
      ? "25%"
      : status === "confirmed"
      ? "50%"
      : status === "shipped"
      ? "75%"
      : status === "delivered"
      ? "100%"
      : "0%"};
  transition: width 0.8s ease-in-out;
  border-radius: 3px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

/* ---------------- Component ---------------- */
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangeStatus(orderId, newStatus) {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            // Preserve original order data and only update the status and other returned fields
            return {
              ...o, // Keep original order data including products
              ...updated, // Overlay with updated data from server
              products: o.products || updated.products || [], // Ensure products array exists
            };
          }
          return o;
        })
      );

      const statusEmojis = {
        confirmed: "✅ Confirmed!",
        shipped: "🚚 Shipped!",
        delivered: "📦 Delivered!",
        canceled: "❌ Canceled",
      };

      success(
        `${statusEmojis[newStatus] || "Updated!"} Order ${
          updated.orderNumber || `#${orderId}`
        } is now ${updated.status || newStatus}`
      );
    } catch {
      error("❌ Could not update order status - please try again");
    } finally {
      setOpenDropdown(null);
    }
  }

  const getAvailableStatuses = (current) => {
    const normalized = current?.toLowerCase();
    switch (normalized) {
      case "pending":
        return [
          { status: "confirmed", label: "✅ Confirm Order", priority: 1 },
          { status: "canceled", label: "❌ Cancel Order", priority: 2 },
        ];
      case "confirmed":
        return [
          { status: "shipped", label: "🚚 Mark as Shipped", priority: 1 },
          { status: "canceled", label: "❌ Cancel Order", priority: 2 },
        ];
      case "shipped":
        return [
          { status: "delivered", label: "📦 Mark as Delivered", priority: 1 },
        ];
      default:
        return [];
    }
  };

  const getStatusIcon = (status) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case "pending":
        return "⏳";
      case "confirmed":
        return "✅";
      case "shipped":
        return "🚚";
      case "delivered":
        return "📦";
      case "canceled":
        return "❌";
      default:
        return "❓";
    }
  };

  // Filter and sort logic
  const filteredOrders = React.useMemo(() => {
    let result = [...orders];

    // Search filter (order number, customer name, email, phone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((order) => {
        const orderNum = order.orderNumber?.toLowerCase() || "";
        const customerName =
          order.shippingAddress?.fullName?.toLowerCase() ||
          order.shippingAddress?.recipient?.toLowerCase() ||
          "";
        const email = order.shippingAddress?.email?.toLowerCase() || "";
        const phone = order.shippingAddress?.phone?.toLowerCase() || "";

        return (
          orderNum.includes(query) ||
          customerName.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }

      if (dateFilter !== "all") {
        result = result.filter((order) => {
          const orderDate = new Date(order.createdAt || order.date);
          return orderDate >= filterDate;
        });
      }
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "price-high":
          return (b.total || 0) - (a.total || 0);
        case "price-low":
          return (a.total || 0) - (b.total || 0);
        case "status": {
          const statusOrder = {
            pending: 1,
            confirmed: 2,
            shipped: 3,
            delivered: 4,
            canceled: 5,
          };
          return (
            (statusOrder[a.status?.toLowerCase()] || 99) -
            (statusOrder[b.status?.toLowerCase()] || 99)
          );
        }
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortBy, dateFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("newest");
    setDateFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim() ||
    statusFilter !== "all" ||
    sortBy !== "newest" ||
    dateFilter !== "all";

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const avgOrderValue = total > 0 ? totalRevenue / total : 0;

    const statusCounts = filteredOrders.reduce((acc, order) => {
      const status = order.status?.toLowerCase() || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      totalRevenue,
      avgOrderValue,
      statusCounts,
    };
  }, [filteredOrders]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <Container>
      <HeaderSection
        style={{
          padding: "16px 0",
          borderBottom: "2px solid #E2E8F0",
        }}
      >
        <PageTitle>📦 Orders Management</PageTitle>
        <OrdersBadge>{orders.length} Total Orders</OrdersBadge>
      </HeaderSection>

      {/* Filters Section */}
      <FiltersSection>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>
              <FiSearch /> Search Orders
            </FilterLabel>
            <SearchInputWrapper>
              <FiSearch />
              <SearchInput
                type="text"
                placeholder="Search by order #, name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <FiFilter /> Status
            </FilterLabel>
            <SelectInput
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">📦 Delivered</option>
              <option value="canceled">❌ Canceled</option>
            </SelectInput>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>📅 Date Range</FilterLabel>
            <SelectInput
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
            </SelectInput>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>🔄 Sort By</FilterLabel>
            <SelectInput
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="status">Status</option>
            </SelectInput>
          </FilterGroup>
        </FiltersGrid>

        <FilterStats>
          <StatChip bg="#f0fff4" color="#22543d" borderColor="#9ae6b4">
            📊 Showing: {filteredOrders.length} of {orders.length}
          </StatChip>
          <StatChip bg="#e6fffa" color="#234e52" borderColor="#81e6d9">
            💰 Revenue: PKR {stats.totalRevenue.toLocaleString()}
          </StatChip>
          <StatChip bg="#fef5e7" color="#7d6608" borderColor="#f6e05e">
            📈 Avg: PKR {Math.round(stats.avgOrderValue).toLocaleString()}
          </StatChip>
          {hasActiveFilters && (
            <ClearFiltersBtn onClick={clearFilters}>
              <FiX /> Clear Filters
            </ClearFiltersBtn>
          )}
        </FilterStats>
      </FiltersSection>

      {filteredOrders.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#4a5568" }}>
            No orders found
          </h3>
          <p style={{ color: "#a0aec0", margin: 0 }}>
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "No orders available"}
          </p>
        </div>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th first>📋 Order #</Th>
                <Th hideOnMobile>🛍️ Items</Th>
                <Th>📊 Status</Th>
                <Th hideOnMobile>💰 Total</Th>
                <Th last>⚡ Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <Td>{o.orderNumber}</Td>
                  <Td hideOnMobile>
                    {(o.products || []).map((p) => (
                      <div key={p.id}>
                        {p.name} × {p.qty}
                      </div>
                    ))}
                  </Td>
                  <Td>
                    <div>
                      <StatusBadge status={o.status?.toLowerCase()}>
                        <span style={{ fontSize: "1.1em" }}>
                          {getStatusIcon(o.status)}
                        </span>
                        {o.status}
                      </StatusBadge>
                      <ProgressContainer>
                        <ProgressBar status={o.status?.toLowerCase()} />
                      </ProgressContainer>
                    </div>
                  </Td>
                  <Td hideOnMobile>PKR {o.total.toFixed(2)}</Td>
                  <Td>
                    <DropdownWrapper>
                      <DropdownButton
                        onClick={() =>
                          setOpenDropdown(openDropdown === o.id ? null : o.id)
                        }
                        disabled={
                          o.status?.toLowerCase() === "delivered" ||
                          o.status?.toLowerCase() === "canceled"
                        }
                      >
                        {getAvailableStatuses(o.status).length > 0
                          ? "Update Status"
                          : "Complete"}
                        <FiChevronDown />
                      </DropdownButton>
                      {openDropdown === o.id && (
                        <DropdownMenu>
                          {getAvailableStatuses(o.status).length === 0 ? (
                            <DropdownItem
                              style={{ color: "#999", fontStyle: "italic" }}
                            >
                              🎉 Order Complete - No more actions needed
                            </DropdownItem>
                          ) : (
                            getAvailableStatuses(o.status)
                              .sort((a, b) => a.priority - b.priority)
                              .map((action) => (
                                <DropdownItem
                                  key={action.status}
                                  onClick={() =>
                                    handleChangeStatus(o.id, action.status)
                                  }
                                  style={{
                                    background:
                                      action.priority === 1
                                        ? "#f0fff4"
                                        : "#fff5f5",
                                    borderLeft: `4px solid ${
                                      action.priority === 1
                                        ? "#48bb78"
                                        : "#f56565"
                                    }`,
                                  }}
                                >
                                  {action.label}
                                </DropdownItem>
                              ))
                          )}
                        </DropdownMenu>
                      )}
                    </DropdownWrapper>
                    &nbsp;
                    <ViewBtn onClick={() => setSelected(o)}>
                      <FiEye /> View
                    </ViewBtn>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {selected && (
        <ModalOverlay onClick={() => setSelected(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "2px solid #E2E8F0",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "1.5rem",
                }}
              >
                📋 Invoice — {selected.orderNumber}
              </h3>
              <StatusBadge status={selected.status?.toLowerCase()}>
                <span style={{ fontSize: "1.1em" }}>
                  {getStatusIcon(selected.status)}
                </span>
                {selected.status}
              </StatusBadge>
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>Customer & Delivery</div>
                <div>
                  {selected.shippingAddress?.fullName ||
                    selected.shippingAddress?.recipient}
                </div>
                <div style={{ color: "#667eea", fontWeight: 500 }}>
                  📧 {selected.shippingAddress?.email}
                </div>
                <div>{selected.shippingAddress?.address}</div>
                <div>
                  {selected.shippingAddress?.city}{" "}
                  {selected.shippingAddress?.postal}
                </div>
                <div>{selected.shippingAddress?.country}</div>
                <div>📞 Phone: {selected.shippingAddress?.phone}</div>
              </div>
              <div style={{ width: 220 }}>
                <div style={{ fontWeight: 700 }}>Payment</div>
                <div>{selected.paymentInfo?.method || "—"}</div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>
                  Email Status
                </div>
                <div
                  style={{ color: selected.emailSent ? "#10b981" : "#f59e0b" }}
                >
                  {selected.emailSent ? "✅ Sent" : "⏳ Pending"}
                </div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>Total</div>
                <div>PKR {selected.total}</div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Items</div>
              {(selected.products || []).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                  }}
                >
                  <div>
                    {p.name} × {p.qty}
                  </div>
                  <div>PKR {(p.price * p.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "right", marginTop: 16 }}>
              <CloseBtn onClick={() => setSelected(null)}>Close</CloseBtn>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}
