export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const APP_ID = process.env.ADZUNA_APP_ID || "066985d3";
  const APP_KEY = process.env.ADZUNA_APP_KEY || "e648460b34aada40793631c366254710";
  const BASE = `https://api.adzuna.com/v1/api/jobs`;

  const safeFetch = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const r = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      clearTimeout(timeout);
      throw new Error(`Fetch failed: ${e.message}`);
    }
  };

  const { type } = req.query;
  const country = "us";
  const auth = `app_id=${APP_ID}&app_key=${APP_KEY}`;

  try {
    if (type === "overview") {
      // Fetch multiple categories in parallel
      const categories = [
        "it-jobs", "engineering-jobs", "healthcare-nursing-jobs",
        "finance-jobs", "sales-jobs", "marketing-jobs",
        "hr-jobs", "teaching-jobs", "trade-construction-jobs", "logistics-warehouse-jobs"
      ];

      const [
        totalJobs,
        remoteJobs,
        seniorJobs,
        juniorJobs,
        midJobs,
        ...catResults
      ] = await Promise.all([
        safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=developer`),
        safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=remote`),
        safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=senior`),
        safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=junior`),
        safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=mid+level`),
        ...categories.map(cat =>
          safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&category=${cat}`)
        ),
      ]);

      const categoryData = categories.map((cat, i) => ({
        name: cat.replace(/-jobs$/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        count: catResults[i]?.count || 0,
      })).sort((a, b) => b.count - a.count);

      return res.status(200).json({
        totalJobs: totalJobs?.count || 0,
        remoteJobs: remoteJobs?.count || 0,
        seniorJobs: seniorJobs?.count || 0,
        juniorJobs: juniorJobs?.count || 0,
        midJobs: midJobs?.count || 0,
        categoryData,
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
          safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=${encodeURIComponent(role)}`)
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
          safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&where=${encodeURIComponent(city)}&what=software`)
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
        roles.map(role =>
          safeFetch(`${BASE}/${country}/history?${auth}&what=${encodeURIComponent(role)}&months=3`)
            .then(d => {
              const months = Object.values(d?.month || {});
              const avg = months.length ? Math.round(months.reduce((s, m) => s + (m.median || 0), 0) / months.length) : 0;
              return { role, avgSalary: avg, jobCount: d?.count || 0 };
            }).catch(() => ({ role, avgSalary: 0, jobCount: 0 }))
        )
      );
      return res.status(200).json(results.filter(r => r.avgSalary > 0));
    }

    if (type === "listings") {
      const d = await safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=15&what=software+engineer&sort_by=date`);
      const jobs = (d?.results || []).map(j => ({
        id: j.id,
        title: j.title,
        company: j.company?.display_name || "—",
        location: j.location?.display_name || "—",
        salaryMin: j.salary_min,
        salaryMax: j.salary_max,
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
          safeFetch(`${BASE}/${country}/search/1?${auth}&results_per_page=1&what=${encodeURIComponent(skill)}`)
            .then(d => ({ skill, count: d?.count || 0 }))
        )
      );
      return res.status(200).json(results.sort((a, b) => b.count - a.count));
    }

    return res.status(400).json({ error: "Unknown type" });

  } catch (e) {
    return res.status(500).json({ error: e.message || "API error" });
  }
}
