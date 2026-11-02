const formatDate = (value, locale = "es-MX") =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Mexico_City",
  }).format(new Date(`${value}T12:00:00-06:00`));

const setHeadlineMetrics = (data) => {
  const metrics = document.querySelectorAll(".metrics article");
  const { instagram, tiktok } = data.headline;
  metrics[0].querySelector("strong").textContent = new Intl.NumberFormat(
    "es-MX",
  ).format(instagram.followers);
  const followerDateEs = `Al ${formatDate(instagram.followersAsOf)}`;
  const followerDateEn = `As of ${formatDate(instagram.followersAsOf, "en-US")}`;
  metrics[0].querySelector("small").dataset.es = followerDateEs;
  metrics[0].querySelector("small").dataset.en = followerDateEn;
  metrics[0].querySelector("small").textContent = followerDateEs;
  metrics[1].querySelector("strong").textContent = new Intl.NumberFormat(
    "es-MX",
  ).format(instagram.views);
  const viewsDateEs = `${formatDate(instagram.viewsFrom)} – ${formatDate(instagram.viewsTo)} · todos los formatos`;
  const viewsDateEn = `${formatDate(instagram.viewsFrom, "en-US")} – ${formatDate(instagram.viewsTo, "en-US")} · all formats`;
  metrics[1].querySelector("small").dataset.es = viewsDateEs;
  metrics[1].querySelector("small").dataset.en = viewsDateEn;
  metrics[1].querySelector("small").textContent = viewsDateEs;
  metrics[2].querySelector("strong").textContent = tiktok.followersDisplay;
  const tiktokDateEs = `Cifra redondeada · última verificación ${formatDate(tiktok.lastVerified)}`;
  const tiktokDateEn = `Rounded figure · last verified ${formatDate(tiktok.lastVerified, "en-US")}`;
  metrics[2].querySelector("small").dataset.es = tiktokDateEs;
  metrics[2].querySelector("small").dataset.en = tiktokDateEn;
  metrics[2].querySelector("small").textContent = tiktokDateEs;
};

const setSourceNotes = (data) => {
  const source = document.querySelector("#sources div");
  const { headline, report } = data;
  const es = `<p><b>Instagram:</b> Metricool, cuenta pamsho_. Seguidores: último registro, ${formatDate(headline.instagram.followersAsOf)}. Visualizaciones: suma de 30 registros diarios entre ${formatDate(headline.instagram.viewsFrom)} y ${formatDate(headline.instagram.viewsTo)}, zona ${report.timezone}, métrica IGEV05. Incluye todos los formatos, datos orgánicos y pagados; no es alcance ni personas únicas.</p><p><b>Demografía:</b> Metricool, consulta ${formatDate(report.checked)}. Instagram: IGAG01/02/03 e IGDP01/02; la base de edad y género suma las categorías devueltas (M/F/U) y no se fuerza al total de seguidores. YouTube: YTDA01/02, YTDG01/02 e YTDP01/02. Facebook: FBDP03/04; edad y género no disponible porque la fuente los marca como descontinuados. Las proporciones 0–1 se muestran como porcentajes; no se mezclan audiencias entre redes.</p><p><b>TikTok:</b> no estaba conectado en Metricool al ${formatDate(report.checked)}. Se conserva la última fotografía pública verificable de <a href="https://beacons.ai/pamsho/mediakit" target="_blank" rel="noopener">Beacons</a>, consultada el ${formatDate(headline.tiktok.lastVerified)}, incluido su redondeo y su ventana de últimos 30 días; no se presentan ceros ni cifras nuevas no comprobables.</p>`;
  const en = `<p><b>Instagram:</b> Metricool, pamsho_ account. Followers: latest record, ${formatDate(headline.instagram.followersAsOf, "en-US")}. Views: sum of 30 daily records from ${formatDate(headline.instagram.viewsFrom, "en-US")} through ${formatDate(headline.instagram.viewsTo, "en-US")}, ${report.timezone} timezone, metric IGEV05. Includes all formats and organic and paid views; this is not reach or unique people.</p><p><b>Demographics:</b> Metricool, checked ${formatDate(report.checked, "en-US")}. Instagram: IGAG01/02/03 and IGDP01/02; the age and gender base sums returned categories (M/F/U) and is not forced to follower total. YouTube: YTDA01/02, YTDG01/02 and YTDP01/02. Facebook: FBDP03/04; age and gender are unavailable because the source marks them discontinued. Source proportions from 0–1 are displayed as percentages; audiences are not combined across networks.</p><p><b>TikTok:</b> it was not connected in Metricool as of ${formatDate(report.checked, "en-US")}. The last publicly verifiable <a href="https://beacons.ai/pamsho/mediakit" target="_blank" rel="noopener">Beacons</a> snapshot, checked ${formatDate(headline.tiktok.lastVerified, "en-US")}, is retained, including its rounding and stated last-30-days window; no zeros or unverified new figures are shown.</p>`;
  source.dataset.es = es;
  source.dataset.en = en;
  source.innerHTML = document.documentElement.lang === "en" ? en : es;
};

fetch("data/audience.json")
  .then((response) => {
    if (!response.ok)
      throw new Error(`Could not load audience data (${response.status})`);
    return response.json();
  })
  .then((data) => {
    window.MEDIA_KIT_METRICS = data.headline;
    window.AUDIENCE_DATA = data.audience;
    setHeadlineMetrics(data);
    setSourceNotes(data);
    window.dispatchEvent(new CustomEvent("media-kit-data-ready"));
  })
  .catch((error) =>
    console.error("Media kit data could not be loaded.", error),
  );
