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
  // Always rewrite catalogs on remount/HMR. Binding listeners only once avoids
  // duplicate handlers, but a stale __hbBrandCatalogs left TVS Model partial.
  const code = `
(function(){
  window.__hbBrandCatalogs = ${payload};
  function resolveBrand(catalog, brand) {
    if (!brand || brand === "hepsi") return "";
    if (catalog[brand]) return brand;
    var lower = String(brand).toLocaleLowerCase("tr");
    var keys = Object.keys(catalog);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLocaleLowerCase("tr") === lower) return keys[i];
    }
    var stripped = lower.replace(/\\s+(motor|motors|motosiklet|moto)s?$/i, "").trim();
    if (stripped && stripped !== lower) {
      for (var j = 0; j < keys.length; j++) {
        if (keys[j].toLocaleLowerCase("tr") === stripped) return keys[j];
      }
    }
    return "";
  }
  function fillModel(modelSel, brand, category, keepValue) {
    var catalogs = window.__hbBrandCatalogs || {};
    var catalog = catalogs[category] || {};
    var active = resolveBrand(catalog, brand && brand !== "hepsi" ? brand : "");
    var list = active && catalog[active] ? catalog[active].slice() : [];
    var prev = keepValue ? modelSel.value : "hepsi";
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
    modelSel.disabled = !list.length;
    if (prev && prev !== "hepsi" && list.indexOf(prev) !== -1) {
      modelSel.value = prev;
    } else {
      modelSel.value = "hepsi";
    }
    modelSel.setAttribute("data-hb-model-count", String(list.length));
  }
  // Always publish the latest filler so a listener bound on first paint
  // still calls the refreshed implementation after HMR/remount.
  window.__hbFillBrandModel = fillModel;
  window.__hbResolveBrand = resolveBrand;
  function refreshOpenBrandModels() {
    var brands = document.querySelectorAll('select[data-hb-role="brand"]');
    for (var i = 0; i < brands.length; i++) {
      var brandSel = brands[i];
      var id = brandSel.getAttribute("data-hb-model-id");
      var modelSel = id ? document.getElementById(id) : null;
      if (!modelSel) continue;
      window.__hbFillBrandModel(
        modelSel,
        brandSel.value || "hepsi",
        brandSel.getAttribute("data-hb-category") || "",
        true
      );
    }
  }
  // Remount / HMR: catalogs already updated above — re-sync any visible Model selects.
  if (window.__hbBrandModelBound) {
    refreshOpenBrandModels();
    return;
  }
  window.__hbBrandModelBound = true;
  document.addEventListener("change", function(e) {
    var t = e.target;
    if (!t || t.getAttribute("data-hb-role") !== "brand") return;
    var id = t.getAttribute("data-hb-model-id");
    var modelSel = id ? document.getElementById(id) : null;
    if (!modelSel) return;
    var fill = window.__hbFillBrandModel;
    if (!fill) return;
    fill(modelSel, t.value || "hepsi", t.getAttribute("data-hb-category") || "", false);
  }, true);
  // Initial sync for SSR-selected brands (URL marka=…).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refreshOpenBrandModels);
  } else {
    refreshOpenBrandModels();
  }
})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
