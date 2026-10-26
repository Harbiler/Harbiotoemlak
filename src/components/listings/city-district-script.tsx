import { CITIES } from "@/lib/cities";

/**
 * Progressive-enhancement cascade for İl → İlçe.
 * Runs from the initial HTML even before React hydrates.
 */
export function CityDistrictScript() {
  const payload = JSON.stringify(CITIES);
  const code = `
(function(){
  if (window.__hbCityDistrictBound) return;
  window.__hbCityDistrictBound = true;
  window.__hbCities = ${payload};
  function fillDistrict(dist, city) {
    var cities = window.__hbCities || {};
    var active = city && city !== "hepsi" ? city : "";
    var list = active && cities[active] ? cities[active] : [];
    dist.innerHTML = "";
    var first = document.createElement("option");
    first.value = "hepsi";
    first.textContent = list.length ? "Tüm ilçeler" : "Önce il seçin";
    dist.appendChild(first);
    for (var i = 0; i < list.length; i++) {
      var opt = document.createElement("option");
      opt.value = list[i];
      opt.textContent = list[i];
      dist.appendChild(opt);
    }
    dist.value = "hepsi";
    dist.disabled = !list.length;
  }
  document.addEventListener("change", function(e) {
    var t = e.target;
    if (!t || t.getAttribute("data-hb-role") !== "city") return;
    var id = t.getAttribute("data-hb-district-id");
    var dist = id ? document.getElementById(id) : null;
    if (!dist) return;
    fillDistrict(dist, t.value || "hepsi");
  }, true);
})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      // Suppress hydration mismatch — static bootstrap only.
      suppressHydrationWarning
    />
  );
}
