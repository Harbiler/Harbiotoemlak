import {
  MOTORSIKLET_BRANDS,
  VASITA_BRANDS,
  YEDEK_PARCA_BRANDS,
} from "@/lib/brand-models";
import { allVasitaBrandCatalogs } from "@/lib/vasita-subcategories";

/**
 * Progressive-enhancement cascade for Marka → Model.
 * Runs from the initial HTML even before React hydrates.
 */
export function BrandModelScript() {
  const catalogs = {
    ...allVasitaBrandCatalogs(),
    vasita: VASITA_BRANDS,
    motorsiklet: MOTORSIKLET_BRANDS,
    "yedek-parca": YEDEK_PARCA_BRANDS,
  };
  const payload = JSON.stringify(catalogs);
  const code = `
(function(){
  if (window.__hbBrandModelBound) return;
  window.__hbBrandModelBound = true;
  window.__hbBrandCatalogs = ${payload};
  function fillModel(modelSel, brand, category) {
    var catalogs = window.__hbBrandCatalogs || {};
    var catalog = catalogs[category] || {};
    var active = brand && brand !== "hepsi" ? brand : "";
    var list = active && catalog[active] ? catalog[active] : [];
    modelSel.innerHTML = "";
    var first = document.createElement("option");
    first.value = "hepsi";
    first.textContent = list.length ? "Tüm modeller" : "Önce marka seçin";
    modelSel.appendChild(first);
    for (var i = 0; i < list.length; i++) {
      var opt = document.createElement("option");
      opt.value = list[i];
      opt.textContent = list[i];
      modelSel.appendChild(opt);
    }
    modelSel.value = "hepsi";
    modelSel.disabled = !list.length;
  }
  document.addEventListener("change", function(e) {
    var t = e.target;
    if (!t || t.getAttribute("data-hb-role") !== "brand") return;
    var id = t.getAttribute("data-hb-model-id");
    var modelSel = id ? document.getElementById(id) : null;
    if (!modelSel) return;
    fillModel(modelSel, t.value || "hepsi", t.getAttribute("data-hb-category") || "");
  }, true);
})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
