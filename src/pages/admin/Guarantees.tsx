import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const HEADING_KEY = "guarantees_heading";
const DESCRIPTION_KEY = "guarantees_description";
const PAGE = "tooted";

const GuaranteesAdmin: React.FC = () => {
  const [guarantees, setGuarantees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Heading/description state
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);

  // Fetch guarantees
  const fetchGuarantees = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("guarantees")
      .select("*")
      .order("order", { ascending: true });
    if (error) {
      setError("Failed to fetch guarantees");
      setLoading(false);
      return;
    }
    setGuarantees(data || []);
    setLoading(false);
  };

  // Fetch heading/description
  const fetchContent = async () => {
    setContentLoading(true);
    const { data, error } = await supabase
      .from("website_content")
      .select("key, value")
      .eq("page", PAGE)
      .in("key", [HEADING_KEY, DESCRIPTION_KEY]);
    if (data) {
      setHeading(data.find((row: any) => row.key === HEADING_KEY)?.value || "");
      setDescription(data.find((row: any) => row.key === DESCRIPTION_KEY)?.value || "");
    }
    setContentLoading(false);
  };

  useEffect(() => {
    fetchGuarantees();
    fetchContent();
  }, []);

  // Save heading/description
  const saveContent = async () => {
    setContentSaving(true);
    // Upsert heading
    await supabase.from("website_content").upsert({
      page: PAGE,
      key: HEADING_KEY,
      value: heading,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page,key" });
    // Upsert description
    await supabase.from("website_content").upsert({
      page: PAGE,
      key: DESCRIPTION_KEY,
      value: description,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page,key" });
    setContentSaving(false);
    fetchContent();
  };

  const openAddDialog = () => {
    setEditId(null);
    setForm({ title: "", description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (g: any) => {
    setEditId(g.id);
    setForm({ title: g.title, description: g.description });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      // Update
      await supabase.from("guarantees").update({ title: form.title, description: form.description }).eq("id", editId);
    } else {
      // Insert, set order to last
      const maxOrder = guarantees.length ? Math.max(...guarantees.map(g => g.order || 0)) : 0;
      await supabase.from("guarantees").insert({ title: form.title, description: form.description, order: maxOrder + 1 });
    }
    setDialogOpen(false);
    setSaving(false);
    fetchGuarantees();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await supabase.from("guarantees").delete().eq("id", deleteId);
      setDeleteId(null);
      fetchGuarantees();
    }
  };

  const moveGuarantee = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === guarantees.length - 1)
    ) {
      return;
    }
    const otherIndex = direction === "up" ? index - 1 : index + 1;
    const current = guarantees[index];
    const other = guarantees[otherIndex];
    // Swap order values
    await supabase.from("guarantees").update({ order: other.order }).eq("id", current.id);
    await supabase.from("guarantees").update({ order: current.order }).eq("id", other.id);
    fetchGuarantees();
  };

  return (
    <div>
      <div className="mb-8 p-6 bg-white rounded shadow max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Guarantees Block Content</h2>
        {contentLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Heading</label>
              <input className="w-full border rounded px-3 py-2" value={heading} onChange={e => setHeading(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={saveContent} disabled={contentSaving}>{contentSaving ? "Saving..." : "Save"}</button>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Guarantees</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={openAddDialog}>Add Guarantee</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <ul className="space-y-4">
          {guarantees.map((g, i) => (
            <li key={g.id} className="p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg">{g.title}</div>
                <div className="text-gray-600">{g.description}</div>
              </div>
              <div className="mt-2 md:mt-0 flex gap-2 items-center">
                <button className="px-2 py-1 bg-gray-100 rounded" disabled={i === 0} onClick={() => moveGuarantee(i, "up")}>↑</button>
                <button className="px-2 py-1 bg-gray-100 rounded" disabled={i === guarantees.length - 1} onClick={() => moveGuarantee(i, "down")}>↓</button>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => openEditDialog(g)}>Edit</button>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setDeleteId(g.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-gray-500 text-sm">Drag and drop to reorder (coming soon)</div>

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Guarantee" : "Add Guarantee"}</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input className="w-full border rounded px-3 py-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Delete Guarantee?</h2>
            <p className="mb-4">Are you sure you want to delete this guarantee?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuaranteesAdmin; 