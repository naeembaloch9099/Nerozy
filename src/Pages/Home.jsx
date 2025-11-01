import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HeroSection from "../Components/HeroSection";
import ProductCard from "../Components/ProductCard";
import { getFeatured, getAllProducts, getCategories } from "../Services/Api";
import { error as notifyError } from "../Utils/notify";
import { useCart } from "../Context/Cart";

const Container = styled.div`
  max-width: 1280px;
  margin: 24px auto;
  padding: 0 20px;
  font-family: "Georgia", "Times New Roman", serif;
  color: #17202a;
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
  font-size: 1.9rem;
  color: #2b2b25;
  font-weight: 800;
  letter-spacing: 0.4px;
  font-family: "Georgia", "Times New Roman", serif;
`;

const CategoryBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-left: auto;
`;

const Chip = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(43, 37, 28, 0.08);
  background: ${(p) => (p.active ? "#6b4b2a" : "#fff7f0")};
  color: ${(p) => (p.active ? "#fffdf8" : "#6b4b2a")};
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(43, 37, 28, 0.06);
  }
`;

const Grid = styled.div`
  display: grid;
  /* Desktop: 4 columns */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1023px) {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  @media (max-width: 639px) {
    /* Mobile: single column */
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #6b6b6b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #8b7a6b;
  font-size: 1rem;
`;

const CraftSection = styled.section`
  background: linear-gradient(
    180deg,
    rgba(255, 250, 245, 0.95),
    rgba(255, 255, 255, 0)
  );
  border-radius: 8px;
  padding: 24px;
  margin: 20px 0 8px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const CraftText = styled.div`
  flex: 1;
`;

const CraftBadge = styled.div`
  background: #fff3e6;
  border: 1px solid #f0d8c2;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 700;
  color: #7a4a27;
  font-size: 0.9rem;
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
