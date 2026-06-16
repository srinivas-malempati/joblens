export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const APP_ID = process.env.ADZUNA_APP_ID || "066985d3";
  const APP_KEY = process.env.ADZUNA_APP_KEY || "e648460b34aada40793631c366254710";
  const BASE = `https://api.adzuna.com/v1/api/jobs/us`;
  const AUTH = `app_id=${APP_ID}&app_key=${APP_KEY}`;

  const safeFetch = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const r = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      clearTimeout(timeout);
      console.error("Fetch error:", url, e.message);
      return null;
    }
  };

  const { type } = req.query;

  try {
    if (type === "overview") {
      const [total, remote, senior, junior, mid,
        it, eng, health, finance, sales, marketing, hr, teaching, trade, logistics
      ] = await Promise.all([
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=software+engineer`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=remote+developer`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=senior+engineer`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=junior+developer`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=mid+level+developer`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=it-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=engineering-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=healthcare-nursing-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=finance-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=sales-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=marketing-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=hr-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=teaching-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=trade-construction-jobs`),
        safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&category=logistics-warehouse-jobs`),
      ]);

      return res.status(200).json({
        totalJobs: total?.count || 0,
        remoteJobs: remote?.count || 0,
        seniorJobs: senior?.count || 0,
        juniorJobs: junior?.count || 0,
        midJobs: mid?.count || 0,
        categoryData: [
          { name: "IT & Tech", count: it?.count || 0 },
          { name: "Engineering", count: eng?.count || 0 },
          { name: "Healthcare", count: health?.count || 0 },
          { name: "Finance", count: finance?.count || 0 },
          { name: "Sales", count: sales?.count || 0 },
          { name: "Marketing", count: marketing?.count || 0 },
          { name: "HR", count: hr?.count || 0 },
          { name: "Teaching", count: teaching?.count || 0 },
          { name: "Trade", count: trade?.count || 0 },
          { name: "Logistics", count: logistics?.count || 0 },
        ].sort((a, b) => b.count - a.count),
      });
    }

    if (type === "roles") {
      const roles = [
        "software engineer", "product manager", "data scientist",
        "devops engineer", "UX designer", "QA engineer",
        "machine learning engineer", "business analyst",
        "frontend developer", "backend developer"
      ];
      const results = await Promise.all(
        roles.map(role =>
          safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=${encodeURIComponent(role)}`)
            .then(d => ({ role, count: d?.count || 0 }))
        )
      );
      return res.status(200).json(results.sort((a, b) => b.count - a.count));
    }

    if (type === "locations") {
      const cities = [
        "New York", "San Francisco", "Austin", "Seattle",
        "Chicago", "Boston", "Los Angeles", "Denver", "Atlanta", "Remote"
      ];
      const results = await Promise.all(
        cities.map(city =>
          safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&where=${encodeURIComponent(city)}&what=software`)
            .then(d => ({ city, count: d?.count || 0 }))
        )
      );
      return res.status(200).json(results.sort((a, b) => b.count - a.count));
    }

    if (type === "salary") {
      const roles = [
        "software engineer", "product manager", "data scientist",
        "devops engineer", "UX designer", "QA engineer",
        "machine learning engineer", "business analyst"
      ];
      const results = await Promise.all(
        roles.map(async role => {
          const d = await safeFetch(`${BASE}/history?${AUTH}&what=${encodeURIComponent(role)}&months=3`);
          if (!d?.month) return { role, avgSalary: 0, jobCount: 0 };
          const months = Object.values(d.month);
          const avg = months.length
            ? Math.round(months.reduce((s, m) => s + (m.median || 0), 0) / months.length)
            : 0;
          return { role, avgSalary: avg, jobCount: d.count || 0 };
        })
      );
      return res.status(200).json(results.filter(r => r.avgSalary > 0));
    }

    if (type === "listings") {
      const d = await safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=15&what=software+engineer&sort_by=date`);
      const jobs = (d?.results || []).map(j => ({
        id: j.id,
        title: j.title,
        company: j.company?.display_name || "—",
        location: j.location?.display_name || "—",
        salaryMin: j.salary_min || null,
        salaryMax: j.salary_max || null,
        created: j.created,
        url: j.redirect_url,
        category: j.category?.label || "—",
      }));
      return res.status(200).json(jobs);
    }

    if (type === "skills") {
      const skills = [
        "python", "javascript", "react", "AWS", "SQL",
        "kubernetes", "typescript", "machine learning", "docker", "golang"
      ];
      const results = await Promise.all(
        skills.map(skill =>
          safeFetch(`${BASE}/search/1?${AUTH}&results_per_page=1&what=${encodeURIComponent(skill)}`)
            .then(d => ({ skill, count: d?.count || 0 }))
        )
      );
      return res.status(200).json(results.sort((a, b) => b.count - a.count));
    }

    return res.status(400).json({ error: "Unknown type" });

  } catch (e) {
    console.error("Handler error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
