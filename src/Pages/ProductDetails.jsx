import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { getProductById } from "../Services/Api";
import { useCart } from "../Context/Cart";
import { success } from "../Utils/notify";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 30px;
  }

  @media (max-width: 568px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    height: 400px;
  }

  @media (max-width: 568px) {
    height: 300px;
    border-radius: 12px;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProductTitle = styled.h1`
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 568px) {
    font-size: 28px;
  }
`;

const ProductDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin: 0;

  @media (max-width: 568px) {
    font-size: 15px;
  }
`;

const PriceTag = styled.div`
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 8px 0;

  @media (max-width: 568px) {
    font-size: 28px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
  margin: 12px 0;
`;

const OptionGroup = styled.div`
  margin: 20px 0;
`;

const OptionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ColorGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ColorButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: 3px solid ${(props) => (props.$selected ? "#667eea" : "#e0e0e0")};
  background: ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.$selected
      ? "0 4px 12px rgba(102, 126, 234, 0.4)"
      : "0 2px 8px rgba(0,0,0,0.1)"};
  position: relative;

  &:hover {
    transform: translateY(-2px);
    border-color: #667eea;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  }

  &::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 20px;
    font-weight: bold;
    opacity: ${(props) => (props.$selected ? 1 : 0)};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const SizeSelect = styled.select`
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  &:hover {
    border-color: #667eea;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8f9fa;
  padding: 12px 20px;
  border-radius: 12px;
  width: fit-content;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  font-size: 20px;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
  color: #333;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 18px 32px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 20px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 568px) {
    padding: 16px 24px;
    font-size: 16px;
  }
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #667eea;
  font-weight: 600;
`;

const SelectedColorInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #667eea;
  margin-top: 12px;
`;

const ColorDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${(props) => props.$color};
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ColorName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
`;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState("");
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      if (p) {
        if (p.colors && p.colors.length) setColor(p.colors[0]);
        if (p.sizes && p.sizes.length) setSize(p.sizes[0]);
      }
    });
  }, [id]);

  if (!product) {
    return (
      <Container>
        <LoadingContainer>
          <div>Loading amazing product... ✨</div>
        </LoadingContainer>
      </Container>
    );
  }

  function handleAdd() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color,
      size,
      quantity: qty,
      image: product.images[0],
    });
    success("🎉 Added to cart!");
  }

  const incrementQty = () =>
    setQty((prev) => Math.min(prev + 1, product.qty || 99));
  const decrementQty = () => setQty((prev) => Math.max(prev - 1, 1));

  return (
    <Container>
      <Wrap>
        <ProductGrid>
          {/* Image Section */}
          <ImageSection>
            <Badge>✨ Premium Quality</Badge>
            <MainImage
              src={product.images[0] || "/images/shoe1.jpg"}
              alt={product.name}
            />
          </ImageSection>

          {/* Details Section */}
          <DetailsSection>
            <div>
              <ProductTitle>{product.name}</ProductTitle>
              <PriceTag>PKR {product.price.toLocaleString()}</PriceTag>
            </div>

            <Divider />

            <ProductDescription>
              {product.description ||
                "Experience premium quality and exceptional comfort with this stunning piece from our collection."}
            </ProductDescription>

            <Divider />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <OptionGroup>
                <OptionLabel>Choose Your Color</OptionLabel>
                <ColorGrid>
                  {product.colors.map((c) => (
                    <ColorButton
                      key={c}
                      $color={c}
                      $selected={c === color}
                      onClick={() => setColor(c)}
                      title={c}
                    />
                  ))}
                </ColorGrid>
                {color && (
                  <SelectedColorInfo>
                    <ColorDot $color={color} />
                    <ColorName>Selected: {color}</ColorName>
                  </SelectedColorInfo>
                )}
              </OptionGroup>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <OptionGroup>
                <OptionLabel>Select Size</OptionLabel>
                <SizeSelect
                  value={size ?? ""}
                  onChange={(e) => setSize(Number(e.target.value))}
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      Size {s}
                    </option>
                  ))}
                </SizeSelect>
              </OptionGroup>
            )}

            {/* Quantity Selection */}
            <OptionGroup>
              <OptionLabel>Quantity</OptionLabel>
              <QuantityControl>
                <QuantityButton onClick={decrementQty} disabled={qty <= 1}>
                  −
                </QuantityButton>
                <QuantityDisplay>{qty}</QuantityDisplay>
                <QuantityButton
                  onClick={incrementQty}
                  disabled={qty >= (product.qty || 99)}
                >
                  +
                </QuantityButton>
              </QuantityControl>
            </OptionGroup>

            {/* Add to Cart Button */}
            <AddToCartButton onClick={handleAdd}>
              🛒 Add to Cart
            </AddToCartButton>

            {/* Product Info */}
            <OptionGroup>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  padding: "20px",
                  borderRadius: "12px",
                  color: "white",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    opacity: 0.9,
                  }}
                >
                  ✓ Free shipping on orders over PKR 5000
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    opacity: 0.9,
                  }}
                >
                  ✓ Easy returns within 7 days
                </div>
                <div style={{ fontSize: "14px", opacity: 0.9 }}>
                  ✓ 100% authentic products
                </div>
              </div>
            </OptionGroup>
          </DetailsSection>
        </ProductGrid>
      </Wrap>
    </Container>
  );
}
