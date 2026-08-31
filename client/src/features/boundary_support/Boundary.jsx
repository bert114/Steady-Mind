import { useBoundaryHook } from "./useBoundaryHook.jsx";
import "./boundary.css";

export default function BoundaryGenerator() {
  const {
    TONES,
    TONE_LABEL,
    formatDate,
    situation,
    setSituation,
    tone,
    setTone,
    draftTone,
    message,
    source,
    savedId,
    draftCount,
    loading,
    saving,
    error,
    history,
    historyLoading,
    generateBoundary,
    save,
    copyText,
    expandedId,
    toggleExpanded,
    draftRef,
    handleSubmit,
  } = useBoundaryHook();

  return (
    <div className="boundary-page">
      <header className="boundary-head">
        <p className="boundary-kicker">Field note · Boundary</p>
        <h1 className="boundary-title">Draw the line.</h1>
        <p className="boundary-intro">
          Describe what keeps asking too much of you. Choose how straight you
          want to say it, and Aura drafts the exact words.
        </p>
      </header>

      <form className="boundary-form" onSubmit={handleSubmit}>
        <div className="field">
          <label
            className="field-label"
            htmlFor="boundary-situation"
            id="boundary-situation-label"
          >
            Situation
          </label>
          <textarea
            id="boundary-situation"
            className="boundary-textarea"
            rows={4}
            maxLength={500}
            placeholder="My friend keeps inviting me out and I'm too drained to keep explaining why."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            required
          />
        </div>

        <fieldset className="field tone-fieldset">
          <legend className="field-label">Tone</legend>
          <div
            className="tone-row"
            role="radiogroup"
            aria-labelledby="boundary-tone-label"
          >
            <span id="boundary-tone-label" className="visually-hidden">
              Tone of the message
            </span>
            {TONES.map((t) => {
              const active = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`tone-option tone-option--${t.id}${
                    active ? " is-active" : ""
                  }`}
                  onClick={() => setTone(t.id)}
                >
                  <span className="tone-specimen" aria-hidden="true">
                    <span className={`tone-line tone-line--${t.id}`} />
                  </span>
                  <span className="tone-name">{t.label}</span>
                  <span className="tone-note">{t.note}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <p className="boundary-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="boundary-submit"
          disabled={loading || !situation.trim()}
        >
          {loading ? "Drafting…" : "Draft the message"}
        </button>
      </form>

      {message && (
        <section className="draft" aria-live="polite" ref={draftRef}>
          <div
            key={`rule-${draftCount}`}
            className={`boundary-rule boundary-rule--${draftTone}`}
            aria-hidden="true"
          />
          <div key={`note-${draftCount}`} className="boundary-note">
            <div className="boundary-note-head">
              <span className="boundary-note-tone">
                {TONE_LABEL[draftTone] ?? draftTone}
              </span>
              {source === "fallback" && (
                <span className="boundary-note-source">offline draft</span>
              )}
            </div>
            <blockquote className="boundary-note-text">{message}</blockquote>
            <div className="boundary-note-actions">
              <button
                type="button"
                className="note-action"
                onClick={() => copyText(message)}
              >
                Copy
              </button>
              <button
                type="button"
                className="note-action"
                onClick={generateBoundary}
                disabled={loading || !situation.trim()}
              >
                {loading ? "Drafting…" : "Draft again"}
              </button>
              <button
                type="button"
                className="note-action note-action--primary"
                onClick={save}
                disabled={saving || !!savedId}
              >
                {savedId ? "Saved" : saving ? "Saving…" : "Save to field notes"}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="history" aria-labelledby="history-heading">
        <div className="history-head">
          <h2 id="history-heading" className="history-title">
            Kept boundaries
          </h2>
          <span className="history-count">
            {historyLoading ? "" : `${history.length} saved`}
          </span>
        </div>

        {historyLoading ? (
          <p className="history-empty">Reading your field notes…</p>
        ) : history.length === 0 ? (
          <p className="history-empty">
            Nothing kept yet. When a draft lands the way you want, save it here
            so the framing is on hand next time.
          </p>
        ) : (
          <ul className="history-list">
            {history.map((row) => {
              const isOpen = expandedId === row.id;
              return (
                <li
                  key={row.id}
                  className={`history-item history-item--${row.tone}`}
                >
                  <button
                    type="button"
                    className="history-item-head"
                    onClick={() => toggleExpanded(row.id)}
                    aria-expanded={isOpen}
                    aria-controls={`history-${row.id}`}
                  >
                    <span className="history-specimen" aria-hidden="true">
                      <span className={`tone-line tone-line--${row.tone}`} />
                    </span>
                    <span className="history-situation">{row.situation}</span>
                    <span className="history-meta">
                      {formatDate(row.created_at)} ·{" "}
                      {TONE_LABEL[row.tone] ?? row.tone}
                    </span>
                  </button>
                  <div
                    id={`history-${row.id}`}
                    className={`history-body${isOpen ? " is-open" : ""}`}
                  >
                    <p className="history-message">{row.message}</p>
                    <button
                      type="button"
                      className="history-copy"
                      onClick={() => copyText(row.message)}
                    >
                      Copy
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}