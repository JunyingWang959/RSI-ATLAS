# RSI Atlas website

Static website only: overview leaderboard, task descriptions, complete trajectory visualizations, and the English results article.

## Publish

Upload the contents of this folder to the repository root. In GitHub Pages settings, choose Deploy from a branch, your publication branch, and / (root).

Open `index.html` for the website and `report/REPORT.html` for the article. For a local preview, run `python -m http.server 18201` in this folder and visit http://localhost:18201/.

The result snapshot and research records are embedded in the page. Charts run in the browser without a backend or API keys. Google Fonts are optional; system fonts are used when unavailable.

This package excludes experiment runners, evaluation code, frozen artifact source files, datasets, and build tools. The trajectory view uses recorded scores and research notes; artifact files are not distributed in this website-only package.

Original website code is licensed under MIT. No external upload has been performed by packaging these files.

## Results scope

The overall leaderboard covers 50 tasks: 10 open-source and 40 closed-source. Final aggregate scores were supplied by the project owner from experiments on another computer; the three updated model summaries replace the previous values, with other models retained as instructed. The bundled public-task traces remain the earlier recorded evidence and do not constitute the full 50-task evaluation dataset.
