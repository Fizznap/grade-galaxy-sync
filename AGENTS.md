<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Student Success Score and risk rules live only in src/lib/scoring.ts (tested in scoring.test.ts); UI and AI both derive from it so numbers stay consistent.
- Signed-in pages live under src/routes/_authenticated (client-only gate); data reads use the browser client with RLS restricted to users with a role row.
- AI Insights runs in a server function (src/lib/ai.functions.ts) that grounds answers in the students table.
- Shared surfaces and navigation use semantic glass tokens and global surface utilities so the visual theme stays consistent without changing data or scoring behavior.
- Student feedback_score is not directly selectable; read it only via the student_feedback() RPC (admin/faculty all rows, student own row) and merge before scoring, so privacy is enforced in the database.
- Mock interview sessions are written only by server functions using the caller's authenticated client (RLS: owner insert/update, owner/admin/placement read); all validation, ownership checks and score computation happen server-side. No service-role key is required, so the feature works on external deployments (e.g. Vercel) where that key is unavailable.
