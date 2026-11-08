/** Fundo aurora: manchas de gradiente se movendo devagar (só transform) + granulado. */
export function Aurora() {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <div className="aurora-inner">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
