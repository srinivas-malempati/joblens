export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const APP_ID = process.env.ADZUNA_APP_ID || "066985d3";
  const APP_KEY = process.env.ADZUNA_APP_KEY || "e648460b34aada40793631c366254710";
  
  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=1&what=software+engineer`;
  
  try {
    const r = await fetch(url);
    const text = await r.text();
    return res.status(200).json({
      status: "ok",
      httpStatus: r.status,
      appId: APP_ID,
      appKeyFirst8: APP_KEY.slice(0,8),
      responsePreview: text.slice(0, 500),
    });
  } catch(e) {
    return res.status(200).json({
      status: "error",
      message: e.message,
      appId: APP_ID,
    });
  }
}
