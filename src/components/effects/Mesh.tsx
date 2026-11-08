/** Fundo: gradiente mesh perolado com manchas lilás/rosa/ciano se movendo devagar (só transform) + grão. */
export function Mesh() {
  return (
    <>
      <div className="mesh" aria-hidden="true">
        <div className="mesh-inner">
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
