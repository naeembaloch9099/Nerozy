import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";
import { getAllProducts } from "../Services/Api";
import { useNavigate } from "react-router-dom";

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 8px;
  border-radius: 8px;
  min-width: 220px;
`;

const Input = styled.input`
  background: transparent;
  border: 0;
  outline: 0;
  color: #0f172a;
  margin-left: 6px;
  width: 100%;
`;

const Menu = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  background: white;
  list-style: none;
  margin: 0;
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
  max-height: 240px;
  overflow: auto;
`;

const Item = styled.li`
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background: #f4f7fb;
  }
`;

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState([]);
  const nav = useNavigate();
  const ref = useRef();

  useEffect(() => {
    let mounted = true;
    if (!q) return setHits([]);
    getAllProducts().then((list) => {
      if (!mounted) return;
      const filtered = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(q.toLowerCase()))
      );
      setHits(filtered.slice(0, 6));
    });
    return () => (mounted = false);
  }, [q]);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setHits([]);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <Wrap ref={ref}>
      <FiSearch color="#0f172a" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search shoes, brands..."
        aria-label="Search"
      />
      {hits.length > 0 && (
        <Menu>
          {hits.map((h) => (
            <Item
              key={h.id}
              onClick={() => {
                setQ("");
                setHits([]);
                nav(`/product/${h.id}`);
              }}
            >
              {h.name}{" "}
              <small style={{ opacity: 0.6, marginLeft: 8 }}>
                {h.brand || ""}
              </small>
            </Item>
          ))}
        </Menu>
      )}
    </Wrap>
  );
}
