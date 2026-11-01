import { bindings, defineConfig } from 'cf/config'

const productionDatabaseId = '561d7f5d-4cf7-425c-81a6-8d425e6ed2f1'
const productionCompatibilityDate = '2026-11-01'
const localCompatibilityDate = '2026-10-30'

export default defineConfig(({ mode }) => {
  return {
    worker: {
      name: 'ideating-labs',
      entrypoint: './worker/index.ts',
      compatibilityDate:
        mode === 'development'
          ? localCompatibilityDate
          : productionCompatibilityDate,
      assets: {
        notFoundHandling: 'single-page-application',
        runWorkerFirst: ['/api/*'],
      },
      env: {
        DB: bindings.d1({
          name: 'ideating-labs-products',
          id: productionDatabaseId,
        }),
        CATALOG_API_ORIGIN: bindings.text(
          mode === 'development' ? 'https://ideatinglabs.com' : '',
        ),
        ADMIN_API_KEY: bindings.secret(),
      },
      observability: {
        enabled: true,
        logs: {
          enabled: true,
          headSamplingRate: 1,
        },
        traces: {
          enabled: true,
          headSamplingRate: 0.01,
        },
      },
    },
  }
})
