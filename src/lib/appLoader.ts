/**
 * O app React só é EXECUTADO no toque de abertura (a intro fica 100% leve).
 * O arquivo já é baixado antes, em segundo plano (<link rel="prefetch"> gerado no build),
 * então no toque ele sai do cache e a animação do casulo cobre o tempo de montagem.
 */
let p: Promise<unknown> | null = null
export const loadApp = () => (p ??= import('../app/mount'))
