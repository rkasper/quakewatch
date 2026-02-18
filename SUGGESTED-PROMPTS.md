# Suggested Prompts

## The big initial prompt
Create a "Quake Watch" earthquake dashboard using Vite + TypeScript (frontend only, no backend).

Features:
- Fetch recent earthquakes from USGS API (https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=50)
- Display as a list/cards showing: location, magnitude, time
- Filter by minimum magnitude (slider or dropdown)
- Click an earthquake to see details, including current weather at that location via Open-Meteo API (https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true)
- Clean, simple UI with CSS (no frameworks needed, but Tailwind is fine)

Constraints:
- No backend — all API calls from browser (both APIs are CORS-friendly)
- TypeScript only
- Must be deployable as a static site to DigitalOcean App Platform
- Keep it simple — we're building this in 30 minutes

Start by scaffolding the Vite project, then build incrementally.

## Continuing prompts as we go
- At the first possible stopping point - like a mostly static website - tell me how to run the server so I can see what we have.
- Are you shittin' me? Is that live data or mock data?
- Wowzer! Well then, let's deploy this as an app on DigitalOcean App Platform. Make sure we're in team Awesome Lab. 
- First, let's upgrade to the latest version of 'doctl'.
- It looks like doctl was previously authenticated, but the token expired. It's not prompting me to log in with a new token. How do I force it to log in with a new token?
- doctl is using the wrong context, for a different team. How do I specify which team context to use?
- How do I make awesome-lab the current context?
- Great! Let's go back to deploying this as an app on DigitalOcean App Platform. Make sure we're in team Awesome Lab.
- I just committed the code. Before I push it, help me rename the branch from 'master' to 'main'.
- I'm creating a new repo at github.com. What should I name the repo?
- Give me a description, and let's create an open source license file.
- Should we add a README before pushing, or just go?
- OK, I created the repo via WebStorm, and I pushed. Let's continue with DigitalOcean.
- That's good! And let's run it from NYC.
- Looks like it's done building. Let's continue.
