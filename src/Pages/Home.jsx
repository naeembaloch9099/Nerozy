import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HeroSection from "../Components/HeroSection";
import ProductCard from "../Components/ProductCard";
import { getFeatured, getAllProducts, getCategories } from "../Services/Api";
import { error as notifyError } from "../Utils/notify";
import { useCart } from "../Context/Cart";

const Container = styled.div`
  max-width: 1280px;
  margin: 32px auto;
  padding: 0 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #0f172a;
  font-weight: 700;
`;

const CategoryBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Chip = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid #dbeafe;
  background: ${(p) =>
    p.active ? "linear-gradient(90deg,#1f6feb,#3b82f6)" : "#f8fafc"};
  color: ${(p) => (p.active ? "#fff" : "#1e3a8a")};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25s ease-in-out;

  &:hover {
    background: ${(p) =>
      p.active ? "linear-gradient(90deg,#2563eb,#1d4ed8)" : "#e0f2fe"};
    transform: translateY(-2px);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #64748b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-size: 1rem;
`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const { addToCart } = useCart();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const featured = await getFeatured();
      const all = await getAllProducts();

      // ensure categories are fetched for category bar
      try {
        const cats = await getCategories();
        setCategories((cats || []).map((c) => c.name));
      } catch (err) {
        console.debug("Failed to load categories", err);
      }

      setAllProducts(all || []);
      setProducts(featured?.length ? featured : all || []);
    } catch (err) {
      console.error("Error loading products:", err);
      notifyError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // handler for categories updates dispatched by admin UI
  const handleCategoriesUpdated = () => {
    getCategories()
      .then((cats) => setCategories((cats || []).map((c) => c.name)))
      .catch((e) => console.debug("categoriesUpdated handler failed", e));
  };

  useEffect(() => {
    loadProducts();

    // Listen for product refresh events (triggered after order completion)
    const handleProductRefresh = () => {
      console.log("🔄 Refreshing products after order completion");
      loadProducts();
    };

    window.addEventListener("refreshProducts", handleProductRefresh);
    window.addEventListener("categoriesUpdated", handleCategoriesUpdated);

    return () => {
      window.removeEventListener("refreshProducts", handleProductRefresh);
      window.removeEventListener("categoriesUpdated", handleCategoriesUpdated);
    };
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (p) => p.category === selectedCategory
      );
      setProducts(filtered);
    }
  }, [selectedCategory, allProducts]);

  return (
    <div>
      <HeroSection />

      <Container>
        <Header>
          <Title>
            {selectedCategory
              ? `${selectedCategory} Collection`
              : "Featured Shoes"}
          </Title>

          <CategoryBar>
            <Chip
              key="All"
              active={selectedCategory === ""}
              onClick={() => setSelectedCategory("")}
            >
              All
            </Chip>
            {categories.map((cat) => (
              <Chip
                key={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Chip>
            ))}
          </CategoryBar>
        </Header>

        {loading ? (
          <Loading>Loading products...</Loading>
        ) : products.length > 0 ? (
          <Grid>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() =>
                  addToCart({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.images?.[0],
                    quantity: 1,
                  })
                }
              />
            ))}
          </Grid>
        ) : (
          <EmptyState>No products found in this category.</EmptyState>
        )}
      </Container>
    </div>
  );
}
