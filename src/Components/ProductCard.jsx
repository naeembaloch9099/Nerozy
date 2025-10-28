import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import StockBadge from "./StockBadge";

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  ${(props) =>
    props.$outOfStock &&
    `
    opacity: 0.7;
    pointer-events: ${props.$outOfStock ? "none" : "auto"};
  `}
`;

const ImgWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #eee;

  &:hover img {
    transform: scale(1.05);
  }

  &:hover::after {
    opacity: 0.15;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, #000, transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s;

  ${(props) =>
    props.$outOfStock &&
    `
    filter: grayscale(100%);
  `}
`;

const StockBadgeWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
`;

const QuickAddButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: ${(props) => (props.disabled ? "#ccc" : "#ff6b6b")};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  ${ImgWrapper}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: ${(props) => (props.disabled ? "#ccc" : "#ff5252")};
  }
`;

const Info = styled.div`
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #333;
  flex: 1;
  min-width: 150px;
`;

const Price = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 600;
`;

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = product.images?.[0] || "/images/shoe1.jpg";
  const stock = product.qty || 0;
  const isOutOfStock = stock === 0;

  return (
    <Card $outOfStock={isOutOfStock}>
      <Link
        to={`/product/${product.id}`}
        style={{ pointerEvents: isOutOfStock ? "none" : "auto" }}
      >
        <ImgWrapper>
          <Img src={imageUrl} alt={product.name} $outOfStock={isOutOfStock} />
          <StockBadgeWrapper>
            <StockBadge stock={stock} showCount={stock <= 10} />
          </StockBadgeWrapper>
          <QuickAddButton
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) {
                onAddToCart?.(product);
              }
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </QuickAddButton>
        </ImgWrapper>
      </Link>
      <Info>
        <Name>{product.name}</Name>
        <Price>PKR {product.price.toFixed(2)}</Price>
      </Info>
    </Card>
  );
}
