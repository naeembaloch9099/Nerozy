import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const StockBadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.$stock === 0) {
      return `
        background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
        color: white;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      `;
    } else if (props.$stock <= 5) {
      return `
        background: linear-gradient(135deg, #ffd93d, #ffb703);
        color: #333;
        box-shadow: 0 4px 12px rgba(255, 183, 3, 0.3);
        animation: ${pulse} 2s ease-in-out infinite;
      `;
    } else if (props.$stock <= 10) {
      return `
        background: linear-gradient(135deg, #74c0fc, #4dabf7);
        color: white;
        box-shadow: 0 4px 12px rgba(77, 171, 247, 0.3);
      `;
    } else {
      return `
        background: linear-gradient(135deg, #51cf66, #37b24d);
        color: white;
        box-shadow: 0 4px 12px rgba(55, 178, 77, 0.3);
      `;
    }
  }}

  @media (max-width: 639px) {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
`;

const StockIndicator = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);

  ${(props) =>
    props.$stock === 0 &&
    `
    background: rgba(255, 255, 255, 0.8);
  `}

  @media (max-width: 639px) {
    width: 6px;
    height: 6px;
  }
`;

const StockText = styled.span`
  letter-spacing: 0.5px;
`;

export default function StockBadge({ stock, showCount = true }) {
  const getStockText = () => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return showCount ? `Only ${stock} Left!` : "Low Stock";
    if (stock <= 10) return showCount ? `${stock} in Stock` : "Limited";
    return "In Stock";
  };

  return (
    <StockBadgeWrapper $stock={stock}>
      <StockIndicator $stock={stock} />
      <StockText>{getStockText()}</StockText>
    </StockBadgeWrapper>
  );
}
