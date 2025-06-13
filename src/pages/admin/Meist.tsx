import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const HEADER_KEY = "meist_header";
const DESCRIPTION_KEY = "meist_description";
const PAGE = "meist";

const ICON_OPTIONS = [
  { label: "Check", value: "check" },
  { label: "User", value: "user" },
  { label: "Heart", value: "heart" },
  { label: "Globe", value: "globe" },
  { label: "Star", value: "star" },
  { label: "Thumbs Up", value: "thumbs-up" },
];

const MeistAdmin: React.FC = () => {
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState([{ value: "", label: "" }]);
  const [promises, setPromises] = useState([{ icon: "check", title: "", text: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ctaTitle, setCtaTitle] = useState("Valmis oma projekti alustama?");
  const [ctaText, setCtaText] = useState("Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil.");
  const [ctaButton, setCtaButton] = useState("Küsi pakkumist");
  const [missionTitle, setMissionTitle] = useState("Meie missioon");
  const [missionTexts, setMissionTexts] = useState<string[]>([""]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", PAGE);
      if (data) {
        setHeader(data.find((row: any) => row.key === HEADER_KEY)?.value || "");
        setHeaderHighlight(data.find((row: any) => row.key === "meist_header_highlight")?.value || "");
        setDescription(data.find((row: any) => row.key === DESCRIPTION_KEY)?.value || "");
        // Stats
        const statArr = [];
        for (let i = 1; i <= 6; i++) {
          const value = data.find((row: any) => row.key === `meist_stat_${i}_value`)?.value || "";
          const label = data.find((row: any) => row.key === `meist_stat_${i}_label`)?.value || "";
          if (value || label) statArr.push({ value, label });
        }
        setStats(statArr.length ? statArr : [{ value: "", label: "" }]);
        // Promises
        const promiseArr = [];
        for (let i = 1; i <= 6; i++) {
          const icon = data.find((row: any) => row.key === `meist_promise_${i}_icon`)?.value || "check";
          const title = data.find((row: any) => row.key === `meist_promise_${i}_title`)?.value || "";
          const text = data.find((row: any) => row.key === `meist_promise_${i}_text`)?.value || "";
          if (title || text) promiseArr.push({ icon, title, text });
        }
        setPromises(promiseArr.length ? promiseArr : [{ icon: "check", title: "", text: "" }]);
        setCtaTitle(data.find((row: any) => row.key === "meist_cta_title")?.value || "Valmis oma projekti alustama?");
        setCtaText(data.find((row: any) => row.key === "meist_cta_text")?.value || "Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil.");
        setCtaButton(data.find((row: any) => row.key === "meist_cta_button")?.value || "Küsi pakkumist");
        setMissionTitle(data.find((row: any) => row.key === "meist_mission_title")?.value || "Meie missioon");
        const missionArr = [];
        for (let i = 1; i <= 3; i++) {
          const text = data.find((row: any) => row.key === `meist_mission_text_${i}`)?.value || "";
          if (text) missionArr.push(text);
        }
        setMissionTexts(missionArr.length ? missionArr : [""]);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const updates = [
      { page: PAGE, key: HEADER_KEY, value: header },
      { page: PAGE, key: "meist_header_highlight", value: headerHighlight },
      { page: PAGE, key: DESCRIPTION_KEY, value: description },
      ...stats.map((s, i) => [
        { page: PAGE, key: `meist_stat_${i + 1}_value`, value: s.value },
        { page: PAGE, key: `meist_stat_${i + 1}_label`, value: s.label },
      ]).flat(),
      ...promises.map((p, i) => [
        { page: PAGE, key: `meist_promise_${i + 1}_icon`, value: p.icon },
        { page: PAGE, key: `meist_promise_${i + 1}_title`, value: p.title },
        { page: PAGE, key: `meist_promise_${i + 1}_text`, value: p.text },
      ]).flat(),
      { page: PAGE, key: "meist_cta_title", value: ctaTitle },
      { page: PAGE, key: "meist_cta_text", value: ctaText },
      { page: PAGE, key: "meist_cta_button", value: ctaButton },
      { page: PAGE, key: "meist_mission_title", value: missionTitle },
      ...missionTexts.map((text, i) => ({ page: PAGE, key: `meist_mission_text_${i + 1}`, value: text })),
    ];
    const { error } = await supabase.from("website_content").upsert(updates, { onConflict: "page,key" });
    setSaving(false);
    if (!error) setSuccess(true);
  };

  // Stats handlers
  const handleStatChange = (idx: number, field: "value" | "label", val: string) => {
    setStats(stats => stats.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };
  const addStat = () => setStats([...stats, { value: "", label: "" }]);
  const removeStat = (idx: number) => setStats(stats => stats.filter((_, i) => i !== idx));

  // Promises handlers
  const handlePromiseChange = (idx: number, field: "icon" | "title" | "text", val: string) => {
    setPromises(promises => promises.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };
  const addPromise = () => setPromises([...promises, { icon: "check", title: "", text: "" }]);
  const removePromise = (idx: number) => setPromises(promises => promises.filter((_, i) => i !== idx));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meist lehe sisu haldus</h1>
      <p className="mb-4 text-gray-600">Siin saad muuta kogu /meist lehe teksti, numbreid ja lubadusi.</p>
      <form className="space-y-8 max-w-2xl" onSubmit={handleSave}>
        {/* Header/Description */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Pealkiri (header)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Meie lugu"
              value={header}
              onChange={e => setHeader(e.target.value)}
              disabled={loading || saving}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Highlight with red</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="lugu"
              value={headerHighlight}
              onChange={e => setHeaderHighlight(e.target.value)}
              disabled={loading || saving}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Kirjeldus (description)</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Tutvu meie missiooniga..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading || saving}
            />
          </div>
        </div>
        {/* Stats Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Numbrid (stat boxes)</h2>
          {stats.map((stat, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                className="border rounded px-2 py-1 w-24"
                placeholder="Väärtus"
                value={stat.value}
                onChange={e => handleStatChange(idx, "value", e.target.value)}
                disabled={loading || saving}
              />
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Silt"
                value={stat.label}
                onChange={e => handleStatChange(idx, "label", e.target.value)}
                disabled={loading || saving}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => removeStat(idx)} disabled={stats.length === 1 || loading || saving}>Eemalda</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addStat} disabled={loading || saving}>Lisa number</Button>
        </div>
        {/* Promises Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Lubadused (promise cards)</h2>
          {promises.map((promise, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-2 mb-4 items-center md:items-end">
              <select
                className="border rounded px-2 py-1 w-32"
                value={promise.icon}
                onChange={e => handlePromiseChange(idx, "icon", e.target.value)}
                disabled={loading || saving}
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Pealkiri"
                value={promise.title}
                onChange={e => handlePromiseChange(idx, "title", e.target.value)}
                disabled={loading || saving}
              />
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Kirjeldus"
                value={promise.text}
                onChange={e => handlePromiseChange(idx, "text", e.target.value)}
                disabled={loading || saving}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => removePromise(idx)} disabled={promises.length === 1 || loading || saving}>Eemalda</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addPromise} disabled={loading || saving}>Lisa lubadus</Button>
        </div>
        {/* CTA Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Kutse tegevusele (CTA)</h2>
          <div className="mb-2">
            <label className="block font-medium mb-1">Pealkiri (CTA title)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Valmis oma projekti alustama?"
              value={ctaTitle}
              onChange={e => setCtaTitle(e.target.value)}
              disabled={loading || saving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Kirjeldus (CTA text)</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Arutame su ideid ja loome koos midagi ainulaadset, mis esindab su brändi parimal viisil."
              rows={2}
              value={ctaText}
              onChange={e => setCtaText(e.target.value)}
              disabled={loading || saving}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nupp (CTA button text)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Küsi pakkumist"
              value={ctaButton}
              onChange={e => setCtaButton(e.target.value)}
              disabled={loading || saving}
            />
          </div>
        </div>
        {/* Mission Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Missioon</h2>
          <div className="mb-2">
            <label className="block font-medium mb-1">Pealkiri (Mission title)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Meie missioon"
              value={missionTitle}
              onChange={e => setMissionTitle(e.target.value)}
              disabled={loading || saving}
            />
          </div>
          {missionTexts.map((text, idx) => (
            <div className="mb-2" key={idx}>
              <label className="block font-medium mb-1">Lõik {idx + 1}</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder={`Missiooni lõik ${idx + 1}`}
                rows={2}
                value={text}
                onChange={e => setMissionTexts(missionTexts => missionTexts.map((t, i) => i === idx ? e.target.value : t))}
                disabled={loading || saving}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setMissionTexts(missionTexts => missionTexts.filter((_, i) => i !== idx))} disabled={missionTexts.length === 1 || loading || saving}>Eemalda</Button>
            </div>
          ))}
          {missionTexts.length < 3 && (
            <Button type="button" variant="secondary" size="sm" onClick={() => setMissionTexts([...missionTexts, ""])} disabled={loading || saving}>Lisa lõik</Button>
          )}
        </div>
        <Button type="submit" disabled={loading || saving}>
          {saving ? "Salvestan..." : "Salvesta kõik"}
        </Button>
        {success && <div className="text-green-600 mt-2">Salvestatud!</div>}
      </form>
    </div>
  );
};

export default MeistAdmin; 