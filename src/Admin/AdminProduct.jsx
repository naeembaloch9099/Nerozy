import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ProductCard from "../Components/ProductCard";
import StockBadge from "../Components/StockBadge";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  deleteCategory,
} from "../Services/Api";
import { success, info, error } from "../Utils/notify";
import { FiPlus, FiSearch, FiEdit, FiTrash, FiImage } from "react-icons/fi";

const Container = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: #f6f7fb;

  @media (max-width: 820px) {
    padding: 16px;
  }

  @media (max-width: 639px) {
    padding: 12px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 12px;

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
`;

const CardWrap = styled.div`
  perspective: 1200px;
`;

const Hover3D = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border-radius: 14px;
  padding: 12px;
  transition: transform 400ms cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 400ms;
  transform-style: preserve-3d;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.06);
  will-change: transform;

  &:hover {
    transform: translateY(-10px) rotateX(4deg) rotateY(-6deg) scale(1.02);
    box-shadow: 0 20px 50px rgba(2, 6, 23, 0.12);
  }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(31,111,235,0); }
  50% { box-shadow: 0 0 24px rgba(31,111,235,0.12); }
  100% { box-shadow: 0 0 0 rgba(31,111,235,0); }
`;

const Btn = styled.button`
  border: 0;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: linear-gradient(90deg, #1f6feb, #8cc3ff);
  color: white;
  transition: transform 160ms, box-shadow 260ms;
  box-shadow: 0 8px 20px rgba(31, 111, 235, 0.12);

  &:hover {
    transform: translateY(-4px);
    animation: ${glow} 1.6s infinite;
  }
`;

const Danger = styled(Btn)`
  background: linear-gradient(90deg, #ff6b6b, #ff9a9a);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.12);
`;

const TopBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 639px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const Search = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e6eefc;
  min-width: 220px;

  @media (max-width: 639px) {
    min-width: 100%;
    padding: 10px 12px;
  }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e6eefc;

  @media (max-width: 639px) {
    width: 100%;
    padding: 10px 12px;
  }
`;

const IconBtn = styled.button`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: transparent;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;

  @media (max-width: 639px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalCard = styled.div`
  width: 640px;
  max-width: 95%;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 18px 60px rgba(2, 6, 23, 0.12);
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 820px) {
    width: 90%;
    padding: 20px;
    max-height: 85vh;
  }

  @media (max-width: 639px) {
    width: 100%;
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    padding: 20px 16px;
    max-height: 90vh;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;

  @media (max-width: 639px) {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  @media (min-width: 640px) and (max-width: 820px) {
    gap: 10px;
  }
`;

const ImgPreview = styled.img`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;

  @media (max-width: 639px) {
    width: 60px;
    height: 60px;
  }
`;

const FormInput = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6eefc;
  font-size: 14px;
  flex: 1;

  @media (max-width: 639px) {
    width: 100%;
    padding: 12px;
  }
`;

const FormTextarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6eefc;
  font-size: 14px;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  @media (max-width: 639px) {
    padding: 12px;
    min-height: 100px;
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #1e1e1e;

  @media (max-width: 639px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  // search & categories
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [categories, setCategories] = useState([]);

  // fetch categories from backend when component mounts
  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      try {
        const cats = await getCategories();
        if (!mounted) return;
        // keep full category objects (id + name)
        const items = (cats || []).map((c) => ({ id: c.id, name: c.name }));
        // fallback to two defaults if none found
        if (items.length === 0)
          setCategories([
            { id: "peshwari", name: "Peshwari Chappal" },
            { id: "nerozi", name: "Nerozi" },
          ]);
        else setCategories(items);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([
          { id: "peshwari", name: "Peshwari Chappal" },
          { id: "nerozi", name: "Nerozi" },
        ]);
      }
    }
    loadCats();
    return () => {
      mounted = false;
    };
  }, []);

  // UI state for adding/removing categories in modal
  const [newCategoryName, setNewCategoryName] = useState("");
  const [pendingDelete, setPendingDelete] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setLoading(true);
    getAllProducts()
      .then((list) => {
        setProducts(list || []);
      })
      .finally(() => setLoading(false));
  }

  function openAdd() {
    setEditing(null);
    setName("");
    setPrice("");
    setQty("");
    setSizes("");
    setColors("");
    setDesc("");
    setCategory(categories[0]?.name || "");
    setImages([]);
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setName(p.name || "");
    setPrice(p.price ?? "");
    setQty(p.qty ?? "");
    setSizes(p.sizes ? p.sizes.join(", ") : "");
    setColors(p.colors ? p.colors.join(", ") : "");
    setDesc(p.description || "");
    setCategory(p.category || categories[0]?.name || "");
    setImages(p.images ? [...p.images] : []);
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) return error("Name required");
    if (!category) return error("Select category");
    // sanitize description: strip HTML tags and decode HTML entities
    function stripHtml(html) {
      if (!html) return "";
      // remove tags
      const withoutTags = html.replace(/<[^>]*>/g, "");
      // decode common HTML entities using a textarea
      try {
        const txt = document.createElement("textarea");
        txt.innerHTML = withoutTags;
        return txt.value;
      } catch (err) {
        console.debug(err);
        return withoutTags;
      }
    }

    const payload = {
      name: name.trim(),
      price: Number(price) || 0,
      qty: Number(qty) || 1,
      description: stripHtml(desc),
      category,
      images: images || [],
      colors: (colors || "")
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean),
      sizes: (sizes || "")
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
    };

    try {
      if (editing) {
        await updateProduct(editing.id, payload);
        success("Product updated");
      } else {
        await createProduct(payload);
        success("Product added");
      }
      setModalOpen(false);
      refresh();
    } catch (err) {
      console.error(err);
      error("Could not save product");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      info("Product deleted");
      refresh();
    } catch (err) {
      console.error(err);
      error("Delete failed");
    }
  }

  function handleImageChange(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImages((s) => [...s, reader.result]);
    };
    reader.readAsDataURL(file);
  }

  function removeImage(idx) {
    setImages((s) => s.filter((_, i) => i !== idx));
  }

  async function addCategory(newCat) {
    const v = (newCat || "").trim();
    if (!v) return;
    if (categories.some((c) => c.name === v)) return;
    if (categories.length >= 50) return error("Max 50 categories allowed");
    try {
      const created = await createCategory({ name: v });
      // Refresh canonical list from backend to stay in sync with other clients
      const fresh = await getCategories();
      const items = (fresh || []).map((c) => ({ id: c.id, name: c.name }));
      if (items.length) setCategories(items);
      // If backend returned created item, select it
      if (created && created.name) setCategory(created.name);
      success("Category created");
      // Notify other open clients to refresh their category lists
      try {
        window.dispatchEvent(new Event("categoriesUpdated"));
      } catch (err) {
        console.debug("categoriesUpdated dispatch failed", err);
      }
    } catch (err) {
      console.error("createCategory failed", err);
      error("Could not create category");
    }
  }

  // Delete a category by name (find id then call API)
  async function deleteCategoryByName(name) {
    const found = categories.find((c) => c.name === name);
    if (!found) return error("Category not found");
    try {
      await deleteCategory(found.id);
      // refresh canonical list
      const fresh = await getCategories();
      const items = (fresh || []).map((c) => ({ id: c.id, name: c.name }));
      setCategories(items.length ? items : []);
      setPendingDelete("");
      success("Category deleted");
      try {
        window.dispatchEvent(new Event("categoriesUpdated"));
      } catch (err) {
        console.debug("categoriesUpdated dispatch failed", err);
      }
    } catch (err) {
      console.error("deleteCategory failed", err);
      error("Could not delete category");
    }
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalShoes = products.reduce((s, p) => s + (Number(p.qty) || 0), 0);

  return (
    <Container>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Manage Products</h2>
        <div
          style={{
            background: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
            fontSize: 13,
            color: "#1f3a8a",
            fontWeight: 700,
          }}
        >
          Total shoes: {totalShoes}
        </div>
      </div>

      <TopBar>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FiSearch />
          <Search
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconBtn
              onClick={() => setShowCategoryModal(true)}
              title="Manage categories"
            >
              <FiPlus /> Manage categories
            </IconBtn>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginLeft: 8,
                flexWrap: "wrap",
              }}
            >
              {categories.slice(0, 6).map((c) => (
                <div
                  key={c.id || c.name}
                  style={{
                    padding: "6px 10px",
                    background: "#fff",
                    borderRadius: 9999,
                    border: "1px solid #eef2ff",
                    fontSize: 13,
                  }}
                >
                  {c.name}
                </div>
              ))}
              {categories.length > 6 && (
                <div
                  style={{
                    padding: "6px 10px",
                    background: "#fff",
                    borderRadius: 9999,
                    border: "1px solid #eef2ff",
                    fontSize: 13,
                  }}
                >
                  +{categories.length - 6} more
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <Btn onClick={openAdd}>
            <FiPlus /> Add Product
          </Btn>
        </div>
      </TopBar>

      {showCategoryModal && (
        <ModalOverlay onMouseDown={() => setShowCategoryModal(false)}>
          <ModalCard onMouseDown={(e) => e.stopPropagation()}>
            <ModalTitle>Manage Categories</ModalTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <FormInput
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Btn
                  onClick={async () => {
                    const name = (newCategoryName || "").trim();
                    if (!name) return error("Category name required");
                    await addCategory(name);
                    setNewCategoryName("");
                  }}
                >
                  Add
                </Btn>
                <IconBtn onClick={() => setShowCategoryModal(false)}>
                  Close
                </IconBtn>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.map((c) => (
                  <div
                    key={c.id || c.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: 8,
                      borderRadius: 8,
                      background: "#fff",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <div style={{ flex: 1 }}>{c.name}</div>
                    {pendingDelete === c.name ? (
                      <>
                        <Danger
                          onClick={async () => {
                            await deleteCategoryByName(c.name);
                          }}
                        >
                          Confirm delete
                        </Danger>
                        <IconBtn onClick={() => setPendingDelete("")}>
                          Cancel
                        </IconBtn>
                      </>
                    ) : (
                      <IconBtn
                        onClick={() => setPendingDelete(c.name)}
                        title={`Delete ${c.name}`}
                      >
                        <FiTrash />
                      </IconBtn>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Grid>
          {filtered.map((p) => (
            <CardWrap key={p.id}>
              <Hover3D>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 140 }}>
                    {(Array.isArray(p.images) ? p.images[0] : p.images) ? (
                      <ImgPreview
                        src={Array.isArray(p.images) ? p.images[0] : p.images}
                        alt={p.name}
                      />
                    ) : (
                      <div
                        style={{
                          width: 140,
                          height: 96,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f7fbff",
                          borderRadius: 8,
                        }}
                      >
                        <FiImage size={36} color="#8aa" />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <h4 style={{ margin: 0 }}>{p.name}</h4>
                      <StockBadge stock={p.qty || 0} showCount={false} />
                    </div>
                    <div style={{ color: "#556", marginTop: 6 }}>
                      {p.description}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        Price: PKR {p.price}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color:
                            p.qty === 0
                              ? "#ff6b6b"
                              : p.qty <= 5
                              ? "#ffb703"
                              : "#51cf66",
                        }}
                      >
                        Stock: {p.qty || 0}
                      </div>
                      <div>Cat: {p.category || "-"}</div>
                      <div>
                        Sizes:{" "}
                        {p.sizes && p.sizes.length ? p.sizes.join(", ") : "-"}
                      </div>

                      {/* ✅ Fixed Color Rendering */}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        Colors:
                        {p.colors && p.colors.length
                          ? p.colors.map((c, i) => (
                              <div
                                key={i}
                                title={c}
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: /^#|rgb|hsl|[a-z]+$/i.test(
                                    c.trim()
                                  )
                                    ? c.trim()
                                    : "#ccc",
                                  border: "1px solid #ddd",
                                }}
                              />
                            ))
                          : " -"}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <IconBtn onClick={() => openEdit(p)} title="Edit">
                        <FiEdit /> Edit
                      </IconBtn>
                      <IconBtn
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                      >
                        <FiTrash /> Delete
                      </IconBtn>
                    </div>
                  </div>
                </div>
              </Hover3D>
            </CardWrap>
          ))}
        </Grid>
      )}

      {modalOpen && (
        <ModalOverlay onMouseDown={() => setModalOpen(false)}>
          <ModalCard onMouseDown={(e) => e.stopPropagation()}>
            <ModalTitle>{editing ? "Edit Product" : "Add Product"}</ModalTitle>
            <form onSubmit={handleSave}>
              <FormRow>
                <FormInput
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormRow>

              <FormRow>
                <FormInput
                  placeholder="Price (PKR)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ flex: 1 }}
                />
                <FormInput
                  placeholder="Quantity"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ flex: 1 }}
                />
              </FormRow>

              <FormRow>
                <FormInput
                  placeholder="Sizes (e.g. 6,7,8)"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                />
              </FormRow>

              <FormRow>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </Select>
              </FormRow>

              <FormRow>
                <FormInput
                  placeholder="Colors (e.g. red, blue, #333)"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                />
              </FormRow>

              <FormRow>
                <label
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "1px solid #e6eefc",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center",
                    background: "#f8f9fa",
                  }}
                >
                  📷 Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              </FormRow>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                {images.map((src, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <ImgPreview src={src} alt={`img-${i}`} />
                    <IconBtn type="button" onClick={() => removeImage(i)}>
                      Remove
                    </IconBtn>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <FormTextarea
                  placeholder="Product Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Danger type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Danger>
                <Btn type="submit">{editing ? "Update" : "Add Product"}</Btn>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
}
